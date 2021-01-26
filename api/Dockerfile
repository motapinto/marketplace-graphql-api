FROM node:12-alpine
WORKDIR /usr/api
COPY package*.json ./
RUN npm install && apk add bash
SHELL ["/bin/bash", "-c"]
COPY . .
EXPOSE 5000
RUN ["npm", "run", "build"]
CMD ["npm", "run", "prod"]