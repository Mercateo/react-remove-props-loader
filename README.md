# React Remove Props Loader

[![Version](https://img.shields.io/npm/v/react-remove-props-loader.svg)](https://www.npmjs.com/package/react-remove-props-loader)
[![Downloads](https://img.shields.io/npm/dt/react-remove-props-loader.svg)](https://www.npmjs.com/package/react-remove-props-loader)
[![CI](https://github.com/Mercateo/react-remove-props-loader/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/Mercateo/react-remove-props-loader/actions/workflows/main.yml?query=branch%3Amaster)

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
              // (Optional) Set the kind of the script. Defaults to `ScriptKind.JSX`.
              scriptKind: ScriptKind.TSX,
              // (Optional) Set whether to remove specified props from objects. Defaults to `false`.
              removeFromObjects: true,
            },
          },
        ],
      },
    ],
  },
};
```

## Example

### Source

```tsx
import React, { FC } from "react";

export const ExampleComponent: FC = () => {
  const propsObject = { "data-test-id": "example-prop" };
  return (
    <div data-testid="example-prop" {...propsObject}>
      Example Component
    </div>
  );
};
```

### Transformed

Code transformed with the sample settings above.

```tsx
import React, { FC } from "react";

export const ExampleComponent: FC = () => {
  const propsObject = {};
  return <div {...propsObject}>Example Component</div>;
};
```
