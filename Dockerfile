FROM node:16.19.0
WORKDIR .
COPY . .
RUN npm install
CMD ["node", "build/index.js"]
EXPOSE 3000