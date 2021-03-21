import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

// Services
import MovieService from './movie.service';

// Types
import { MatchingActorsType, ActorsType } from "../types/movie.type";

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
          findMoviesByActors: {
            args: {
              names: { type: new GraphQLNonNull(GraphQLString) },
            },
            type: MatchingActorsType,
            resolve: (_parent, args) => movieService.getMoviesByActors(args.names),
          },
          getSuggestedActors: {
            args: {
              name: { type: new GraphQLNonNull(GraphQLString) },
            },
            type: ActorsType,
            resolve: (_parent, args) => movieService.getSuggestedActors(args.name),
          },
        }),
      }),
    });
  }
}
