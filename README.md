# value-schema

[![Build Status (Windows)][image-build-windows]][link-build-windows]
[![Build Status (macOS)][image-build-macos]][link-build-macos]
[![Build Status (Linux)][image-build-linux]][link-build-linux]
[![Examples][image-examples]][link-examples]
[![Code Coverage][image-code-coverage]][link-code-coverage]
[![Release][image-release]][link-release]
[![Node.js version][image-engine]][link-engine]
[![TypeScript version][image-typescript]][link-typescript]
[![Deno version][image-deno]][link-deno]
[![Bun version][image-bun]][link-bun]
[![License][image-license]][link-license]

simple, easy-to-use, and declarative input validator

supports [Node.js](https://nodejs.org/), [TypeScript](https://www.typescriptlang.org/), [Deno](https://deno.land/), and [Bun](https://bun.sh/)

* [migration guide](./docs/migration.md)
* [reference](./docs/reference.md)

## Table of Contents

* [Introduction](#introduction)
* [Install](#install)
* [Loading](#loading)
* [Changelog](#changelog)

***

## Introduction

All of web applications need handling input parameters, consists of following steps:

1. existence check
    * all required parameters exist?
    * fill omittable parameters with default values
1. type check
    * e.g., `typeof age === "number"`
    * cast them if needed; `"20"`(string) to `20`(number)
1. domain check
    * e.g., `1 <= limit && limit <= 100`
    * revise them if needed; `0` to `1`

`value-schema` does all of them, by compact and highly readable code!

### example

```javascript
import vs from "value-schema";

const schemaObject = { // schema for input
    id: vs.number({ // number, >=1
        minValue: 1,
    }),
    name: vs.string({ // string, max 16 characters (trims if over)
        maxLength: {
            length: 16,
            trims: true,
        },
    }),
    birthday: vs.date(), // Date
    age: vs.number({ // number, integer (rounds down toward zero), >=0
        integer: vs.NUMBER.INTEGER.FLOOR_RZ,
        minValue: 0,
    }),
    email: vs.email(), // email
    state: vs.string({ // string, accepts only "active" and "inactive"
        only: ["active", "inactive"],
    }),
    classes: vs.array({ // array of number, separated by ",", ignores errors
        separatedBy: ",",
        each: {
            schema: vs.number(),
            ignoresErrors: true,
        },
    }),
    skills: vs.array({ // array of string, separated by ",", ignores errors
        separatedBy: ",",
        each: {
            schema: vs.string(),
            ignoresErrors: true,
        },
    }),
    creditCard: vs.numericString({ // numeric string, separated by "-", checks by Luhn algorithm
        separatedBy: "-",
        checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD,
    }),
    remoteAddr: vs.string({ // IPv4
        pattern: vs.STRING.PATTERN.IPV4,
    }),
    remoteAddrIpv6: vs.string({ // IPv6
        pattern: vs.STRING.PATTERN.IPV6,
    }),
    limit: vs.number({ // number, integer, omittable (sets 10 if omitted), >=1 (sets 1 if less), <=100 (sets 100 if greater)
        ifUndefined: 10,
        integer: true,
        minValue: {
            value: 1,
            adjusts: true,
        },
        maxValue: {
            value: 100,
            adjusts: true,
        },
    }),
    offset: vs.number({ // number, integer, omittable (sets 0 if omitted), >=0 (sets 0 if less)
        ifUndefined: 0,
        integer: true,
        minValue: {
            value: 0,
            adjusts: true,
        },
    }),
};
const input = { // input values
    id: "1",
    name: "Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Ciprin Cipriano de la Santísima Trinidad Ruiz y Picasso",
    birthday: "2000-01-02T03:04:05.678Z",
    age: 20.5,
    email: "picasso@example.com",
    state: "active",
    classes: "1,3,abc,4",
    skills: "c,c++,javascript,python,,swift,kotlin",
    creditCard: "4111-1111-1111-1111",
    remoteAddr: "127.0.0.1",
    remoteAddrIpv6: "::1",
    limit: "0",
};
const expected = { // should be transformed to this
    id: 1,
    name: "Pablo Diego José",
    birthday: new Date("2000-01-02T03:04:05.678Z"),
    age: 20,
    email: "picasso@example.com",
    state: "active",
    classes: [1, 3, 4],
    skills: ["c", "c++", "javascript", "python", "swift", "kotlin"],
    creditCard: "4111111111111111",
    remoteAddr: "127.0.0.1",
    remoteAddrIpv6: "::1",
    limit: 1,
    offset: 0,
};

// Let's apply!
const actual = vs.applySchemaObject(schemaObject, input);

// verification
assert.deepStrictEqual(actual, expected);
```

That's all! No control flows! Isn't it cool?

For details, see [reference](./docs/reference.md).

## Install

install from [npm registry](https://www.npmjs.com/package/value-schema).

```bash
npm install -S value-schema
```

## Loading

### CommonJS

```javascript
// foo.js
var vs = require("value-schema");
```

### ES Modules / [Babel](https://babeljs.io/) / [TypeScript](https://www.typescriptlang.org/)

```javascript
// foo.mjs (ES Modules) / foo.js (Babel) / foo.ts (TypeScript)
import vs from "value-schema";
```

**ES Modules** has been supported as of Node.js v8.5.0.
In Windows, Node.js v8.6.0 is recommended due to [`ERR_INVALID_PROTOCOL`](https://github.com/nodejs/node/issues/15374).

To execute "foo.mjs", `--experimental-modules` flag is required.
(the flag is dropped as of Node.js v13.2.0)

```bash
$ node --experimental-modules foo.mjs
(node:25508) ExperimentalWarning: The ESM module loader is experimental.
```

**TypeScript** auto-completion and type-checking works perfectly on [Visual Studio Code](https://code.visualstudio.com/) and [IntelliJ IDEA](https://www.jetbrains.com/idea/)!

### [Deno](https://deno.land/)

Deno has been supported as of v3.

```typescript
import vs from "https://deno.land/x/value_schema/mod.ts";        // latest version
import vs from "https://deno.land/x/value_schema@v4.0.0/mod.ts"; // v4.0.0
```

**CAUTION**: specify `value_schema` (underscore) NOT `value-schema` (hyphen) because [deno.land](https://deno.land/) module database does not support name with hyphen!

### [Bun](https://bun.sh/)

Bun has been supported as of v4, but might work v3 or earlier.

Use just like a npm module.

```typescript
import vs from "value-schema";
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

[image-build-windows]: https://github.com/shimataro/value-schema/workflows/Windows/badge.svg?event=push&branch=v4
[link-build-windows]: https://github.com/shimataro/value-schema/actions?query=workflow%3AWindows
[image-build-macos]: https://github.com/shimataro/value-schema/workflows/macOS/badge.svg?event=push&branch=v4
[link-build-macos]: https://github.com/shimataro/value-schema/actions?query=workflow%3AmacOS
[image-build-linux]: https://github.com/shimataro/value-schema/workflows/Linux/badge.svg?event=push&branch=v4
[link-build-linux]: https://github.com/shimataro/value-schema/actions?query=workflow%3ALinux
[image-examples]: https://github.com/shimataro/value-schema/workflows/Examples/badge.svg?event=push&branch=v4
[link-examples]: https://github.com/shimataro/value-schema/actions?query=workflow%3AExamples
[image-code-coverage]: https://img.shields.io/codecov/c/github/shimataro/value-schema/v4.svg
[link-code-coverage]: https://codecov.io/gh/shimataro/value-schema
[image-release]: https://img.shields.io/github/release/shimataro/value-schema.svg
[link-release]: https://github.com/shimataro/value-schema/releases
[image-engine]: https://img.shields.io/node/v/value-schema.svg
[link-engine]: https://nodejs.org/
[image-typescript]: https://img.shields.io/badge/TypeScript-%3E%3D3.5-brightgreen.svg
[link-typescript]: https://www.typescriptlang.org/
[image-deno]: https://img.shields.io/badge/%F0%9F%A6%95%20Deno-%3E%3D1.0.0-brightgreen
[link-deno]: https://deno.land/
[image-bun]: https://img.shields.io/badge/Bun-%3E%3D0.3.0-brightgreen
[link-bun]: https://bun.sh/
[image-license]: https://img.shields.io/github/license/shimataro/value-schema.svg
[link-license]: ./LICENSE
