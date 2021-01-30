# API usage instructions
## Info
To edit the database configuration have a .env file in /api/.env with the following structure:
>  DATABASE_NAME=realfarmville\
>  DATABASE_USER=root\
>  DATABASE_PASS=rootpassword\
>  DATABASE_URL=http://arangodb:8529

**Note:** This is the default configuration

## How to use
* Run arangodb
  * docker-compose up -d arangodb (anywhere in the project)
  * npm run populate (to populate the DB)
  * Visit http://localhost:8529 and enter credentials (optional)
* Run API
  * npm start (in /api/)
  * Visit http://localhost:5000/graphql and enter valid queries

## Testing
Steps to reproduce tests:
1. Run arangodb (docker-compose up -d arangodb)
2. Build api (npm run build in /api/)
3. Run tests (npm run test /api/)

**Disclaimer**: This API does not have extensive validation and was developed as a learning project