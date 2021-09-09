[![Website](https://img.shields.io/badge/Scale8-Website-9042e7)](https://scale8.com)
[![Documentation](https://img.shields.io/badge/Scale8-Documentation-39cce0)](https://scale8.github.io/docs)
[![API Documentation](https://img.shields.io/badge/Scale8-API%20Documentation-ff0084)](https://scale8.github.io/api-docs)

# Router

Created to provide a simple way to set up the platform using [Nginx](https://www.nginx.com/). This is for the self-hosted version only. We've added upstream hosts as environment variables: -

| Environment&nbsp;Variable | Default&nbsp;Value | Description |
|---|---|---|
| ```API_SERVER``` | api:8082 | The 'api' host name is internal and provided by Docker automatically when using Docker Compose. It is possible to change this environment variable to re-wire it for local testing of the API server. E.g passing in host.docker.internal:8082 instead. |
| ```EDGE_SERVER``` | edge:6080 | A similar set-up to the above, setting host.docker.internal:6080 would send traffic to your local running instance of the edge server |
| ```UI_SERVER``` | 127.0.0.1:3000 | By default the UI is delivered from a static build with Nginx checking for relevant files in the volume. If this variable is set, it will send this traffic dynamically upstream to your running local instance of the UI. E.g passing in host.docker.internal:3000 instead. |

## Prerequisites

[Docker](https://docs.docker.com/engine/install/) is used to build and run the image. You'll need to make sure you have the latest version installed.

## Running the project

Provided the prerequisites have been met the project should then be able to start using: -

```bash
docker run --name router -p 8080:80 -d scale8/router:latest
```

We recommend using the ```~> yarn run:all``` command that references ```docker-compose.yaml``` to start services. This is located one directory back in the root of the project.

## Troubleshooting

- [ ] Make sure there are no other projects trying to start on port 8080.
- [ ] You've run the router without the '-d' flag and checked there are no obvious errors.

If there is another issue, or something that we've failed to add here please raise an issue or submit a pull request.