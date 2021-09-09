[![Website](https://img.shields.io/badge/Scale8-Website-9042e7)](https://scale8.com)
[![Documentation](https://img.shields.io/badge/Scale8-Documentation-39cce0)](https://scale8.github.io/docs)
[![API Documentation](https://img.shields.io/badge/Scale8-API%20Documentation-ff0084)](https://scale8.github.io/api-docs)

# API

The API project houses the business logic for the platform, the vast majority of which is exposed via GraphQL with just a few RESTful endpoints used for service hooks.
This is a TypeScript project, so we do advise that you familiarize yourself with the language before attempting to make any significant modifications.

There are two core modes of operation, ```SELF_HOSTED``` and ```COMMERCIAL```.
The project was originally designed for the cloud only, however, as we neared completion of the project we wanted user trust above everything else to be at the core of our offering.
Inspired by several other companies, we made a small pivot towards providing a fully open-sourced project that could be self-hosted too.
By default, the project runs in ```SELF_HOSTED``` mode and this aims to remove some complexity with running in production.
It currently hides away the payment / subscription service, user sign-up, custom DNS and custom SSL termination that are not required when self-hosting.

## Prerequisites

We currently use the [Yarn Package Manager](https://yarnpkg.com/) and this will need to be installed before continuing.
You'll also require a running instance of [MongoDB](https://docs.mongodb.com/manual/installation/).
If you already have docker installed, it can be quickly started with the following command.

```bash
docker run --name mongodb-dev -p 27017:27017 -d mongo:4.4
```

If you would like the data to persist, don't forget to mount a volume by adding ```-v /my/own/datadir:/data/db```.
[Documentation](https://hub.docker.com/_/mongo) can be found on the official MongoDB Docker page.

## Install dependencies

We recommend running ```~> yarn install:all``` that is provided in the root of the project (one level back).
This will guarantee everything is installed correctly and ready to go.

## Running the project

Provided the prerequisites have been met and all the dependencies have been installed correctly, the project should then be able to start using: -

```bash
~> yarn dev
```

## Running tests

We use [Jest](https://jestjs.io/) for our test suite. If you are unfamiliar with it, we strongly recommend getting acquainted before contributing.

```bash
~> yarn test
```

## Troubleshooting

- [ ] Make sure there are no other projects trying to start on port 8082, and you have system-level permission to start on this port.
- [ ] All node packages have been installed and there were no errors thrown up while installing them.
- [ ] The ```yarn platforms:build``` command was able to execute without any errors.
- [ ] MongoDB is running, and you are able to connect to it via ```mongodb://127.0.0.1:27017``` or you have specified the environment variable ```MONGO_CONNECT_STRING``` and tested that it connects.

If there is another issue, or something that we've failed to add here please raise an issue or submit a pull request.