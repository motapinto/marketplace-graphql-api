# API usage instructions

## Documentation
Visit the API schema [here](https://motapinto.github.io/marketplace-graphql-api/api/doc/)!

## Info
To edit the database configuration change the .env file in /api/.env with the following structure:
>  DATABASE_NAME=farmland\
>  DATABASE_USER=root\
>  DATABASE_PASS=rootpassword\
>  DATABASE_URL=http://arangodb:8529

**Note:** This is the default configuration

## How to use
* Run arangodb
  * docker-compose up -d arangodb 
  * cd api && npm install
  * npm run build 
  * npm run populate 
  * Visit http://localhost:8529 and enter credentials (optional)
* Run API
  * npm start (in /api/)
  * Visit http://localhost:5000/graphql and enter valid queries

## Testing
Steps to reproduce tests:
1. Run arangodb (docker-compose up -d arangodb)
2. Run tests (npm run test:dev in /api/)

**Disclaimer**: This API does not have extensive validation and was developed as a learning project