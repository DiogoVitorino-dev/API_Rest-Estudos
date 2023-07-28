FROM node:16.19.0
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ARG JWT_SECRET
ENV JWT_SECRET $JWT_SECRET

ARG ENABLED_CORS
ENV ENABLED_CORS $ENABLED_CORS

COPY ./src /src
COPY ./package.json /package.json
COPY ./package-lock.json /package-lock.json
COPY ./tsconfig.json /tsconfig.json

RUN NODE_ENV=$NODE_ENV npm install
RUN npm run knex:migrate
RUN npm run knex:seed
CMD ["node","./build/index.js"]
EXPOSE 3333