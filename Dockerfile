FROM node:16.19.0
WORKDIR /
COPY . .
RUN npm install
RUN npx tsc
RUN npm run knex:migrate
CMD ["node", "build/index.js"]
EXPOSE 3333