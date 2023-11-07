# Temporal Exercise

This is based on the default project that is scaffolded out when you run `npx @temporalio/create@latest ./myfolder`.

It also uses the [Star Wars API](https://swapi.dev/) for dummy data.

The [Hello World Tutorial](https://learn.temporal.io/getting_started/typescript/hello_world_in_typescript/) walks through the code in this sample.

### Running this sample

1. `temporal server start-dev` to start [Temporal Server](https://github.com/temporalio/cli/#installation).
1. `npm install` to install dependencies.
1. `npm run start.watch` to start the Worker.
1. In another shell, `npm run workflow` to run the Workflow Client.

The Workflow should run 3 workflows and return all data.
