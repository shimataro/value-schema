# value-schema

[![Build Status (Windows)][image-build-windows]][link-build-windows]
[![Build Status (macOS)][image-build-macos]][link-build-macos]
[![Build Status (Linux)][image-build-linux]][link-build-linux]
[![Examples][image-examples]][link-examples]
[![Code Coverage][image-code-coverage]][link-code-coverage]
[![Release][image-release]][link-release]
[![Node.js version][image-engine]][link-engine]
[![License][image-license]][link-license]

simple, easy-to-use, and declarative schema validator

## Table of Contents

* [Introduction](#introduction)
* [Install](#install)
* [Loading](#loading)
* [Reference](#reference)
    * [types and constants](#types-and-constants)
    * [basic usage](#basic-usage)
    * [boolean](#boolean)
    * [number](#number)
    * [string](#string)
    * [numeric string](#numeric-string)
    * [email](#email)
    * [array](#array)
    * [object](#object)
* [Changelog](#changelog)

---

## Introduction

All of web applications need handling input parameters, consists of following steps:

1. existence check
    * all required parameters exist?
    * fill omittable parameters by default values
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
import assert from "assert";

const schemaObject = { // schema for input
    id: vs.number().minValue(1), // number, >=1
    name: vs.string().maxLength(16, true), // string, max 16 characters (trims if over)
    age: vs.number().integer(true).minValue(0), // number, integer (trims if decimal), >=0
    email: vs.email(), // email
    state: vs.string().only("active", "inactive"), // string, accepts only "active" and "inactive"
    classes: vs.array().separatedBy(",").each(vs.number(), true), // array of number, separated by ",", ignores errors
    skills: vs.array().separatedBy(",").each(vs.string(), true), // array of string, separated by ",", ignores errors
    credit_card: vs.numericString().separatedBy("-").checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD), // numeric string, separated by "-", checks by Luhn algorithm
    remote_addr: vs.string().pattern(vs.STRING.PATTERN.IPV4), // IPv4
    remote_addr_ipv6: vs.string().pattern(vs.STRING.PATTERN.IPV6), // IPv6
    limit: vs.number().integer().default(10).minValue(1, true).maxValue(100, true), // number, integer, omittable (sets 10 if omitted), >=1 (sets 1 if less), <=100 (sets 100 if greater)
    offset: vs.number().integer().default(0).minValue(0, true), // number, integer, omittable (sets 0 if omitted), >=0 (sets 0 if less)
};
const input = { // input values
    id: "1",
    name: "Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Ciprin Cipriano de la Santísima Trinidad Ruiz y Picasso",
    age: 20.5,
    email: "picasso@example.com",
    state: "active",
    classes: "1,3,abc,4",
    skills: "c,c++,javascript,python,,swift,kotlin",
    credit_card: "4111-1111-1111-1111",
    remote_addr: "127.0.0.1",
    remote_addr_ipv6: "::1",
    limit: "0",
};
const expected = { // should be fitted to this
    id: 1,
    name: "Pablo Diego José",
    age: 20,
    email: "picasso@example.com",
    state: "active",
    classes: [1, 3, 4],
    skills: ["c", "c++", "javascript", "python", "swift", "kotlin"],
    credit_card: "4111111111111111",
    remote_addr: "127.0.0.1",
    remote_addr_ipv6: "::1",
    limit: 1,
    offset: 0,
};

// Let's fit!
const fitted = vs.fit(input, schemaObject);

// verification
assert.deepStrictEqual(fitted, expected);
```

That's all! No control flows! Isn't it cool?

For details, see [basic usage](#basic-usage).

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

### ES Modules

As of Node.js v8.5.0, ES Modules has been supported.
In Windows, Node.js v8.6.0 is recommended due to [`ERR_INVALID_PROTOCOL`](https://github.com/nodejs/node/issues/15374).

```javascript
// foo.mjs
import vs from "value-schema";
```

To execute, `--experimental-modules` flag is required.

```bash
$ node --experimental-modules foo.mjs
(node:25508) ExperimentalWarning: The ESM module loader is experimental.

# As of Node.js v12, --es-module-specifier-resolution=node flag is also required.
$ node --experimental-modules --es-module-specifier-resolution=node foo.mjs
(node:25508) ExperimentalWarning: The ESM module loader is experimental.
```

See [Announcing a new --experimental-modules - Node.js Foundation - Medium](https://medium.com/@nodejs/announcing-a-new-experimental-modules-1be8d2d6c2ff) for details.

### TypeScript

```typescript
// foo.ts
import * as vs from "value-schema";
```

### ES6 Modules with [Babel](https://babeljs.io/)

```javascript
// same as ES Modules!
import vs from "value-schema";
```

## Reference

### types and constants

#### `ValueSchemaError`

The `ValueSchemaError` object represents an error.

##### ambient declaration

```typescript
interface ValueSchemaError extends Error
{
    name: string
    message: string
    cause: string
    value: any
    keyStack: (string | number)[]
}
```

##### properties

|name|description|
|----|-----------|
|`name`|`"ValueSchemaError"`|
|`message`|human-readable description of the error, including a string `cause`|
|`cause`|cause of fitting error; see `vs.CAUSE`|
|`value`|value to fit|
|`keyStack`|array consists of path to key name(for object) or index(for array) that caused error; for nested object or array|

See below example.
For detail about schema / `value-schema`, see [basic usage](#basic-usage)

```javascript
import vs from "value-schema";
import assert from "assert";

// {foo: Array<{bar: {baz: number}}>}
const schemaObject = {
    foo: vs.array().each(vs.object().schema({
        bar: vs.object().schema({
            baz: vs.number(),
        }),
    })),
};
const input = {
    foo: [
        {
            bar: {
                baz: 1,
            },
        },
        {
            bar: {
                baz: 2,
            },
        },
        { // index 2
            bar: {
                baz: "three", // ERROR!
            },
        },
        {
            bar: {
                baz: 4,
            },
        },
    ],
};
assert.throws(
    () => {
        vs.fit(input, schemaObject);
    },
    (err) => {
        assert.strictEqual(err.name, "ValueSchemaError");
        assert.strictEqual(err.cause, vs.CAUSE.TYPE),
        assert.deepStrictEqual(err.keyStack, ["foo", 2, "bar", "baz"]); // route to error key/index: object(key="foo") -> array(index=2) -> object(key="bar") -> object(key="baz")
        return true;
    });
```

#### `vs.CAUSE`

The cause of fitting error.

For more information, see below examples.

#### `vs.NUMERIC_STRING.CHECKSUM_ALGORITHM`

Checksum algorithms for `vs.numericString().checksum()`.

For more information, see [numeric string](#numeric-string).

#### `vs.STRING.PATTERN`

Regular expressions for `vs.string().pattern()`.

For more information, see [string](#string).

### basic usage

#### ambient declarations

```typescript
namespace value-schema {
    export declare function fit<T = any>(data: any, schemaObject: object, onError?: (err: ValueSchemaError | null) => any): T;
}
```

#### `vs.fit(data, schemaObject[, onError])`

Fit `data` to `schemaObject`.

##### `data`

An object to fit; e.g., `req.query`, `req.body` (in [Express](http://expressjs.com/))

`data` will not be overwritten.

##### `schemaObject`

Schema object.

* key: property name of `data` to fit
* value: schema instance; see below examples

##### `onError(err)`

Callback function for each errors.
If no errors, this function will not be called.

If this parameter is omitted, `vs.fit()` throws `ValueSchemaError` on first error and remaining fitting process will be cancelled.

* `err`
    * an instance of `ValueSchemaError` or `null`
    * `err.keyStack` indicates path to key name that caused error: `(string | number)[]`
    * `err` will be `null` after all fitting process has finished and errors has occurred
        * `onError()` will no longer be called after `null` passed
* returns
    * an adjuted value
    * `undefined` means this key will not be included in returned object from `vs.fit()`
    * return value of `onError(null)` is ignored
* throws
    * an exception that will thrown from `vs.fit()`
    * remaining fitting processes will be cancelled

##### examples

###### successful

For more information, see below references about [`vs.number()`](#number), [`vs.string()`](#string), and so on.

```javascript
import vs from "value-schema";
import assert from "assert";

const schemaObject = {
    id: vs.number().minValue(1),
    name: vs.string().maxLength(16, true),
    age: vs.number().integer(true).minValue(0),
    email: vs.email(),
    state: vs.string().only("active", "inactive"),
    classes: vs.array().separatedBy(",").each(vs.number(), true), // "true" means to ignore each errors
    skills: vs.array().separatedBy(",").each(vs.string(), true),
    credit_card: vs.numericString().separatedBy("-").checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD),
    remote_addr: vs.string().pattern(vs.STRING.PATTERN.IPV4),
    remote_addr_ipv6: vs.string().pattern(vs.STRING.PATTERN.IPV6),
    limit: vs.number().integer().default(10).minValue(1, true).maxValue(100, true),
    offset: vs.number().integer().default(0).minValue(0, true),
};
const input = {
    id: "1",
    name: "Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Ciprin Cipriano de la Santísima Trinidad Ruiz y Picasso",
    age: 20.5,
    email: "picasso@example.com",
    state: "active",
    classes: "1,3,abc,4",
    skills: "c,c++,javascript,python,,swift,kotlin",
    credit_card: "4111-1111-1111-1111",
    remote_addr: "127.0.0.1",
    remote_addr_ipv6: "::1",
    limit: "0",
};
const expected = {
    id: 1,
    name: "Pablo Diego José",
    age: 20,
    email: "picasso@example.com",
    state: "active",
    classes: [1, 3, 4],
    skills: ["c", "c++", "javascript", "python", "swift", "kotlin"],
    credit_card: "4111111111111111",
    remote_addr: "127.0.0.1",
    remote_addr_ipv6: "::1",
    limit: 1,
    offset: 0,
};

const fitted = vs.fit(input, schemaObject);
assert.deepStrictEqual(fitted, expected);
```

In TypeScript, use Generics for type-safe.

```typescript
interface Parameters {
    foo: number
    bar: string
}

const schemaObject = {
    foo: vs.number(),
    bar: vs.string(),
};
const input = {
    foo: "12345",
    bar: "abcde",
};

const fitted = vs.fit<Parameters>(input, schemaObject);
```

###### error handling 1

fix errors

```javascript
import vs from "value-schema";
import assert from "assert";

const schemaObject = {
    id: vs.number().minValue(1),
    name: vs.string().maxLength(16, true),
    email: vs.email(),
};
const input = {
    id: 0, // error! (>= 1)
    name: "", // error! (empty string is not allowed)
    email: "john@example.com", // OK
};
const expected = {
    id: 100,
    email: "john@example.com",
};

const fitted = vs.fit(input, schemaObject, generateErrorHandler());
assert.deepStrictEqual(fitted, expected);

function generateErrorHandler() {
    return (err) => {
        if (err === null) {
            // fitting finished
            return;
        }

        const key = err.keyStacks.shift(); // ["id"]
        if (key === "id") {
            // change to 100 on `id` error
            return 100;
        }
        // remove otherwise
    };
}
```

###### error handling 2

throw exception after finished

```javascript
import vs from "value-schema";
import assert from "assert";

const schemaObject = {
    id: vs.number().minValue(1),
    name: vs.string().maxLength(16, true),
    email: vs.email(),
};
const input = {
    id: 0, // error! (>= 1)
    name: "", // error! (empty string is not allowed)
    email: "john@example.com", // OK
};

try {
    vs.fit(input, schemaObject, generateErrorHandler());
}
catch (err) {
    // do something
    assert.strictEqual(err.message, "id,name");
}

function generateErrorHandler() {
    const messages = [];
    return (err) => {
        if (err === null) {
            // fitting finished; join key name as message
            throw new Error(messages.join(","));
        }

        // append key name
        const key = err.keyStacks.shift(); // ["id"]
        messages.push(key);
    };
}
```

###### error handling 3

catch a first error by omitting error handler

```javascript
import vs from "value-schema";
import assert from "assert";

const schemaObject = {
    id: vs.number().minValue(1),
    name: vs.string().maxLength(16, true),
    email: vs.email(),
};
const input = {
    id: 0, // error! (>= 1)
    name: "", // error! (empty string is not allowed)
    email: "john@example.com", // OK
};

try {
    const fitted = vs.fit(input, schemaObject);
}
catch (err) {
    // catch a first error
    assert.deepStrictEqual(err.keyStack, ["id"]);
}
```

###### error handling 4

when input value is not an object

NOTE: `schemaObject` won't be checked because it's predictable; generated by programmer, not an external input

```javascript
import vs from "value-schema";
import assert from "assert";

const schemaObject = {};
const input = 123;

try {
    // `input` must be an object
    const fitted = vs.fit(input, schemaObject);
}
catch (err) {
    assert.deepStrictEqual(err.keyStack, []);
    assert.strictEqual(err.cause, vs.CAUSE.TYPE);
}
```

### boolean

#### ambient declarations

```typescript
namespace vs {
    export declare function boolean(): BooleanSchema;
}

interface BooleanSchema {
    // fitting method
    fit(value: any, onError?: (err: ValueSchemaError) => boolean | void): number;

    // feature methods (chainable)
    strict(): this;
    acceptAllNumbers(): this;
    default(value: boolean): this;
    acceptNull(value?: boolean | null /* = null */): this;
    acceptEmptyString(value?: boolean | null /* = null */): this;
}
```

#### `fit(value[, onError])`

Fit `value` to schema.

If an error occurs, call `onError` (if specified) or throw `ValueSchemaError` (otherwise)

##### examples

```javascript
// should be OK
assert.strictEqual(
    vs.boolean().fit(true),
    true);
assert.strictEqual(
    vs.boolean().fit(false),
    false);

// should be fitted
assert.strictEqual(
    vs.boolean().fit(1),
    true);
assert.strictEqual(
    vs.boolean().fit(0),
    false);
assert.strictEqual(
    vs.boolean().fit("1"),
    true);
assert.strictEqual(
    vs.boolean().fit("0"), // "0" is truthy in JavaScript, but value-schema treats as false!
    false);
assert.strictEqual(
    vs.boolean().fit("true"), // "true" / "yes" / "on" are true, "false" / "no" / "off" are false!
    true);
assert.strictEqual(
    vs.boolean().fit("TRUE"),
    true);
assert.strictEqual(
    vs.boolean().fit("yes"),
    true);
assert.strictEqual(
    vs.boolean().fit("YES"),
    true);
assert.strictEqual(
    vs.boolean().fit("on"),
    true);
assert.strictEqual(
    vs.boolean().fit("ON"),
    true);
assert.strictEqual(
    vs.boolean().fit("false"),
    false);
assert.strictEqual(
    vs.boolean().fit("FALSE"),
    false);
assert.strictEqual(
    vs.boolean().fit("no"),
    false);
assert.strictEqual(
    vs.boolean().fit("NO"),
    false);
assert.strictEqual(
    vs.boolean().fit("off"),
    false);
assert.strictEqual(
    vs.boolean().fit("OFF"),
    false);

// should cause error
assert.throws(
    () => vs.boolean().fit(-1), // accepts only 0,1
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
assert.throws(
    () => vs.boolean().fit("abc"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
assert.throws(
    () => vs.boolean().fit([]),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
assert.throws(
    () => vs.boolean().fit({}),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
```

#### `strict()`

Enable strict type check.

**HANDLE WITH CARE!**
In URL encoding, all values will be treated as string.
Use this method when your system accepts **ONLY** JSON encoding (`application/json`)

##### examples

```javascript
// should cause error
assert.throws(
    () => vs.boolean().strict().fit(1),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
assert.throws(
    () => vs.boolean().strict().fit("1"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
assert.throws(
    () => vs.boolean().strict().fit("true"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
```

#### `acceptAllNumbers()`

Accept all numbers, other than 0 / 1.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.boolean().acceptAllNumbers().fit(-1),
    true);
assert.strictEqual(
    vs.boolean().acceptAllNumbers().fit("100"),
    true);
```

#### `default(value)`

Accept `undefined` for input, and convert to `value`.

If this method is not called, `fit(undefined)` causes `ValueSchemaError`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.boolean().default(true).fit(undefined),
    true);

// should cause error
assert.throws(
    () => vs.boolean().fit(undefined),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.REQUIRED));
```

#### `acceptNull([value])`

Accept a `null` for input, and convert to `value`.

If this method is not called, `fit(null)` causes `ValueSchemaError`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.boolean().acceptNull(true).fit(null),
    true);

// should cause error
assert.throws(
    () => vs.boolean().fit(null),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.NULL));
```

#### `acceptEmptyString([value])`

Accept an empty string(`""`) for input, and convert to `value`.

If this method is not called, `fit("")` causes `ValueSchemaError`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.boolean().acceptEmptyString(true).fit(""),
    true);

// should cause error
assert.throws(
    () => vs.boolean().fit(""),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.EMPTY));
```

### number

#### ambient declarations

```typescript
namespace vs {
    export declare function number(): NumberSchema;
}

interface NumberSchema {
    // fitting method
    fit(value: any, onError?: (err: ValueSchemaError) => number | void): number;

    // feature methods (chainable)
    strict(): this;
    default(value: number): this;
    acceptNull(value?: number | null /* = null */): this;
    acceptEmptyString(value?: number | null /* = null */): this;
    acceptSpecialFormats(): this;
    acceptFullWidth(): this;
    integer(fits?: boolean /* = false */): this;
    only(...values: number[]): this;
    minValue(value: number, fits?: boolean /* = false */): this;
    maxValue(value: number, fits?: boolean /* = false */): this;
    convert(converter: (value: number, fail: () => never) => number): this;
}
```

#### `fit(value[, onError])`

Fit `value` to schema.

If an error occurs, call `onError` (if specified) or throw `ValueSchemaError` (otherwise)

##### examples

```javascript
// should be OK
assert.strictEqual(
    vs.number().fit(-123),
    -123);

// should be fitted
assert.strictEqual(
    vs.number().fit("-123"),
    -123);
assert.strictEqual(
    vs.number().fit(true),
    1);
assert.strictEqual(
    vs.number().fit(false),
    0);

// should cause error
assert.strictEqual( // catch error by callback function (that returns a value from fit() method)
    vs.number().fit(
        "abc",
        (err) => 10),
    10);
assert.throws( // ... or try-catch syntax
    () => vs.number().fit("abc"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
assert.throws(
    () => vs.number().fit("true"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
```

#### `strict()`

Enable strict type check.

**HANDLE WITH CARE!**
In URL encoding, all values will be treated as string.
Use this method when your system accepts **ONLY** JSON encoding (`application/json`)

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.number().fit("123"),
    123);
assert.strictEqual(
    vs.number().fit(true),
    1);

// should cause error
assert.throws(
    () => vs.number().strict().fit("123"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
assert.throws(
    () => vs.number().strict().fit(true),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
```

#### `default(value)`

Accept `undefined` for input, and convert to `value`.

If this method is not called, `fit(undefined)` causes `ValueSchemaError`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.number().default(1).fit(undefined),
    1);

// should cause error
assert.throws(
    () => vs.number().fit(undefined),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.REQUIRED));
```

#### `acceptNull([value])`

Accept a `null` for input, and convert to `value`.

If this method is not called, `fit(null)` causes `ValueSchemaError`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.number().acceptNull(1).fit(null),
    1);

// should cause error
assert.throws(
    () => vs.number().fit(null),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.NULL));
```

#### `acceptEmptyString([value])`

Accept an empty string(`""`) for input, and convert to `value`.

If this method is not called, `fit("")` causes `ValueSchemaError`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.number().acceptEmptyString(1).fit(""),
    1);

// should cause error
assert.throws(
    () => vs.number().fit(""),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.EMPTY));
```

#### `acceptSpecialFormats()`

Accept all special number formats; e.g., `"1e+2"`, `"0x100"`, `"0o100"`, `"0b100"`.

If this method is not called, the above examples causes `ValueSchemaError`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.number().acceptSpecialFormats().fit("1e+2"),
    100);
assert.strictEqual(
    vs.number().acceptSpecialFormats().fit("0x100"),
    256);
assert.strictEqual(
    vs.number().acceptSpecialFormats().fit("0o100"),
    64);
assert.strictEqual(
    vs.number().acceptSpecialFormats().fit("0b100"),
    4);

// should cause error
assert.throws(
    () => vs.number().fit("1e+2"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
```

#### `acceptFullWidth()`

Accept full-width string; e.g., `"１２３４．５"`, `"1２3４.５"`.

If this method is not called, the above examples causes `ValueSchemaError`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.number().acceptFullWidth().fit("１２３４．５"),
    1234.5);

// should cause error
assert.throws(
    () => vs.number().fit("１２３４．５"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
```

#### `integer([fits])`

Limit an input value to integer.

If `fits` is true, value will be converted to an integer.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.number().integer(true).fit(3.14),
    3);
assert.strictEqual(
    vs.number().integer(true).fit("3.14"),
    3);
assert.strictEqual(
    vs.number().integer(true).fit(-3.14),
    -3);
assert.strictEqual(
    vs.number().integer(true).fit("-3.14"),
    -3);

// should cause error
assert.throws(
    () => vs.number().integer().fit(3.14),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
assert.throws(
    () => vs.number().integer().fit("3.14"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
assert.throws(
    () => vs.number().integer().fit("3."),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
```

#### `only(...values)`

Accept only `values`.

If input value is not in `values`, `fit()` method causes `ValueSchemaError`.

##### examples

```javascript
// should be OK
assert.strictEqual(
    vs.number().only(1, 3, 5).fit(1),
    1);

// should cause error
assert.throws(
    () => vs.number().only(1, 3, 5).fit(2),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.ONLY));
```

#### `minValue(value[, fits])`

Limit minimum value to `value`.

If input value is less than `value`, `fit()` method returns `value` (if `fits` is truthy) or causes `ValueSchemaError` (falsy; default).

By default, `value` equals `Number.MIN_SAFE_INTEGER`.

##### examples

```javascript
// should be OK
assert.strictEqual(
    vs.number().fit(Number.MIN_SAFE_INTEGER),
    Number.MIN_SAFE_INTEGER);
assert.strictEqual(
    vs.number().minValue(1).fit(1),
    1);

// should be fitted
assert.strictEqual(
    vs.number().minValue(1, true).fit(0),
    1);

// should cause errors
assert.throws(
    () => vs.number().fit(Number.MIN_SAFE_INTEGER - 1),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.MIN_VALUE));
assert.throws(
    () => vs.number().minValue(1).fit(0),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.MIN_VALUE));
```

#### `maxValue(value[, fits])`

Limit maximum value to `value`.

If input value is greater than `value`, `fit()` method returns `value` (if `fits` is truthy) or causes `ValueSchemaError` (falsy; default).

By default, `value` equals `Number.MAX_SAFE_INTEGER`.

##### examples

```javascript
// should be OK
assert.strictEqual(
    vs.number().fit(Number.MAX_SAFE_INTEGER),
    Number.MAX_SAFE_INTEGER);
assert.strictEqual(
    vs.number().maxValue(1).fit(1),
    1);

// should be fitted
assert.strictEqual(
    vs.number().maxValue(100, true).fit(101),
    100);

// should cause errors
assert.throws(
    () => vs.number().fit(Number.MAX_SAFE_INTEGER + 1),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.MAX_VALUE));
assert.throws(
    () => vs.number().maxValue(100).fit(101),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.MAX_VALUE));
```

#### `convert(converter)`

Convert input value into another value.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.number().convert(value => value + 1).fit(100)
    101);

// should cause errors
assert.throws(
    () => vs.number().convert((value, fail) => fail()).fit(100),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.CONVERT));
```

### string

#### ambient declarations

```typescript
namespace vs {
    export declare function string(): StringSchema;
}

interface StringSchema {
    // fitting method
    fit(value: any, onError?: (err: ValueSchemaError) => string | void): string;

    // feature methods (chainable)
    strict(): this;
    default(value: string): this;
    acceptNull(value?: string | null /* = null */): this;
    acceptEmptyString(value?: string | null /* = null */): this;
    trim(): this;
    only(...values: string[]): this;
    minLength(length: number): this;
    maxLength(length: number, fits?: boolean /* = false */): this;
    pattern(pattern: RegExp): this;
    convert(converter: (value: string, fail: () => never) => string): this;
}
```

#### `fit(value[, onError])`

Fit `value` to schema.

##### examples

```javascript
// should be OK
assert.strictEqual(
    vs.string().fit("123"),
    "123");

// should be fitted
assert.strictEqual(
    vs.string().fit(123),
    "123");
```

#### `strict()`

Enable strict type check.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.string().fit(123),
    "123");
assert.strictEqual(
    vs.string().fit(true),
    "true");

// should cause error
assert.throws(
    () => vs.string().strict().fit(123),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
assert.throws(
    () => vs.string().strict().fit(true),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
```

#### `default(value)`

Accept `undefined` for input, and convert to `value`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.string().default("xyz").fit(undefined),
    "xyz");

// should cause error
assert.throws(
    () => vs.string().fit(undefined),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.REQUIRED));
```

#### `acceptNull([value])`

Accept a `null` for input, and convert to `value`.

If this method is not called, `fit(null)` causes `ValueSchemaError`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.string().acceptNull("x").fit(null),
    "x");

// should cause error
assert.throws(
    () => vs.string().fit(null),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.NULL));
```

#### `acceptEmptyString([value])`

Accept an empty string(`""`) for input, and convert to `value`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.string().acceptEmptyString("xyz").fit(""),
    "xyz");

// should cause error
assert.throws(
    () => vs.string().fit(""),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.EMPTY));
```

#### `trim()`

Remove whitespace from both ends of input.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.string().trim().fit("\r\n hell, word \t "),
    "hell, word");

// should cause error
assert.throws(
    () => vs.string().trim().fit(" \t\r\n "),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.EMPTY));
```

#### `only(...values)`

Accept only `values`.

##### examples

```javascript
// should be OK
assert.strictEqual(
    vs.string().only("eat", "sleep", "play").fit("sleep"),
    "sleep");
assert.strictEqual(
    vs.string().only("").fit(""),
    "");

// should cause error
assert.throws(
    () => vs.string().only("eat", "sleep", "play").fit("study"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.ONLY));
```

#### `minLength(length)`

Limit minimum length of input string to `length`.

##### examples

```javascript
// should be OK
assert.strictEqual(
    vs.string().minLength(5).fit("abcde"),
    "abcde");

// should cause error
assert.throws(
    () => vs.string().minLength(5).fit("a"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.MIN_LENGTH));
```

#### `maxLength(length[, fits])`

Limit maximum length of an input string to `length`.

If string length is greater than `length`, `fit()` method truncates the length to `length` (if `fits` is truthy) or causes `ValueSchemaError` (falsy; default).

##### examples

```javascript
// should be OK
assert.strictEqual(
    vs.string().maxLength(5).fit("abcde"),
    "abcde");

// should be fitted
assert.strictEqual(
    vs.string().maxLength(5, true).fit("abcdefg"),
    "abcde");

// should cause error
assert.throws(
    () => vs.string().maxLength(5).fit("abcdefg"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.MAX_LENGTH));
```

#### `pattern(pattern)`

Specify acceptable pattern by regular expression.

You can also use `vs.STRING.PATTERN` constants

|constant|explanation|
|--------|-----------|
|`vs.STRING.PATTERN.EMAIL`|email address that follows [RFC5321](https://tools.ietf.org/html/rfc5321) / [RFC5322](https://tools.ietf.org/html/rfc5322)|
|`vs.STRING.PATTERN.HTTP`|HTTP/HTTPS URL|
|`vs.STRING.PATTERN.IPV4`|IPv4 address|
|`vs.STRING.PATTERN.IPV6`|IPv6 address|
|`vs.STRING.PATTERN.URI`|URI that follows [RFC3986](https://tools.ietf.org/html/rfc3986)|

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    vs.string().pattern(/^Go+gle$/).fit("Gogle"),
    "Gogle");
assert.deepStrictEqual(
    vs.string().pattern(vs.STRING.PATTERN.URI).fit("https://example.com/path/to/resource?name=value#hash"),
    "https://example.com/path/to/resource?name=value#hash");


// should cause error
assert.throws(
    () => vs.string().pattern(/^Go+gle$/).fit("Ggle"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.PATTERN));
assert.throws(
    () => vs.string().pattern(vs.STRING.PATTERN.URI).fit("https://例.com/"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.PATTERN));
```

#### `convert(converter)`

Convert input value into another value.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.string().convert(value => value + value).fit("abc")
    "abcabc");

// should cause errors
assert.throws(
    () => vs.string().convert((value, fail) => fail()).fit("abc"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.CONVERT));
```

### numeric string

#### ambient declarations

```typescript
namespace vs {
    export declare function numericString(): NumericStringSchema;
}

interface NumericStringSchema {
    // fitting method
    fit(value: any, onError?: (err: ValueSchemaError) => string | void): string;

    // feature methods (chainable)
    default(value: string): this;
    acceptNull(value?: string | null /* = null */): this;
    acceptEmptyString(value?: string | null /* = null */): this;
    fullWidthToHalf(): this;
    joinArray(): this;
    separatedBy(separator: string | RegExp): this;
    minLength(length: number): this;
    maxLength(length: number, fits?: boolean /* = false */): this;
    checksum(algorithm: string): this;
    convert(converter: (value: string, fail: () => never) => string): this;
}
```

#### `fit(value[, onError])`

Fit `value` to schema.

##### examples

```javascript
// should be OK
assert.strictEqual(
    vs.numericString().fit("123"),
    "123");

// should be fitted
assert.strictEqual(
    vs.numericString().fit(123),
    "123");
```

#### `default(value)`

Accpet `undefined` for input, and convert to `value`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.numericString().default("123").fit(undefined),
    "123");

// should cause error
assert.throws(
    () => vs.numericString().fit(undefined),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.REQUIRED));
```

#### `acceptNull([value])`

Accept a `null` for input, and convert to `value`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.numericString().acceptNull("456").fit(null),
    "456");

// should cause error
assert.throws(
    () => vs.numericString().fit(null),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.NULL));
```

#### `acceptEmptyString([value])`

Accept an empty string(`""`) for input, and convert to `value`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.numericString().acceptEmptyString("456").fit(""),
    "456");

// should cause error
assert.throws(
    () => vs.numericString().fit(""),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.EMPTY));
```

#### `separatedBy(separator)`

Assume an input value is separated by `separator`, and ignore them.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.numericString().separatedBy("-").fit("4111-1111-1111-1111"),
    "4111111111111111");

// should cause error
assert.throws(
    () => vs.numericString().fit("4111-1111-1111-1111"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.PATTERN));
```

#### `fullWidthToHalf()`

Convert full-width string to half-width; e.g., `"１２３４"`.

If this method is not called, the above examples causes `ValueSchemaError`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.numericString().fullWidthToHalf().fit("１２３４"),
    "1234");

// should cause error
assert.throws(
    () => vs.numericString().fit("１２３４"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.PATTERN));
```

#### `joinArray()`

Assume an input value is array, and join them.

This method is useful for following form.

```html
<!-- "cc_number" will be passed in array -->
<form>
    Input credit card number:
    <input name="cc_number" required />
    -
    <input name="cc_number" required />
    -
    <input name="cc_number" required />
    -
    <input name="cc_number" required />
</form>
```

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.numericString().joinArray().fit(["1234", "5678"]),
    "12345678");

// should cause error
assert.throws(
    () => vs.numericString().fit(["1234", "5678"]),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
```

#### `minLength(length)`

Limit minimum length of input string to `length`.

##### examples

```javascript
// should be OK
assert.strictEqual(
    vs.numericString().minLength(4).fit("1234"),
    "1234");

// should cause error
assert.throws(
    () => vs.numericString().minLength(5).fit("1234"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.MIN_LENGTH));
```

#### `maxLength(length[, fits])`

Limit maximum length of an input string to `length`.

##### examples

```javascript
// should be OK
assert.strictEqual(
    vs.numericString().maxLength(4).fit("1234"),
    "1234");

// should be fitted
assert.strictEqual(
    vs.numericString().separatedBy("-").maxLength(5, true).fit("1234-5678"),
    "12345");

// should cause error
assert.throws(
    () => vs.numericString().maxLength(5).fit("123456"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.MAX_LENGTH));
```

#### `checksum(algorithm)`

Check an input value by specified algorithm.

|algorithm name|explanation|used by|constant|aliases|
|--------------|-----------|-------|--------|-------|
|`"luhn"`|[Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm)|credit card|`vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.LUHN`|`vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD`|
|`"modulus10/weight3:1"`|[Modulus 10 / Weight 3:1](https://en.wikipedia.org/wiki/International_Standard_Book_Number#ISBN-13_check_digit_calculation)|ISBN-13, EAN, JAN|`vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.MODULUS10_WEIGHT3_1`|`vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13` / `vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.EAN` / `vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.JAN`|

##### examples

```javascript
// should be OK
assert.strictEqual(
    vs.numericString().checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.LUHN).fit("4111111111111111"),
    "4111111111111111");
assert.strictEqual(
    vs.numericString().checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD).fit("4111111111111111"), // alias of LUHN
    "4111111111111111");
assert.strictEqual(
    vs.numericString().checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.MODULUS10_WEIGHT3_1).fit("9784101092058"),
    "9784101092058");
assert.strictEqual(
    vs.numericString().checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13).fit("9784101092058"), // alias of MODULUS10_WEIGHT3_1
    "9784101092058");
assert.strictEqual(
    vs.numericString().checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.EAN).fit("9784101092058"), // alias of MODULUS10_WEIGHT3_1
    "9784101092058");
assert.strictEqual(
    vs.numericString().checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.JAN).fit("9784101092058"), // alias of MODULUS10_WEIGHT3_1
    "9784101092058");

// should cause error
assert.throws(
    () => vs.numericString().checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.LUHN).fit("4111111111111112"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.CHECKSUM));
```

#### `convert(converter)`

Convert input value into another value.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.numericString().convert(value => value.substr(0, 4) + "-" + value.substr(4)).fit("12345678")
    "1234-5678");

// should cause errors
assert.throws(
    () => vs.numericString().convert((value, fail) => fail()).fit("abc"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.CONVERT));
```

### email

#### ambient declarations

```typescript
namespace vs {
    export declare function email(): EmailSchema;
}

interface EmailSchema {
    // fitting method
    fit(value: any, onError?: (err: ValueSchemaError) => string | void): string;

    // feature methods (chainable)
    default(value: string): this;
    acceptNull(value?: string | null /* = null */): this;
    acceptEmptyString(value?: string | null /* = null */): this;
    trim(): this;
    pattern(pattern: RegExp): this;
}
```

#### `fit(value[, onError])`

Fit `value` to schema.

##### examples

```javascript
// should be OK
assert.strictEqual(
    vs.email().fit("user+mailbox/department=shipping@example.com"),
    "user+mailbox/department=shipping@example.com"); // dot-string
assert.strictEqual(
    vs.email().fit("!#$%&'*+-/=?^_`.{|}~@example.com"),
    "!#$%&'*+-/=?^_`.{|}~@example.com"); // dot-string
assert.strictEqual(
    vs.email().fit("\"Fred\\\"Bloggs\"@example.com"),
    "\"Fred\\\"Bloggs\"@example.com"); // quoted-string
assert.strictEqual(
    vs.email().fit("\"Joe.\\\\Blow\"@example.com"),
    "\"Joe.\\\\Blow\"@example.com"); // quoted-string
assert.strictEqual(
    vs.email().fit("user@example-domain.com"),
    "user@example-domain.com");
assert.strictEqual(
    vs.email().fit("user@example2.com"),
    "user@example2.com");

// should cause error
assert.throws(
    () => vs.email().fit("@example.com"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.PATTERN));
assert.throws(
    () => vs.email().fit(".a@example.com"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.PATTERN));
assert.throws(
    () => vs.email().fit("a.@example.com"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.PATTERN));
assert.throws(
    () => vs.email().fit("a..a@example.com"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.PATTERN));
assert.throws(
    () => vs.email().fit("user@example@com"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.PATTERN));
assert.throws(
    () => vs.email().fit("user-example-com"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.PATTERN));
assert.throws(
    () => vs.email().fit("user@example_domain.com"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.PATTERN));
assert.throws(
    () => vs.email().fit("user@example.com2"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.PATTERN));
```

#### `default(value)`

Accept `undefined` for input, and convert to `value`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.email().default("user@example.com").fit(undefined),
    "user@example.com");

// should cause error
assert.throws(
    () => vs.email().fit(undefined),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.REQUIRED));
```

#### `acceptNull([value])`

Accept a `null` for input, and convert to `value`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.email().acceptNull("user@example.com").fit(null),
    "user@example.com");

// should cause error
assert.throws(
    () => vs.email().fit(null),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.NULL));
```

#### `acceptEmptyString([value])`

Accept an empty string(`""`) for input, and convert to `value`.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.email().acceptEmptyString("user@example.com").fit(""),
    "user@example.com");

// should cause error
assert.throws(
    () => vs.email().fit(""),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.EMPTY));
```

#### `trim()`

Remove whitespace from both ends of input.

##### examples

```javascript
// should be fitted
assert.strictEqual(
    vs.email().trim().fit("\r\n user@example.com \t "),
    "user@example.com");

// should cause error
assert.throws(
    () => vs.email().fit("\r\n user@example.com1 \t "),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.PATTERN));
assert.throws(
    () => vs.email().trim().fit(" \t\r\n "),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.EMPTY));
```

#### `pattern(pattern)`

Specify acceptable pattern by regular expression.

##### examples

```javascript
// should be OK
assert.strictEqual(
    vs.email().pattern(/^[\w\.]+@([\w\-]+\.)+\w+$/).fit("......@example.com"), // accept leading/trailing/consecutively dots
    "user@example.com");

// should cause errors
assert.throws(
    () => vs.email().fit("......@example.com"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.PATTERN));
```

### array

#### ambient declarations

```typescript
namespace vs {
    export declare function array<T = any>(): ArraySchema;
}

interface ArraySchema<T> {
    // fitting method
    fit(value: any, onError?: (err: ValueSchemaError) => Array | void): T[];

    // feature methods (chainable)
    default(value: Array): this;
    acceptNull(value?: Array | null /* = null */): this;
    acceptEmptyString(value: Array | null /* = null */): this;
    separatedBy(separator: string | RegExp): this;
    toArray(): this;
    minLength(length: number): this;
    maxLength(length: number, fits?: boolean /* = false */): this;
    each(schema: BaseSchema, ignoreEachErrors: boolean /* = false */): this;
}
```

#### `fit(value[, onError])`

Fit `value` to schema.

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    vs.array().fit([1, "a"]),
    [1, "a"]);

// should cause error
assert.throws(
    () => vs.array().fit("abc"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
assert.throws(
    () => vs.array().fit(0),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
```

#### `default(value)`

Accept `undefined` for input, and convert to `value`.

If this method is not called, `fit(undefined)` causes `ValueSchemaError`.

##### examples

```javascript
// should be fitted
assert.deepStrictEqual(
    vs.array().default([1, "a"]).fit(undefined),
    [1, "a"]);

// should cause error
assert.throws(
    () => vs.array().fit(undefined),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.REQUIRED));
```

#### `acceptNull([value])`

Accept a `null` for input, and convert to `value`.

If this method is not called, `fit(null)` causes `ValueSchemaError`.

##### examples

```javascript
// should be fitted
assert.deepStrictEqual(
    vs.array().acceptNull([1, "a"]).fit(null),
    [1, "a"]);

// should cause error
assert.throws(
    () => vs.array().fit(null),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.NULL));
```

#### `acceptEmptyString([value])`

Accept an empty string(`""`) for input, and convert to `value`.

If this method is not called, `fit("")` causes `ValueSchemaError`.

##### examples

```javascript
// should be fitted
assert.deepStrictEqual(
    vs.array().acceptEmptyString([1, "a"]).fit(""),
    [1, "a"]);

// should cause error
assert.throws(
    () => vs.array().fit(""),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.EMPTY));
```

#### `separatedBy(separator)`

Assume an input value is string and separated by `separator`.

If an input type is array, this method does nothing.

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    vs.array().separatedBy(",").fit([1, 2, 3]),
    [1, 2, 3]);

// should be fitted
assert.deepStrictEqual(
    vs.array().separatedBy(",").fit("1,2,3"),
    ["1", "2", "3"]);

// should cause error
assert.throws(
    () => vs.array().fit("1,2,3"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
```

#### `toArray()`

Convert an input value to array if not.

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    vs.array().toArray().fit([0]),
    [0]);

// should be fitted
assert.deepStrictEqual(
    vs.array().toArray().fit(0),
    [0]);

// should cause error
assert.throws(
    () => vs.array().fit(0),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
```

#### `minLength(length)`

Limit minimum length of input array to `length`.

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    vs.array().minLength(2).fit([1, 2]),
    [1, 2]);

// should cause errors
assert.throws(
    () => vs.array().minLength(2).fit([1]),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.MIN_LENGTH));
```

#### `maxLength(length[, fits])`

Limit maximum length of an input array to `length`.

If array length is greater than `length`, `fit()` method truncates the length to `length` (if `fits` is truthy) or causes `ValueSchemaError` (falsy; default).

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    vs.array().maxLength(2).fit([1, 2]),
    [1, 2]);

// should be fitted
assert.deepStrictEqual(
    vs.array().maxLength(2, true).fit([1, 2, 3]),
    [1, 2]);

// should cause error
assert.throws(
    () => vs.array().maxLength(2).fit([1, 2, 3]),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.MAX_LENGTH));
```

#### `each(schema, [ignoreEachErrors])`

Apply schema for each elements.

* `schema`
    * Any above vs instance, e.g., `vs.number()`, `vs.string()`... `vs.array()`!
* `ignoreEachErrors`
    * If `true`, ignore the errors of each element.
    * default is `false`

##### examples

```javascript
// should be fitted
assert.deepStrictEqual(
    vs.array().each(vs.number(), true).fit([true, "abc", 2]),
    [1, 2]);

// should cause error
assert.throws(
    () => vs.array().each(vs.number()).fit([true, "abc", 2]),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.EACH_TYPE));
```

### object

#### ambient declarations

```typescript
namespace vs {
    export declare function object<T = any>(): ObjectSchema;
}

interface ObjectSchema<T> {
    // fitting method
    fit(value: any, onError?: (err: ValueSchemaError) => Object | void): T;

    // feature methods (chainable)
    default(value: Object): this;
    acceptNull(value?: Object | null /* = null */): this;
    acceptEmptyString(value: Object | null /* = null */): this;
    schema(schema): ObjectSchema;
}
```

#### `fit(value[, onError])`

Fit `value` to schema.

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    vs.object().fit({a: 1, b: 2}),
    {a: 1, b: 2});

// should cause error
assert.throws(
    () => vs.object().fit("abc"),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
assert.throws(
    () => vs.object().fit(0),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
```

#### `default(value)`

Accept `undefined` for input, and convert to `value`.

If this method is not called, `fit(undefined)` causes `ValueSchemaError`.

##### examples

```javascript
// should be fitted
assert.deepStrictEqual(
    vs.object().default({a: 1, b: 2}).fit(undefined),
    {a: 1, b: 2});

// should cause error
assert.throws(
    () => vs.object().fit(undefined),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.REQUIRED));
```

#### `acceptNull([value])`

Accept a `null` for input, and convert to `value`.

If this method is not called, `fit(null)` causes `ValueSchemaError`.

##### examples

```javascript
// should be fitted
assert.deepStrictEqual(
    vs.object().acceptNull({a: 1, b: 2}).fit(null),
    {a: 1, b: 2});

// should cause error
assert.throws(
    () => vs.object().fit(null),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.NULL));
```

#### `acceptEmptyString([value])`

Accept an empty string(`""`) for input, and convert to `value`.

If this method is not called, `fit("")` causes `ValueSchemaError`.

##### examples

```javascript
// should be fitted
assert.deepStrictEqual(
    vs.object().acceptEmptyString({a: 1, b: 2}).fit(""),
    {a: 1, b: 2});

// should cause error
assert.throws(
    () => vs.object().fit(""),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.EMPTY));
```

#### `schema(schema)`

Assume an input value is string and separated by `separator`.

If an input type is array, this method does nothing.

##### examples

```javascript
// should be OK
const schema = {a: vs.number(), b: vs.string()};
assert.deepStrictEqual(
    vs.object().schema(schema).fit({a: 1, b: "2"}),
    {a: 1, b: "2"});

// should be fitted
assert.deepStrictEqual(
    vs.object().schema(schema).fit({a: 1, b: 2}),
    {a: 1, b: "2"});

// should cause error
assert.throws(
    () => vs.object().schema(schema).fit({a: "x", b: "2"}),
    (err) => (err.name === "ValueSchemaError" && err.cause === vs.CAUSE.TYPE));
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

[image-build-windows]: https://github.com/shimataro/value-schema/workflows/Windows/badge.svg?event=push&branch=v2
[link-build-windows]: https://github.com/shimataro/value-schema/actions?query=workflow%3AWindows
[image-build-macos]: https://github.com/shimataro/value-schema/workflows/macOS/badge.svg?event=push&branch=v2
[link-build-macos]: https://github.com/shimataro/value-schema/actions?query=workflow%3AmacOS
[image-build-linux]: https://github.com/shimataro/value-schema/workflows/Linux/badge.svg?event=push&branch=v2
[link-build-linux]: https://github.com/shimataro/value-schema/actions?query=workflow%3ALinux
[image-examples]: https://github.com/shimataro/value-schema/workflows/Examples/badge.svg?event=push&branch=v2
[link-examples]: https://github.com/shimataro/value-schema/actions?query=workflow%3AExamples
[image-code-coverage]: https://img.shields.io/codecov/c/github/shimataro/value-schema/master.svg
[link-code-coverage]: https://codecov.io/gh/shimataro/value-schema
[image-release]: https://img.shields.io/github/release/shimataro/value-schema.svg
[link-release]: https://github.com/shimataro/value-schema/releases
[image-engine]: https://img.shields.io/node/v/value-schema.svg
[link-engine]: https://nodejs.org/
[image-license]: https://img.shields.io/github/license/shimataro/value-schema.svg
[link-license]: ./LICENSE
