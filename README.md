# Iterable Cog

[![CircleCI](https://circleci.com/gh/run-crank/cog-iterable/tree/master.svg?style=svg)](https://circleci.com/gh/run-crank/cog-iterable/tree/master)

This is a [Crank][what-is-crank] Cog for Iterable, providing
steps and assertions for you to validate the state and behavior of your
Iterable instance.

* [Installation](#installation)
* [Usage](#usage)
* [Development and Contributing](#development-and-contributing)

## Installation

Ensure you have the `crank` CLI and `docker` installed and running locally,
then run the following.  You'll be prompted to enter your Iterable
credentials once the Cog is successfully installed.

```shell-session
$ crank cog:install automatoninc/iterable
```

Note: You can always re-authenticate later.

## Usage

### Authentication
<!-- run `crank cog:readme automatoninc/iterable` to update -->
<!-- authenticationDetails -->
You will be asked for the following authentication details on installation. To avoid prompts in a CI/CD context, you can provide the same details as environment variables.

| Field | Install-Time Environment Variable | Description |
| --- | --- | --- |
| **apiKey** | `CRANK_AUTOMATONINC_ITERABLE__APIKEY` | Api Key |

```shell-session
# Re-authenticate by running this
$ crank cog:auth automatoninc/iterable
```
<!-- authenticationDetailsEnd -->

### Steps
Once installed, the following steps will be available for use in any of your
Scenario files.

<!-- run `crank cog:readme automatoninc/iterable` to update -->
<!-- stepDetails -->
| Name (ID) | Expression | Expected Data |
| --- | --- | --- |
| **Create or update an Iterable Contact**<br>(`CreateOrUpdateContact`) | `create or update an iterable contact` | - `contact`: Where keys represent contact profile field names as represented in the Iterable API (including email). |
| **Delete an Iterable Contact**<br>(`DeleteContact`) | `delete the (?<email>.+) iterable contact` | - `email`: Contact's email address |
| **Check a field on an Iterable Contact**<br>(`ContactFieldEquals`) | `the (?<field>[a-zA-Z0-9_ ]+) field on iterable contact (?<email>.+) should (?<operator>be less than\|be greater than\|be\|contain\|not be\|not contain) (?<expectedValue>.+)` | - `email`: Contact's email address <br><br>- `field`: Field name to check <br><br>- `operator`: Check Logic (one of be less than, be greater than, be, contain, not be, or not contain) <br><br>- `expectedValue`: Expected field value |
<!-- stepDetailsEnd -->

## Development and Contributing
Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change. Please make sure to add or update tests
as appropriate.

### Setup

1. Install node.js (v12.x+ recommended)
2. Clone this repository.
3. Install dependencies via `npm install`
4. Run `npm start` to validate the Cog works locally (`ctrl+c` to kill it)
5. Run `crank cog:install --source=local --local-start-command="npm start"` to
   register your local instance of this Cog. You may need to append a `--force`
   flag or run `crank cog:uninstall automatoninc/iterable` if you've already
   installed the distributed version of this Cog.

### Adding/Modifying Steps
Modify code in `src/steps` and validate your changes by running
`crank cog:step automatoninc/iterable` and selecting your step.

To add new steps, create new step classes in `src/steps`. Use existing steps as
a starting point for your new step(s). Note that you will need to run
`crank registry:rebuild` in order for your new steps to be recognized.

Always add tests for your steps in the `test/steps` folder. Use existing tests
as a guide.

### Modifying the API Client or Authentication Details
Modify the ClientWrapper class at `src/client/client-wrapper.ts`.

- If you need to add or modify authentication details, see the
  `expectedAuthFields` static property.
- If you need to expose additional logic from the wrapped API client, add a new
  ublic method to the wrapper class, which can then be called in any step.
- It's also possible to swap out the wrapped API client completely. You should
  only have to modify code within this clase to achieve that.

Note that you will need to run `crank registry:rebuild` in order for any
changes to authentication fields to be reflected. Afterward, you can
re-authenticate this Cog by running `crank cog:auth automatoninc/iterable`

### Tests and Housekeeping
Tests can be found in the `test` directory and run like this: `npm test`.
Ensure your code meets standards by running `npm run lint`.

[what-is-crank]: https://crank.run?utm_medium=readme&utm_source=automatoninc%2Fiterable
