# SKC Site

## Purpose
This repo serves up content to the web from SKC API and SKC Suggestion Engine.

## Testing

The following scripts (found in package.json) are used for testing

| Script Name			| Purpose					|
| ------------------ | --------------------- |
| test					| Uses react-scripts to execute tests. This uses the Jest framework. This script is ideal for devs as watch mode is enabled by default.	|
| ui:test				| Same as test, however this script will not use Jests watch mode and will also print out the coverage of code touched by the tests. This script is ideal for automated tasks. |
| mutation				| Uses stryker.js to execute Jest test cases and also check the mutation's killed by the tests. `ts-jest` and `jest` are needed, else a TypeError will occur. |

More info on the testing frameworks used for testing can be found below.

### Mutation
We are using Stryker to verify test cases kill mutants in an attempt to verify tests written are actually doing their job.

To get Stryker working on a react application:

1. ensure you have a stryker.conf.json file that configures stryker.js. This project has it under `config/` folder.
2. Ensure you have the following dependencies in your devDependencies: `@stryker-mutator/core`, `@stryker-mutator/jest-runner` (since we are using Jest), `@stryker-mutator/typescript-checker` (since we are using TS), `@jest-environment-jsdom` (solves weird issue with react/stryker.js/whatever).