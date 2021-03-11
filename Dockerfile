FROM registry.redhat.io/ubi8/nodejs-14
USER root
WORKDIR /docs
COPY . .
WORKDIR /docs/packages/docs
RUN mv docker.package.json package.json
RUN npm i
RUN npm run build

EXPOSE 3000
USER 1001
CMD npm run serve
