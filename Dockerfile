FROM node:16.19.0
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

ARG IS_LOCALHOST=false
ENV IS_LOCALHOST $IS_LOCALHOST

ARG JWT_SECRET
ENV JWT_SECRET $JWT_SECRET

COPY ./src /src
COPY ./package.json /package.json
COPY ./package-lock.json /package-lock.json
COPY ./tsconfig.json /tsconfig.json

RUN NODE_ENV=$NODE_ENV npm install
RUN npm run knex:migrate
CMD ["node", "build/index.js"]
EXPOSE 3333