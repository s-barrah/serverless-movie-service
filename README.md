# Serverless Movie Service
GraphQL Lambda endpoints for Movie DB queries

## Installation
You will need the following packages installed locally,

- AWS CLI
- Node JS (8 or higher)
- Yarn

## Local Development

Before starting local development you will need to run a couple of commands:

```bash
yarn global add serverless
yarn install
```

You will need to setup environment variables, to do this copy the `.env.example` to `.env`.

You can simulate lambda and API endpoints locally using the following command:

```bash
serverless offline start
```

#### Endpoints

`POST GraphQL endpoint -`
[http://localhost:9000/graphql](http://localhost:9000/graphql)


## Testing

Tests are located in the `tests` folder an can be invoked by running `yarn unit-test` and `yarn feature-test`. These 
tests will invoke the defined  actions in a wrapper, where the response can then be tested.




