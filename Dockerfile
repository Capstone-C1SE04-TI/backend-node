
FROM node:16-alpine

WORKDIR /app

RUN chown node:node /app

COPY --chown=node:node package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 4000

CMD ["npm", "start"]

