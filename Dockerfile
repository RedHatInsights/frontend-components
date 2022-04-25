FROM registry.access.redhat.com/ubi8/nodejs-16
USER root
WORKDIR /docs
COPY ./packages /docs/packages
COPY ./tsconfig.json /docs/tsconfig.json
WORKDIR /docs/packages/docs
RUN npm i
RUN npm run build

EXPOSE 3000
USER 1001
CMD node server.js
