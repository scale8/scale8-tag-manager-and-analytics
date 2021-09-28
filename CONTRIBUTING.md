<p align="center">
    <a href="https://scale8.com"><img src="https://scale8.com/img/logo.png" width="100px" /></a>
</p>

<h1 align="center">
    Scale8 - Tag Manager & Data Manager
</h1>

<p align="center">
    <a href="https://scale8.com"><img src="https://img.shields.io/badge/Scale8-Website-9042e7" height="20"/></a>
    <a href="https://scale8.github.io/docs"><img src="https://img.shields.io/badge/Scale8-Documentation-39cce0" height="20"/></a>
    <a href="https://scale8.github.io/api-docs"><img src="https://img.shields.io/badge/Scale8-API%20Documentation-ff0084" height="20"/></a>
</p>

<p align="center">
    <a href="https://www.gnu.org/licenses/agpl-3.0"><img src="https://img.shields.io/badge/License-AGPL%20v3-blue.svg" height="20"/></a>
    <a href="#"><img src="https://github.com/scale8/tag-manager/actions/workflows/main.yml/badge.svg" height="20"/></a>
</p>

<br />

## Contributing

We've made it easy to get setup and running quickly with the project.
We'll be adding more to this document as the project evolves, so it always worth re-checking guidelines.

## A quick note on using Docker Compose.

We provide a simple docker-compose configuration file in the root of the project.
This is the simplest way to run the project, and it is possible to re-wire the component of your choice directly in. 
You'll need to have docker-compose install on your machine and available to you before you get started.

## Prerequisites

While the project is mostly TypeScript, the Edge server has been written in Java.
It is therefore a requirement to have both [Yarn](https://yarnpkg.com/getting-started/install), Java and [Maven](https://maven.apache.org/install.html) installed correctly.
The Edge server uses the [Micronaut Framework](https://micronaut.io/download/) and there is extensive documentation on how to [get started](https://docs.micronaut.io/latest/guide/).
It is worth nothing that it is possible to 'wire' just the API or UI components in via setting environment variables in Docker Compose - see [Router](/router) for more information on this.

## Installing dependencies

```bash
yarn install:all
```

This command will install the dependencies for all the modules / projects provided the prerequisites have all been met.

You'll need a running version MongoDB available to you before starting the API service. We recommend using Docker for this, and we have created two simple scripts.

Start MongoDB server running: -

```bash
yarn start:mongodb
```

Stop the MongoDB server: -

```bash
yarn start:mongodb
```

Please note this does not run as a replica set and does not persist the data. We recommend setting a volume if you wish to have the data persist: -

```bash
docker run --name mongo-example -v /my/own/datadir:/data/db -d mongo
```

More documentation regarding the MongoDB configuration can be [found here](https://hub.docker.com/_/mongo).

## Running each component

Each part of the project needs to be started independently. We originally had this configured wth PM2, however we've scrapped that to reduce complexity for the open-source project.

### API

To start the API, in a new terminal window, run the following command. Once the API has started, it should be available on ```http://127.0.0.1:8082```.

```bash
(cd api && exec yarn dev)
```

### UI

The UI development server can be started by opening a new terminal window and running the following command. Once the UI has started, it should be available on ```http://127.0.0.1:3000```.

```bash
(cd ui && exec dev:local:api)
```

### Edge

Edge server can be started using the following command. It will be available on port 6080 by default.

```bash
(cd edge && exec S8_ROOT_SERVER="http://127.0.0.1:6080" S8_ENV=development ./mvnw mn:run)
```

## Setup issues

Please open an issue if you there are any issues getting setup.
We'll be adding more to this document in the near future and hopefully simplifying the development process further.