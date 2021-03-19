export interface IActor {
  birthday: string;
  known_for_department: string;
  deathday: string;
  id: number;
  name: string;
  also_known_as: string[];
  gender: number;
  biography: string;
  popularity: number;
  place_of_birth: string;
  profile_path: string;
  adult: boolean;
  imdb_id: string;
  homepage: string;
}

export interface ISearchPersonResult {
  adult: false;
  gender: number;
  id: number;
  known_for: [
    {
      adult: false;
      backdrop_path: string;
      genre_ids: number[];
      id: number;
      media_type: string;
      original_language: string;
      original_title: string;
      overview: string;
      poster_path: string;
      release_date: string;
      title: string;
      video: boolean;
      vote_average: number;
      vote_count: number;
    }
  ];
  known_for_department: string;
  name: string;
  popularity: number;
  profile_path: string;
}
