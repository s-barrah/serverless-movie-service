import {GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString} from "graphql";

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: {
        id: { type: GraphQLInt },
        poster_path: { type: GraphQLString },
        title: { type: GraphQLString },
        vote_average: { type: GraphQLFloat },
        overview: { type: GraphQLString },
        original_language: { type: GraphQLString },
        original_title: { type: GraphQLString },
        release_date: { type: GraphQLString },
        vote_count: { type: GraphQLInt },
        backdrop_path: { type: GraphQLString },
        popularity: { type: GraphQLInt },
    },
});

export const ActorType = new GraphQLObjectType({
    name: 'Actor',
    fields: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        gender: { type: GraphQLInt },
        birthday: { type: GraphQLString },
        place_of_birth: { type: GraphQLString },
        profile_path: { type: GraphQLString },
        biography: { type: GraphQLString },
        popularity: { type: GraphQLInt },
        imdb_id: { type: GraphQLString },
        homepage: { type: GraphQLString },
        movies: { type: new GraphQLList(MovieType) },
    },
});


export const MatchingActorsType = new GraphQLObjectType({
    name: 'MatchingActors',
    fields: {
        movies: { type: new GraphQLList(MovieType) },
    },
});



export const ActorsType = new GraphQLObjectType({
    name: 'Actors',
    fields: {
        actors: { type: new GraphQLList(ActorType) },
    },
});
