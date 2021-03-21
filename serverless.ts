import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'serverless-movie-service',
  frameworkVersion: '2',
  custom: {
    ['serverless-offline']: {
      httpPort: 9000,
      babelOptions: {
        presets: ["env"]
      }
    },
    profile: {
      prod: 'prodAccount',
      dev: 'devAccount'
    }
  },
  // Add the serverless-webpack plugin
  plugins: [
    'serverless-mocha-plugin',
    'serverless-bundle',
    'serverless-offline',
  ],
  useDotenv: true,
  package: {
    individually: true,
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      shouldStartNameWithService: true,
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    hello: {
      handler: 'handler.hello',
      events: [
        {
          http: {
            method: 'get',
            path: 'hello',
          }
        }
      ]
    },
    graphql: {
      handler: 'handler.graphqlHandler',
      events: [
        {
          http: {
            method: 'post',
            path: 'graphql',
            cors: true,
          }
        },
        {
          http: {
            method: 'get',
            path: 'graphql',
            cors: true,
          }
        }
      ]
    },
  }
}

module.exports = serverlessConfiguration;
