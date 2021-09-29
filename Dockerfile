FROM registry.redhat.io/ubi8/nodejs-14
USER root
WORKDIR /docs
COPY . .
WORKDIR /docs/packages/docs
RUN npm i
RUN npx next telemetry disable
RUN npm run build

EXPOSE 3000
USER 1001
CMD npm run serve
