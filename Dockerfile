FROM node:16.19.0
WORKDIR /API_Rest-Estudos
COPY . .
RUN npm install
RUN npm run production
CMD ["node", "src/index.js"]
EXPOSE 3000