# Backend build
FROM node AS serverBuild
WORKDIR /app

COPY src ./src
COPY package.json .
COPY package-lock.json .
COPY nest-cli.json .
COPY tsconfig.build.json .
COPY tsconfig.json .

RUN npm install && npm run build

# Frontend build
FROM node AS clientBuild
WORKDIR /

ENV REACT_APP_API_URL=/

RUN git clone https://github.com/Axel-Duval/front-mojef app && \
    cd /app                                                 && \
    git checkout 43ba91a2b2fde0ac9ee5cd825921be1854ee59e7   && \
    npm install                                             && \
    npm run build

# Backend runtime
FROM node
WORKDIR /app

COPY --from=serverBuild /app/node_modules ./node_modules
COPY --from=serverBuild /app/dist ./dist

COPY --from=clientBuild /app/build ./dist/spa

EXPOSE 80

CMD ["node", "dist/main", "start"]