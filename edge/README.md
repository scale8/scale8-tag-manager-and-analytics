[![Website](https://img.shields.io/badge/Scale8-Website-9042e7)](https://scale8.com)
[![Documentation](https://img.shields.io/badge/Scale8-Documentation-39cce0)](https://scale8.github.io/docs)
[![API Documentation](https://img.shields.io/badge/Scale8-API%20Documentation-ff0084)](https://scale8.github.io/api-docs)

# Edge

Designed to eliminate all single points of failure, configurations are static builds and stored in cloud (Google Cloud Storage).
The Edge server can therefore be hosted at the edge and across hundreds of points of presence (PoPs).

The original version was built using Scala & PlayFramework, however, we've decided to create the self-hosted version using Micronaut and Java.

The Edge server is responsible for delivering assets and configurations to the browser. It also provides a service for ingesting data for the data manager.
Future releases will provide additional backends for storage whilst also focusing on optimisation and stability.

## Prerequisites

[Maven](https://maven.apache.org/install.html) is used as the package manager and depending on how you are currently setup, you may need to install this first.

## Install dependencies

We recommend running ```~> yarn install:all``` that is provided in the root of the project (one level back).
This will guarantee everything is installed correctly and ready to go.

To manually install dependencies for just this project, please run: -

```bash
~> mvn clean install
```

Due to licensing issues we are not able to automatically include and distribute the free version of [MaxMind's GeoIP2 Database](https://www.maxmind.com/en/geoip2-databases) (or other compatible MMDB file).
This can be [downloaded](https://www.maxmind.com/en/geoip2-databases) for free and linked in using the ```MMDB_FILE``` environment variable.

> :warning: &nbsp; **If no MMDB file has been provided, '--' will be used as the country code.** :earth_americas:

## Running the project

Provided the prerequisites have been met and all the dependencies have been installed correctly, the project should then be able to start using: -

```bash
S8_ROOT_SERVER="http://127.0.0.1:8080" MONGO_CONNECT_STRING="mongodb://127.0.0.1:27017" ./mvnw mn:run
```

The environment variable ```S8_ROOT_SERVER``` tells the Edge server where the Router is, while ```MONGO_CONNECT_STRING``` is required if the project is using MongoDB to simulate cloud storage.

## Running tests

We use [Micronaut Test](https://micronaut-projects.github.io/micronaut-test/latest/guide/) for our test suite. If you are unfamiliar with it, we strongly recommend getting acquainted before contributing.

```bash
~> ./mvnw test
```

## Troubleshooting

- [ ] Make sure there are no other projects trying to start on port 6080, and you have system-level permission to start on this port.
- [ ] All packages have been installed via Maven and there were no errors thrown up while installing them.
- [ ] MongoDB is running, and you are able to connect to it via ```mongodb://127.0.0.1:27017``` or you have specified the environment variable ```MONGO_CONNECT_STRING``` and tested that it connects.

If there is another issue, or something that we've failed to add here please raise an issue or submit a pull request.