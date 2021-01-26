# API usage instructions
## Requisites
.env file in /api/.env with the following config:
>  DATABASE_NAME=realfarmville\
>  DATABASE_USER=root\
>  DATABASE_PASS=rootpassword\
>  DATABASE_URL=http://arangodb:8529

## How to use
* Run arangodb
  * docker-compose up -d arangodb (anywhere in the project)
  * npm run populate (to populate the DB)
  * Visit http://localhost:8529
* Run API (one of the first two options)
  * docker-compose up -d api (anywhere in the project)
  * npm run build && npm run start (in /api/)
  * Visit http://localhost:5000
