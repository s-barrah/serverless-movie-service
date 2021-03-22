import * as chai from 'chai';

// @ts-ignore
import MoviesAction from "../lib/actions/movies";

const { expect } = chai;

const getPayload = (filter = '') => `query {
  getSuggestedActors${filter ? `(${filter})` : ''} {
    actors {
     id
     name
    }
  }
}`

const runSuggestedActorsTest = (name) => {
    describe(`User submits a request to get suggested actors matching ${name}`, () => {
        let response: any = {};

        before((done) => {
            MoviesAction.graphQL(getPayload(`name: "${name}"`))
                .then((body) => {
                    response = body;
                    done();
                })
                .catch((err) => {
                    console.log('runSuggestedActorsTest --- err: ', err)
                    done();
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

        it('should return a actors array', (done) => {
            expect(response.data).to.have.own.property('actors');
            done();
        });

        it('should return a list of actors', (done) => {
            expect(response.data.actors.length > 0).to.equal(true);
            done();
        });
    })
}

// @ts-ignore
describe('GraphQL API - getSuggestedActors - Valid request', () => {
    runSuggestedActorsTest('Al');
    runSuggestedActorsTest('Robert');
    runSuggestedActorsTest('Samuel');
})

