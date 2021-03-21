import axios from 'axios';

// Interfaces
import { IMovie } from '../interfaces/movie.interface';
import { IActor, ISearchPersonResult } from '../interfaces/actor.interface';

// Models
import ResponseModel, {Status, StatusCode} from "../models/response.model";

const { API_URL, API_KEY } = process.env;

export default class MovieService {

  /**
   * Function to search for actors
   * from the person endpoint
   * @param name
   */
  getActor(name: string): Promise<ISearchPersonResult[]> {
    return axios
      .get(
        `${API_URL}search/person?api_key=${API_KEY}&language=en-US&query=${name}`
      )
      .then((response) => response.data.results)
      .catch((error) => {
        console.log('getMovie ERROR: ', error);
      });
  }

  /**
   * Function to get suggested actors
   * @param name
   */
  async getSuggestedActors(name: string) {
    const response = await this.getActor(name);
    const promises = response.map(async ( { id }) => {
      const actor = await this.getPerson(id);
      const movies = await this.getMoviesAndCredits(id);
      return {
        ...actor,
        movies,
      };
    });
    const actors = await Promise.all(promises);
    return { actors };
  }

  /**
   * Function to get movies
   * where two actors are cast
   * @param names
   */
  async getMoviesByActors(names: string) {
    const namesArray = names.split(',')
    if (namesArray.length > 2) {
      throw new ResponseModel(null, StatusCode.BAD_REQUEST, Status.BAD_REQUEST);
    }
    const promises = namesArray.map(async (name) => {
      const response = await this.getActor(name);
      const { id } = response[0];
      return this.getMoviesAndCredits(id);
    });
    const result = await Promise.all(promises);
    const matches = result[0].filter((movie) => {
      return result[1].find((movie2) => movie.id === movie2.id);
    })
    return {
      movies: matches,
    };
  }

  /**
   * Function to get movies
   * where an actor is credited
   * @param actorId
   */
  getMoviesAndCredits(actorId: number): Promise<IMovie[]> {
    return axios
      .get(
        `${API_URL}person/${actorId}/combined_credits?api_key=${API_KEY}&language=en-US`
      )
      .then((response) => {
        return response?.data?.cast?.map((movie) => {
          const { poster_path, backdrop_path } = movie;
          const placeholder = `https://via.placeholder.com/500.jpg?${movie.title}`
          const movieClone = movie;
          movieClone.poster_path = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : placeholder;
          movieClone.backdrop_path = backdrop_path ? `https://image.tmdb.org/t/p/w500${backdrop_path}` : placeholder;
          return movieClone;
        });
      })
      .catch((error) => {
        console.log('getMovie ERROR: ', error);
      });
  }

  /**
   * Function to get movie details
   * from movie endpoint
   * @param movieId
   */
  getMovie(movieId: number) {
    return axios
        .get(`${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`)
        .then((response) => {
          const movie = response.data;
          movie.poster_path = `https://image.tmdb.org/t/p/w500${response.data.poster_path}`;
          movie.backdrop_path = `https://image.tmdb.org/t/p/w500${response.data.backdrop_path}`;
          return movie
        })
        .catch((error) => console.log('getMovie ERROR: ', error));
  }

  /**
   * Function to get actor's details
   * from the person endpoint
   * @param id
   */
  getPerson(id: number): Promise<IActor> {
    return axios
      .get(`${API_URL}person/${id}?api_key=${API_KEY}&language=en-US`)
      .then((response) => response.data)
      .catch((error) => console.log('getPerson ERROR: ', error));
  }
}
