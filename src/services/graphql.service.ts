import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
} from 'graphql';

import MovieService from './movie.service';

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: {
    id: { type: GraphQLInt },
    poster_path: { type: GraphQLString },
    title: { type: GraphQLString },
    vote_average: { type: GraphQLFloat },
  },
});

const ActorType = new GraphQLObjectType({
  name: 'Actor',
  fields: {
    name: { type: GraphQLString },
    movies: { type: new GraphQLList(MovieType) },
  },
});

export default class GraphqlService {
  /**
   * Get graphQL schema
   * @return {Object}
   */
  getSchema() {
    const movieService = new MovieService();

    return new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: () => ({
          message: {
            type: GraphQLString,
            resolve: () => 'Hello World',
          },
          findMoviesByActor: {
            args: {
              name: { type: new GraphQLNonNull(GraphQLString) },
            },
            type: ActorType,
            resolve: (_parent, args) => {
              return movieService.getMoviesByActor(args.name);
            },
          },
        }),
      }),
    });
  }
}
