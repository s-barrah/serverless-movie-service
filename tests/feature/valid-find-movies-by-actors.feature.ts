import * as chai from 'chai';

// @ts-ignore
import MoviesAction from "../lib/actions/movies";

const { expect } = chai;

const getPayload = (names = '') => `query {
  findMoviesByActors(names: ${names}) {
    movies {
     title
     poster_path
     vote_average
    }
  }
}`

const runFindMoviesByActorsTest = (names) => {
    describe(`User submits a request to find movies by two actors ${names}`, () => {
        let response: any = {};

        before(function(done){
            this.timeout(90000);

            MoviesAction.graphQL(getPayload(`"${names}"`))
                .then((body) => {
                    response = body;
                    done();
                })
                .catch(() => done());
        });

        it('should return a successful status message', (done) => {
            expect(response.message).to.equal('Success');
            done();
        });

        it('should return a successful status status', (done) => {
            expect(response.status).to.equal('Success');
            done();
        });

        it('should return a movies array', (done) => {
            expect(response.data).to.have.own.property('movies');
            done();
        });

        it('should return a list of movies', (done) => {
            expect(response.data.movies.length > 0).to.equal(true);
            done();
        });

    })
}

describe('GraphQL API - getMoviesByActors - Valid request', () => {
    runFindMoviesByActorsTest(['Al Pacino', 'Robert De Niro']);
    runFindMoviesByActorsTest(['Al Pacino', 'Samuel L Jackson']);
    runFindMoviesByActorsTest(['Robert De Niro', 'Samuel L Jackson']);
})

