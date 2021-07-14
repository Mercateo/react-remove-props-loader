# React Remove Props Loader

A webpack loader for removing React props or JSX attributes in TypeScript/JavaScript code.

## Install

```sh
npm install --save-dev react-remove-props-loader
# or
yarn add --dev react-remove-props-loader
```

## Usage

In the webpack configuration, add the loader and specify props that are to be removed. The loader should be executed before any other loader, that is, it should be placed at the end of the `use` array.

```js
const { ScriptKind } = require("react-remove-props-loader");

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "react-remove-props-loader",
            options: {
              props: ["data-testid", "data-test-id"],
              // Optionally, set the kind of the script. Defaults to `ScriptKind.JSX`.
              scriptKind: ScriptKind.TSX,
            },
          },
        ],
      },
    ],
  },
};
```
