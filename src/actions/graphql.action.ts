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
                throw new Error(res.errors[0].message);
            }
            const queryType = Object.keys(res.data)[0];
            console.log('graphqlHandler ---- queryType: ', queryType);
            const data = res.data[queryType];
            if (!data) {
                throw new ResponseModel(null, StatusCode.BAD_REQUEST, Status.BAD_REQUEST);
            }
            return new ResponseModel(data, StatusCode.OK, Status.SUCCESS);
        })
        .catch((error) => {
            console.error(error);
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
