FROM node:16.3 AS compile
COPY src src
COPY package.json .
COPY tsconfig.json .
RUN yarn install
RUN yarn run compile

FROM node:16.3
COPY package.json .
COPY --from=compile dist /dist
RUN yarn install --prod
ENTRYPOINT ["node", "/dist/app.js"]
