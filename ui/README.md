[![Website](https://img.shields.io/badge/Scale8-Website-9042e7)](https://scale8.com)
[![Documentation](https://img.shields.io/badge/Scale8-Documentation-39cce0)](https://scale8.github.io/docs)
[![API Documentation](https://img.shields.io/badge/Scale8-API%20Documentation-ff0084)](https://scale8.github.io/api-docs)

# UI

We've just migrated from Create React App (CRA) to Next.js.
The Next.js framework provides a clean and highly performant framework.
We've already successfully migrated a few of our other projects.
For anyone wishing to work on or contribute to the project, we recommend getting familiar with [Next.js](https://nextjs.org/), [React](https://reactjs.org/), TypeScript and GraphQL.
At present, we generate a final static build using Next.js rather than render components server side and while this may change in the future, we're very happy with our current setup.

## Prerequisites

We currently use the [Yarn Package Manager](https://yarnpkg.com/) and this will need to be installed before continuing.

Please make sure there is a running instance of the API server before starting the UI.

## Install dependencies

We recommend running ```~> yarn install:all``` that is provided in the root of the project (one level back).
This will guarantee everything is installed correctly and ready to go.

To install dependencies just for the UI project run: -

```~> yarn install```

## Running the project

Provided the prerequisites have been met and all the dependencies have been installed correctly, the project should then be able to start using: -

```bash
~> yarn dev
```

This command should trigger you browser window to open a new tab at ```http://localhost:3000/```.

## Running tests

We use [Jest](https://jestjs.io/) for our test suite. If you are unfamiliar with it, we strongly recommend getting acquainted before contributing.

```bash
~> yarn test
```

## Troubleshooting

- [ ] Make sure there are no other projects trying to start on port 3000, and you have system-level permission to start on this port.
- [ ] 'Failed to fetch' - Please make sure the API server is running.
- [ ] All node packages have been installed and there were no errors thrown up while installing them.

If there is another issue, or something that we've failed to add here please raise an issue or submit a pull request.
