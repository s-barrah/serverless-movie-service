import axios from 'axios';

// Models
import ResponseModel, {Status, StatusCode} from "../models/response.model";


// Interfaces
import { IMovieCredit } from '../interfaces/movie-credit.interface';
// @ts-ignore
import { IMovie } from "../interfaces/movie.interface";
import { ISearchPersonResult } from "../interfaces/search-person.interface";
import { IActor } from '../interfaces/actor.interface';
interface IActorWithMovies {
  movies?: IMovie[]
}

const { API_URL, API_KEY } = process.env;
const TMDB_STATIC_ASSETS_URL = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER_ASSET_URL = "https://via.placeholder.com/500.jpg"


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
   * @param withMovies
   */
  async getSuggestedActors(name: string, withMovies: boolean = false): Promise<{ actors: IActorWithMovies[]}> {
    const response = await this.getActor(name);
    const promises = response.map(async ( { id }) => {
      const actor = await this.getPerson(id);
      let movies;
      if (withMovies) {
        const movieResults = await this.getMoviesByActor(id);
        movies = movieResults.filter((movie) => !!movie)
      }
      const results = {
        ...actor,
      } as IActorWithMovies;
      if (movies) {
        results.movies = movies;
      }

      return results;
    });
    const actors = await Promise.all(promises);
    return { actors };
  }

  /**
   * Function to get movies
   * where two actors are cast
   * @param names
   */
  async getMoviesByActors(names: string): Promise<{ movies: IMovie[]}> {
    const namesArray = names.split(',')
    if (namesArray.length > 2) {
      throw new ResponseModel(null, StatusCode.BAD_REQUEST, Status.BAD_REQUEST);
    }
    const promises = namesArray.map(async (name) => {
      const response = await this.getActor(name);
      const { id } = response[0];
      const movies = await this.getMoviesByActor(id);
      return movies.filter((movie) => !!movie)
    });
    const result = await Promise.all(promises);
    const matches = result[0].filter((movie) => {
      if (movie.id) {
        return result[1].find((movie2) => movie?.id === movie2?.id);
      }
    })
    return {
      movies: [...new Set(matches)],
    };
  }

  async getMoviesByActor(actorId: number): Promise<IMovie[]> {
    const actorMoviesAndCredits = await this.getMoviesAndCredits(actorId);
    const promises = actorMoviesAndCredits.map(async (movieCredit) => {
      const movie = await this.getMovie(movieCredit.id);
      return movie || null
    })
    return Promise.all(promises)
  }

  /**
   * Function to get movies
   * where an actor is credited
   * @param actorId
   */
  getMoviesAndCredits(actorId: number): Promise<IMovieCredit[]> {
    return axios
      .get(
        `${API_URL}person/${actorId}/combined_credits?api_key=${API_KEY}&language=en-US`
      )
      .then((response) => {
        return response?.data?.cast?.map((movie) => {
          const { poster_path, backdrop_path } = movie;
          const placeholder = `${PLACEHOLDER_ASSET_URL}?${movie.title}`
          const movieClone = movie;
          movieClone.poster_path = poster_path ? `${TMDB_STATIC_ASSETS_URL}${poster_path}` : placeholder;
          movieClone.backdrop_path = backdrop_path ? `${TMDB_STATIC_ASSETS_URL}${backdrop_path}` : placeholder;
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
  getMovie(movieId: number): Promise<IMovie> {
    return new Promise((resolve) => {
      return axios
          .get(`${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`)
          .then((response) => {
            const movie = response.data;
            const { poster_path, backdrop_path } = movie;
            const placeholder = `${PLACEHOLDER_ASSET_URL}?${movie.title}`
            movie.poster_path = poster_path ? `${TMDB_STATIC_ASSETS_URL}${poster_path}` : placeholder;
            movie.backdrop_path = backdrop_path ? `${TMDB_STATIC_ASSETS_URL}${backdrop_path}` : placeholder;
            resolve(movie)
          })
          .catch(() => {
            resolve(null)
          });
    })

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
