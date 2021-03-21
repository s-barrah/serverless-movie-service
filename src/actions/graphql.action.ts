// Dependencies
import {
    APIGatewayProxyHandler,
    APIGatewayEvent,
} from 'aws-lambda';
import 'source-map-support/register';
import { graphql } from 'graphql';


// Models
import ResponseModel, { StatusCode, Status } from '../models/response.model';

// Services
import GraphqlService from '../services/graphql.service';

export const graphqlHandler: APIGatewayProxyHandler = (
    event: APIGatewayEvent,
    _context,
    callback
): void => {
    const graphQLService = new GraphqlService();

    graphql(graphQLService.getSchema(), event.body)
        .then((res) => {
            if (res.errors) {
                console.error(res.errors);
                throw new Error(res.errors[0].message);
            }
            const queryType = Object.keys(res.data)[0];
            const data = res.data[queryType];
            if (!data) {
                throw new ResponseModel(null, StatusCode.BAD_REQUEST, Status.BAD_REQUEST);
            }
            return new ResponseModel(data, StatusCode.OK, Status.SUCCESS);
        })
        .catch((error) => {
            console.error(`graphql lambda error - ${error}`);
            return error instanceof ResponseModel
                ? error
                : new ResponseModel({}, StatusCode.ERROR, Status.ERROR);
        })
        .then((response) =>
            callback(
                null,
                response instanceof ResponseModel ? response.generate() : response
            )
        );
};
