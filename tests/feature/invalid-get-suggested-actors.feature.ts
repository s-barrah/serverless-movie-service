import * as chai from 'chai';

import MoviesAction from "../lib/actions/movies";

const { expect } = chai;

const getPayload = `query {
  getSuggestedActors {
    actors {
     id
     name
    }
  }
}`

const runInvalidSuggestedActorsTest = () => {
    describe("User submits a request to get suggested actors with an invalid query", () => {
        let response: any = {};

        before((done) => {
            MoviesAction.graphQL(getPayload)
                .then((body) => {
                    response = body;
                    done();
                })
                .catch((err) => {
                    response = err.response
                    done();
                });
        });

        it('should return an error status code', (done) => {
            expect(response.status).to.equal(500);
            done();
        });

        it('should return an error status', (done) => {
            expect(response.data.status).to.equal('unknown error');
            done();
        });

        it('should return an error status message', (done) => {
            expect(response.data.message).to.equal('unknown error');
            done();
        });

        it('should return no data', (done) => {
            expect(Object.keys(response.data.data).length).to.equal(0);
            done();
        });

    })
}

describe('GraphQL API - getSuggestedActors - Invalid request', () => {
    runInvalidSuggestedActorsTest();
})

