import * as chai from 'chai';

import MoviesAction from "../lib/actions/movies";

const { expect } = chai;

const getPayload = (filter = '') => `query {
  findMoviesByActor${filter ? `(${filter})` : ''} {
    name
    movies {
     title
     poster_path
     vote_average
    }
  }
}`

const runMovieTest = (name) => {
    describe(`User visits the endpoint and searches for movies by actor ${name}`, () => {
        let response: any = {};

        before((done) => {
            MoviesAction.graphQL(getPayload(`name: "${name}"`))
                .then((body) => {
                    response = body;
                    done();
                })
                .catch((err) => {
                    console.log('runMovieTest --- err: ', err)
                    done(err);
                });
        });

        it('should return a successful status message', (done) => {
            expect(response.message).to.equal('Success');
            done();
        });

        it('should return a successful status status', (done) => {
            expect(response.status).to.equal('Success');
            done();
        });

        it('should return the actors name', (done) => {
            expect(response.data.name).to.equal(name);
            done();
        });

        it('should return a list of movies', (done) => {
            expect(response.data.movies.length > 0).to.equal(true);
            done();
        });
    })
}

describe('GraphQL API - findMoviesByActor', () => {
    runMovieTest('Al Pacino');
    runMovieTest('Robert De Niro');
})

