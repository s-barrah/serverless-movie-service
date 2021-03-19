import axios from 'axios';

// Interfaces
import { IMovie } from '../interfaces/movie.interface';
import { IActor, ISearchPersonResult } from '../interfaces/actor.interface';

const { API_URL, API_KEY } = process.env;

export default class MovieService {
  getActor(query: string): Promise<ISearchPersonResult[]> {
    return axios
      .get(
        `${API_URL}search/person?api_key=${API_KEY}&language=en-US&query=${query}`
      )
      .then((response) => response.data.results)
      .catch((error) => {
        console.log('getMovie ERROR: ', error);
      });
  }

  async getMoviesByActor(name: string) {
    const response = await this.getActor(name);
    const { id } = response[0];
    const actor = await this.getPerson(id);
    const movies = await this.getMoviesAndCredits(id);
    return {
      ...actor,
      movies,
    };
  }

  async getSuggestedNames(name: string) {
    const response = await this.getActor(name);
    return response.map((result) => result.name);
  }

  getMoviesAndCredits(actorId: number): Promise<IMovie[]> {
    return axios
      .get(
        `${API_URL}person/${actorId}/combined_credits?api_key=${API_KEY}&language=en-US`
      )
      .then((response) => {
        return response?.data?.cast?.map((movie) => {
          const movieClone = movie;
          movieClone.poster_path = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
          movieClone.backdrop_path = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;
          return movieClone;
        });
      })
      .catch((error) => {
        console.log('getMovie ERROR: ', error);
      });
  }

  getPerson(id: number): Promise<IActor> {
    return axios
      .get(`${API_URL}person/${id}?api_key=${API_KEY}&language=en-US`)
      .then((response) => response.data)
      .catch((error) => console.log('getPerson ERROR: ', error));
  }
}
