# Data exchange app

[Live demo of the master branch](https://dhis2-data-exchange.netlify.app/#/)

This project was bootstrapped with [DHIS2 Application Platform](https://github.com/dhis2/app-platform).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner and runs all available tests found in `/src`.<br />

See the section about [running tests](https://platform.dhis2.nu/#/scripts/test) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
A deployable `.zip` file can be found in `build/bundle`!

See the section about [building](https://platform.dhis2.nu/#/scripts/build) for more information.

### `yarn deploy`

Deploys the built app in the `build` folder to a running DHIS2 instance.<br />
This command will prompt you to enter a server URL as well as the username and password of a DHIS2 user with the App Management authority.<br/>
You must run `yarn build` before running `yarn deploy`.<br />

See the section about [deploying](https://platform.dhis2.nu/#/scripts/deploy) for more information.

## Learn More

You can learn more about the platform in the [DHIS2 Application Platform Documentation](https://platform.dhis2.nu/).

You can learn more about the runtime in the [DHIS2 Application Runtime Documentation](https://runtime.dhis2.nu/).

To learn React, check out the [React documentation](https://reactjs.org/).


## Migrating to TS

- the simplest `tsconfig.json`

```json
{
    "compilerOptions": {
      "allowJs": true,
      "target": "es5"
    },
    "include": ["./src/**/*"]
}
```
from: https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html#writing-a-configuration-file

- install `typescript`

```bash
yarn add --dev typescript
```

(optionally) add an alias to make testing easier in `package.json`, to run `yarn tsc --noEmit` for example.

:::note[TypeScript is a typed "superset" of JavaScript]

TypeScript is a language that is a superset of JavaScript: JS syntax is therefore legal TS. 
:::

- Rename all files from `.js` to `.ts` (or `.jsx` to `.tsx`). You could use a script:

```bash
find ./src -depth -name "*.js" -exec sh -c 'mv "$1" "${1%.js}.tsx"' _ {} \;
```

- Remove all references to modules `.js` - get rid of extensions (if you want to keep extensions, you'd need to set `allowImportingTsExtensions` - not worth the hassle)

(this will cause eslint errors)

- Fix eslint config

install `yarn add @typescript-eslint/eslint-plugin @typescript-eslint/parser`

extend eslint config

- inferred types
- settings cast
- generics (DRY)
- 