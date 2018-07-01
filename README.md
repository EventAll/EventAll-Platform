# EventAll Mobile App

## Table of Contents

- [Getting Started](#getting-started)
- [Editor](#editor)
- [Development](#development)
- [Testing](#testing)
- [Overview of Commands](#overview-of-commands)

## Getting Started

1.  Install [Docker](https://www.docker.com/).
2.  Install the [Prisma](https://www.prisma.io/) CLI by typing `npm install -g prisma`. Prisma a GraphQL backend service that acts like an ORM (Object Relational Mapping) between GraphQL schemas and the actual data stored in the database.

## Editor

Code will not build on the build server if there are linting errors. We will be using eslint to lint our code (following [Airbnb's guide](https://github.com/airbnb/javascript)). In order to make linting less of a pain, I **strongly** recommend using VSCode and installing the following extensions to help with formatting:

- ESLint
- Trailing Spaces

Additionally, I recommend changing your editor settings `cmd + ,` to add the following User Settings:

```js
"editor.formatOnSave": true,
"eslint.autoFixOnSave": true,
"[javascript]": {
    "editor.tabSize": 2
},
"files.trimTrailingWhitespace": true,
"files.insertFinalNewline": true,
```

Other great packages that will make development _much_ easier include:

- Jest
- Auto Close Tag
- Auto Rename Tag
- Import Cost
- Path Intellisense
- npm Intellisense
- Color Highlight
- JavaScript (ES6) code snippets
- GraphQL for VSCode

Either way, there is a pre-commit hook that should run the linter right after you type `git commit` and fix any formatting issues that you have.

## Development

### Docker

We're using Docker to easily make sure that development environments are the same for all developers and that the production environment will match development. There are currently 2 containers running in our Docker setup

- prisma: Our Prisma GraphQL server
- postgres: Our PostgreSQL database

In order to develop locally, open the Docker application and navigate to the directory with the `docker-compose.yml` file (the configuration file for Docker).
You can start the Docker engine by typing `docker-compose up -d` (the `-d` flag specifies that you want to run the engine as a "detached process". Read more about it [here](https://docs.docker.com/compose/reference/overview/)). This will probably take a while the very first because it will have to download all of the Docker images from a repository. When you're done developing, be sure to shut down Docker with `docker-compose down` and close the Docker app because it eats up a lot of resources.

### Prisma

Prisma serves as another database layer on top of our DB that allows us to use our SQL database as a GraphQL database. Prisma bootstraps a lot of our development process by:

- Translating all of our client-side GraphQL queries into Database queries
- Creating a self-documenting API from our GraphQL data models.
- Providing a graphical playground for our GraphQL API.

Once you have Docker set up and running, navigate to the directory with the `prisma.yml` file and type `prisma deploy`, which starts your Prisma server.
You can open up the playground by typing `prisma playground` in the same directory. Click on the "Schema" tab to the right to see all of the self-generated functionality that Prisma creates just by reading our `.graphql` files!

## Testing

Our testing framework will [Jest](https://facebook.github.io/jest/docs/en/tutorial-react-native.html), which is a great testing framework published and maintained by Facebook. Front end tests serve to make sure that changes to one part of the app don't affect others. Tests should only be written if they are meaningful, AKA don't test to make sure that a Button appears when you've very clearly programmed a button there. You should be testing for things such as how a component interacts given a different set of props, or how an entire screen reacts to a button press.

Tests should typically be written for components and screens and should be named as <Component-Name>.test.js in the same level as the actual react file itself. See the "Demo" component for an example.

You can run the test suite by typing `yarn test`. Ignore all of the `console.error` messages for now, it's a stupid React bug.

## Overview of Commands

These commands can also be found the `package.json` file under `‘scripts’`

- `yarn run lint`
  - Runs the linter and fixes any formatting issues
- `yarn test`
  - Runs the Testing Suite in Jest
