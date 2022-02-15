import { Alert } from '@patternfly/react-core'

# Contributing to docs

## Prerequisites

1. Have [Docker installed](https://docs.docker.com/get-docker/)
2. Have [docker-compose installed](https://docs.docker.com/compose/install/)
3. Login to redhat docker registry. Use your console.redhat.com credentials.
```sh
docker login https://registry.redhat.io
# Username: myrhusername
# Password:  ***********
```
4. Fork the [FEC repository](https://github.com/RedHatInsights/frontend-components)

## Starting development environment

In the FEC repository root, run the following command:
```sh
docker-compose up
```

The initial build may take a while so, don't worry. After the initial build and docs generators are complete, open your browser at <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>.
