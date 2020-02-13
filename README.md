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
    age: vs.number({ // number, integer (trims if decimal), >=0
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
const expected = { // should be converted to this
    id: 1,
    name: "Pablo Diego José",
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
const actual = vs.applySchema(input, schemaObject);

// verification
assert.deepStrictEqual(actual, expected);
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
```

### TypeScript / ES6 Modules with [Babel](https://babeljs.io/)

TypeScript auto-completion works perfectly on [Visual Studio Code](https://code.visualstudio.com/) and [IntelliJ IDEA](https://www.jetbrains.com/idea/)!

```typescript
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
|`cause`|cause of error; see `vs.CAUSE`|
|`value`|value to apply|
|`keyStack`|array consists of path to key name(for object) or index(for array) that caused error; for nested object or array|

See below example.
For detail about schema / `value-schema`, see [basic usage](#basic-usage)

```javascript
import vs from "value-schema";
import assert from "assert";

// {foo: Array<{bar: {baz: number}}>}
const schemaObject = {
    foo: vs.array({
        each: vs.object({
            schemaObject: {
                bar: vs.object({
                    schemaObject: {
                        baz: vs.number(),
                    },
                }),
            },
        }),
    }),
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
        vs.applySchema(input, schemaObject);
    },
    {
        name: "ValueSchemaError",
        cause: vs.CAUSE.TYPE,
        keyStack: ["foo", 2, "bar", "baz"], // route to error key/index: object(key="foo") -> array(index=2) -> object(key="bar") -> object(key="baz")
    });
```

#### `vs.CAUSE`

The cause of fitting error.

For more information, see below examples.

#### `vs.NUMBER.INTEGER`

Rounding mode.

For more information, see [number](#number).

#### `vs.NUMERIC_STRING.CHECKSUM_ALGORITHM`

Checksum algorithms for numeric string.

For more information, see [numeric string](#numeric-string).

#### `vs.STRING.PATTERN`

Regular expressions for string.

For more information, see [string](#string).

### basic usage

#### `vs.applySchema(data, schemaObject[, onError[, onFinished]])`

apply `schemaObject` to `data`.

##### `data`

An object to be applied schema; e.g., `req.query`, `req.body` (in [Express](http://expressjs.com/))

`data` will **NOT** be overwritten.

##### `schemaObject`

Schema object.

* key: property name of `data`
* value: schema instance; see below examples

##### `onError(err)`

Callback function for each errors.
If no errors, this function will not be called.

If this parameter is omitted, `vs.applySchema()` throws `ValueSchemaError` on first error and remaining fitting process will be cancelled.

* `err`
    * an instance of `ValueSchemaError`
    * `err.keyStack` indicates path to key name that caused error: `(string | number)[]`
* returns
    * an adjuted value
* throws
    * an exception that will thrown from `vs.applySchema()`
    * remaining processes will be cancelled

##### `onFinished()`

Called after finished all error handlings.
Will **NOT** called if no errors.

##### examples

###### successful

For more information, see below references about [`vs.number()`](#number), [`vs.string()`](#string), and so on.

```javascript
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
    age: vs.number({ // number, integer (trims if decimal), >=0
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
const expected = { // should be converted to this
    id: 1,
    name: "Pablo Diego José",
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
const actual = vs.applySchema(input, schemaObject);

// verification
assert.deepStrictEqual(actual, expected);
```

In TypeScript, use "Generics" for type-safe.

```typescript
interface Parameters {
    foo: number
    bar: string
}

const schemaObject: vs.SchemaObject = {
    foo: vs.number(),
    bar: vs.string(),
};
const input = {
    foo: "12345",
    bar: "abcde",
};

const actual = vs.applySchema<Parameters>(input, schemaObject);
```

###### error handling 1

fix errors

```javascript
import vs from "value-schema";
import assert from "assert";

const schemaObject = {
    id: vs.number({
        minValue: 1,
    }),
    name: vs.string({
        maxLength: {
            length: 16,
            trims: true,
        },
    }),
    email: vs.email(),
};
const input = {
    id: 0, // error! (>= 1)
    name: "", // error! (empty string is not allowed)
    email: "john@example.com", // OK
};
const expected = {
    id: 100,
    name: "John Doe",
    email: "john@example.com",
};

const actual = vs.applySchema(input, schemaObject, (err) => {
    const key = err.keyStack.shift();
    switch(key) {
    case "id":
        return 100;
    case "name":
        return "John Doe";
    default:
        return null;
    }
});
assert.deepStrictEqual(actual, expected);
```

###### error handling 2

throw exception after finished

```javascript
import vs from "value-schema";
import assert from "assert";

const schemaObject = {
    id: vs.number({
        minValue: 1,
    }),
    name: vs.string({
        maxLength: {
            length: 16,
            trims: true,
        },
    }),
    email: vs.email(),
};
const input = {
    id: 0, // error! (>= 1)
    name: "", // error! (empty string is not allowed)
    email: "john@example.com", // OK
};

assert.throws(() => {
    const messages = [];
    vs.applySchema(input, schemaObject, (err) => {
        // append key name
        const key = err.keyStack.shift();
        if(key !== undefined) {
            messages.push(key);
        }
    }, () => {
        // finished; join key name as message
        throw Error(messages.sort().join(","));
    });
}, {
    name: "Error",
    message: "id,name",
});
```

###### error handling 3

catch a first error by omitting error handler

```javascript
import vs from "value-schema";
import assert from "assert";

const schemaObject = {
    id: vs.number({
        minValue: 1,
    }),
    name: vs.string({
        maxLength: {
            length: 16,
            trims: true,
        },
    }),
    email: vs.email(),
};
const input = {
    id: 0, // error! (>= 1)
    name: "", // error! (empty string is not allowed)
    email: "john@example.com", // OK
};

assert.throws(() => {
    // throws first error
    vs.applySchema(input, schemaObject);
}, {
    name: "ValueSchemaError",
    cause: vs.CAUSE.MIN_VALUE,
    value: 0,
    keyStack: ["id"],
});
```

###### error handling 4

when input value is not an object

NOTE: `schemaObject` won't be checked because it's predictable; generated by programmer, not an external input

```javascript
import vs from "value-schema";
import assert from "assert";

const schemaObject = {};
const input = 123;

assert.throws(() => {
    // `input` must be an object
    vs.applySchema(input, schemaObject);
}, {
    name: "ValueSchemaError",
    cause: vs.CAUSE.TYPE,
    value: 123,
    keyStack: [],
});
```

### boolean

#### ambient declarations

```typescript
type OptionsForBoolean = {
    strict?: boolean;
    acceptsAllNumbers?: boolean;

    ifUndefined?: boolean | null;
    ifEmptyString?: boolean | null;
    ifNull?: boolean | null;
}
function boolean(options?: OptionsForBoolean): BooleanSchema;

type ErrorHandler = (err: ValueSchemaError) => boolean | null | never;
interface BooleanSchema {
    applyTo(value: unknown, onError?: ErrorHandler): boolean | null
}
```

#### `applyTo(value[, onError])`

Apply schema to `value`.

If an error occurs, this method calls `onError` (if specified) or throw `ValueSchemaError` (otherwise).

```javascript
// should be OK
assert.strictEqual(
    vs.boolean().applyTo(true),
    true);
assert.strictEqual(
    vs.boolean().applyTo(false),
    false);

// should be adjusted
assert.strictEqual(
    vs.boolean().applyTo(1),
    true);
assert.strictEqual(
    vs.boolean().applyTo(0),
    false);
assert.strictEqual(
    vs.boolean().applyTo("1"),
    true);
assert.strictEqual(
    vs.boolean().applyTo("0"), // "0" is truthy in JavaScript, but value-schema treats as false!
    false);

// other truthy values
for (const truthy of ["true", "TRUE", "yes", "YES", "on", "ON"]) {
    assert.strictEqual(
        vs.boolean().applyTo(truthy),
        true);
}
// other falsy values
for (const falsy of ["false", "FALSE", "no", "NO", "off", "OFF"]) {
    assert.strictEqual(
        vs.boolean().applyTo(falsy),
        false);
}

// should cause error
assert.throws(
    () => vs.boolean().applyTo(-1), // accepts only 0,1
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
assert.throws(
    () => vs.boolean().applyTo("abc"),
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
assert.throws(
    () => vs.boolean().applyTo([]),
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
assert.throws(
    () => vs.boolean().applyTo({}),
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
```

#### options

##### `strict`

Enable strict type check.
**defaults: false**

**HANDLE WITH CARE!**
In URL encoding, all values will be treated as string.
Use this method when your system accepts **ONLY** JSON encoding (`application/json`)

```javascript
// should cause error
assert.throws(
    () => vs.boolean({strict: true}).applyTo(1),
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
assert.throws(
    () => vs.boolean({strict: true}).applyTo("1"),
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
assert.throws(
    () => vs.boolean({strict: true}).applyTo("true"),
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
```

##### `acceptsAllNumbers`

Accepts all numbers or not, other than 0 / 1.
**defaults: false**

```javascript
// should be adjusted
assert.strictEqual(
    vs.boolean({acceptsAllNumbers: true}).applyTo(-1),
    true);
assert.strictEqual(
    vs.boolean({acceptsAllNumbers: true}).applyTo("100"),
    true);
```

##### `ifUndefined`

Specifies return value when input value is `undefined`.

If this option is omitted, `applyTo(undefined)` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.boolean({ifUndefined: true}).applyTo(undefined),
    true);

// should cause error
assert.throws(
    () => vs.boolean().applyTo(undefined),
    {name: "ValueSchemaError", cause: vs.CAUSE.UNDEFINED});
```

##### `ifNull`

Specifies return value when input value is `null`.

If this option is omitted, `applyTo(null)` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.boolean({ifNull: true}).applyTo(null),
    true);

// should cause error
assert.throws(
    () => vs.boolean().applyTo(null),
    {name: "ValueSchemaError", cause: vs.CAUSE.NULL});
```

##### `ifEmptyString`

Specifies return value when input value is `""`.

If this option is omitted, `applyTo("")` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.boolean({ifEmptyString: true}).applyTo(""),
    true);

// should cause error
assert.throws(
    () => vs.boolean().applyTo(""),
    {name: "ValueSchemaError", cause: vs.CAUSE.EMPTY_STRING});
```

### number

#### ambient declarations

```typescript
type OptionsForNumber = {
    strict?: boolean;
    acceptsSpecialFormats?: boolean;
    acceptsFullWidth?: boolean;

    ifUndefined?: number | null;
    ifEmptyString?: number | null;
    ifNull?: number | null;

    integer?: boolean | NUMBER.INTEGER;
    only?: number[];
    minValue?: number | {value: number, adjusts: boolean};
    maxValue?: number | {value: number, adjusts: boolean};
}
function number(options?: OptionsForNumber): NumberSchema;

type ErrorHandler = (err: ValueSchemaError) => number | null | never;
interface NumberSchema {
    applyTo(value: unknown, onError?: ErrorHandler): number | null
}
```

#### `applyTo(value[, onError])`

Apply schema to `value`.

If an error occurs, this method calls `onError` (if specified) or throw `ValueSchemaError` (otherwise).

```javascript
// should be OK
assert.strictEqual(
    vs.number().applyTo(-123),
    -123);

// should be adjusted
assert.strictEqual(
    vs.number().applyTo("-123"),
    -123);
assert.strictEqual(
    vs.number().applyTo(true),
    1);
assert.strictEqual(
    vs.number().applyTo(false),
    0);

// should cause error
assert.strictEqual( // catch error by callback function (that returns a value from applyTo() method)
    vs.number().applyTo(
        "abc",
        (err) => 10),
    10);
assert.throws( // ... or try-catch syntax
    () => vs.number().applyTo("abc"),
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
assert.throws(
    () => vs.number().applyTo("true"),
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
```

#### options

##### `strict`

Enable strict type check.
**defaults: false**

**HANDLE WITH CARE!**
In URL encoding, all values will be treated as string.
Use this method when your system accepts **ONLY** JSON encoding (`application/json`)

```javascript
// should be adjusted
assert.strictEqual(
    vs.number().applyTo("123"),
    123);
assert.strictEqual(
    vs.number().applyTo(true),
    1);

// should cause error
assert.throws(
    () => vs.number({strict: true}).applyTo("123"),
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
assert.throws(
    () => vs.number({strict: true}).applyTo(true),
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
```

##### `ifUndefined`

Specifies return value when input value is `undefined`.

If this option is omitted, `applyTo(undefined)` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.number({ifUndefined: 1}).applyTo(undefined),
    1);

// should cause error
assert.throws(
    () => vs.number().applyTo(undefined),
    {name: "ValueSchemaError", cause: vs.CAUSE.UNDEFINED});
```

##### `ifNull`

Specifies return value when input value is `null`.

If this option is omitted, `applyTo(null)` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.number({ifNull: 1}).applyTo(null),
    1);

// should cause error
assert.throws(
    () => vs.number().applyTo(null),
    {name: "ValueSchemaError", cause: vs.CAUSE.NULL});
```

##### `ifEmptyString`

Specifies return value when input value is `""`.

If this option is omitted, `applyTo("")` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.number({ifEmptyString: 1}).applyTo(""),
    1);

// should cause error
assert.throws(
    () => vs.number().applyTo(""),
    {name: "ValueSchemaError", cause: vs.CAUSE.EMPTY_STRING});
```

##### `acceptsSpecialFormats`

Accepts all special number formats; e.g., `"1e+2"`, `"0x100"`, `"0o100"`, `"0b100"`.
**defaults: false**

```javascript
// should be adjusted
assert.strictEqual(
    vs.number({acceptsSpecialFormats: true}).applyTo("1e+2"),
    100);
assert.strictEqual(
    vs.number({acceptsSpecialFormats: true}).applyTo("0x100"),
    256);
assert.strictEqual(
    vs.number({acceptsSpecialFormats: true}).applyTo("0o100"),
    64);
assert.strictEqual(
    vs.number({acceptsSpecialFormats: true}).applyTo("0b100"),
    4);

// should cause error
assert.throws(
    () => vs.number().applyTo("1e+2"),
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
```

##### `acceptsFullWidth`

Accepts full-width string; e.g., `"１２３４．５"`, `"1２3４.５"`.
**defaults: false**

```javascript
// should be adjusted
assert.strictEqual(
    vs.number({acceptsFullWidth: true}).applyTo("１２３４．５"),
    1234.5);

// should cause error
assert.throws(
    () => vs.number().applyTo("１２３４．５"),
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
```

##### `integer`

Limits an input value to integer.

|value|description|
|-----|-----------|
|`NUMBER.INTEGER.NO` (`0`) / `false`|does not limit to integer|
|`NUMBER.INTEGER.YES` (`1`) / `true`|limits to integer, but does not round|
|`NUMBER.INTEGER.FLOOR` (`2`)|rounds down toward infinity|
|`NUMBER.INTEGER.FLOOR_RZ` (`3`)|rounds down toward zero|
|`NUMBER.INTEGER.CEIL` (`4`)|rounds up toward infinity|
|`NUMBER.INTEGER.CEIL_RZ` (`5`)|rounds up toward zero|
|`NUMBER.INTEGER.HALF_UP` (`6`)|rounds half up toward infinity|
|`NUMBER.INTEGER.HALF_UP_RZ` (`7`)|rounds half up toward zero|

```javascript
// should be adjusted
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.FLOOR}).applyTo(3.14),
    3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.FLOOR}).applyTo("3.14"),
    3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.FLOOR}).applyTo(-3.14),
    -4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.FLOOR_RZ}).applyTo(3.14),
    3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.FLOOR_RZ}).applyTo(-3.14),
    -3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.CEIL}).applyTo(3.14),
    4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.CEIL}).applyTo(-3.14),
    -3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.CEIL_RZ}).applyTo(3.14),
    4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.CEIL_RZ}).applyTo(-3.14),
    -4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_UP}).applyTo(3.49),
    3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_UP}).applyTo(3.5),
    4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_UP}).applyTo(-3.5),
    -3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_UP}).applyTo(-3.51),
    -4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_UP_RZ}).applyTo(3.49),
    3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_UP_RZ}).applyTo(3.5),
    4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_UP_RZ}).applyTo(-3.49),
    -3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_UP_RZ}).applyTo(-3.5),
    -4);

// should cause error
assert.throws(
    () => vs.number({integer: true}).applyTo(3.14),
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
assert.throws(
    () => vs.number({integer: vs.NUMBER.INTEGER.YES}).applyTo(3.14), // equivalent to "true"
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
```

##### `only`

Accepts only particular values.

```javascript
// should be OK
assert.strictEqual(
    vs.number({only: [1, 3, 5]}).applyTo(1),
    1);

// should cause error
assert.throws(
    () => vs.number({only: [1, 3, 5]}).applyTo(2),
    {name: "ValueSchemaError", cause: vs.CAUSE.ONLY});
```

##### `minValue`

Limits minimum value.

```javascript
// should be adjusted
assert.strictEqual(
    vs.number({minValue: {value: 1, adjusts: true}}).applyTo(0),
    1);

// should cause errors
assert.throws(
    () => vs.number({minValue: {value: 1, adjusts: false}}).applyTo(0),
    {name: "ValueSchemaError", cause: vs.CAUSE.MIN_VALUE});
assert.throws(
    () => vs.number({minValue: 1}).applyTo(0), // shorthand of {value: 1, adjusts: false}
    {name: "ValueSchemaError", cause: vs.CAUSE.MIN_VALUE});
```

##### `maxValue(value[, fits])`

Limits maximum value.

```javascript
// should be adjusted
assert.strictEqual(
    vs.number({maxValue: {value: 100, adjusts: true}}).applyTo(101),
    100);

// should cause errors
assert.throws(
    () => vs.number({maxValue: {value: 100, adjusts: false}}).applyTo(101),
    {name: "ValueSchemaError", cause: vs.CAUSE.MAX_VALUE});
assert.throws(
    () => vs.number({maxValue: 100}).applyTo(101), // shorthand of {value: 100, adjusts: false}
    {name: "ValueSchemaError", cause: vs.CAUSE.MAX_VALUE});
```

### string

#### ambient declarations

```typescript
type OptionsForString = {
    strict?: boolean;

    ifUndefined?: string | null;
    ifEmptyString?: string | null;
    ifNull?: string | null;

    trims?: boolean;

    only?: string[];
    minLength?: number;
    maxLength?: number | {length: number, trims: boolean};
    pattern?: RegExp;
}
function string(options?: OptionsForString): StringSchema;

type ErrorHandler = (err: ValueSchemaError) => string | null | never;
interface StringSchema {
    applyTo(value: unknown, onError?: ErrorHandler): string | null
}
```

#### `applyTo(value[, onError])`

Apply schema to `value`.

If an error occurs, this method calls `onError` (if specified) or throw `ValueSchemaError` (otherwise).

```javascript
// should be OK
assert.strictEqual(
    vs.string().applyTo("123"),
    "123");

// should be adjusted
assert.strictEqual(
    vs.string().applyTo(123),
    "123");

// should cause error
assert.throws(
    () => vs.string().applyTo({}),
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
```

#### options

##### `strict`

Enable strict type check.
**defaults: false**

```javascript
// should be adjusted
assert.strictEqual(
    vs.string().applyTo(123),
    "123");
assert.strictEqual(
    vs.string().applyTo(true),
    "true");

// should cause error
assert.throws(
    () => vs.string({strict: true}).applyTo(123),
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
assert.throws(
    () => vs.string({strict: true}).applyTo(true),
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
```

##### `ifUndefined`

Specifies return value when input value is `undefined`.

If this option is omitted, `applyTo(undefined)` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.string({ifUndefined: "xyz"}).applyTo(undefined),
    "xyz");

// should cause error
assert.throws(
    () => vs.string().applyTo(undefined),
    {name: "ValueSchemaError", cause: vs.CAUSE.UNDEFINED});
```

##### `ifNull`

Specifies return value when input value is `null`.

If this method is not called, `applyTo(null)` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.string({ifNull: "x"}).applyTo(null),
    "x");

// should cause error
assert.throws(
    () => vs.string().applyTo(null),
    {name: "ValueSchemaError", cause: vs.CAUSE.NULL});
```

##### `ifEmptyString`

Specifies return value when input value is `undefined`.

If this option is omitted, `applyTo("")` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.string({ifEmptyString: "xyz"}).applyTo(""),
    "xyz");

// should cause error
assert.throws(
    () => vs.string().applyTo(""),
    {name: "ValueSchemaError", cause: vs.CAUSE.EMPTY_STRING});
```

##### `trims`

Removes whitespace from both ends of input.
**defaults: false**

```javascript
// should be adjusted
assert.strictEqual(
    vs.string({trims: true}).applyTo("\r\n hell, word \t "),
    "hell, word");

// should cause error
assert.throws(
    () => vs.string({trims: true}).applyTo(" \t\r\n "),
    {name: "ValueSchemaError", cause: vs.CAUSE.EMPTY_STRING});
```

##### `only`

Accepts only particular values.

```javascript
// should be OK
assert.strictEqual(
    vs.string({only: ["eat", "sleep", "play"]}).applyTo("sleep"),
    "sleep");
assert.strictEqual(
    vs.string({only: [""]}).applyTo(""),
    "");

// should cause error
assert.throws(
    () => vs.string({only: ["eat", "sleep", "play"]}).applyTo("study"),
    {name: "ValueSchemaError", cause: vs.CAUSE.ONLY});
```

##### `minLength`

Limits minimum length of input string.

```javascript
// should be OK
assert.strictEqual(
    vs.string({minLength: 5}).applyTo("abcde"),
    "abcde");

// should cause error
assert.throws(
    () => vs.string({minLength: 5}).applyTo("a"),
    {name: "ValueSchemaError", cause: vs.CAUSE.MIN_LENGTH});
```

##### `maxLength`

Limits maximum length of an input string.

```javascript
// should be OK
assert.strictEqual(
    vs.string({maxLength: {length: 5, trims: false}}).applyTo("abcde"),
    "abcde");

// should be adjusted
assert.strictEqual(
    vs.string({maxLength: {length: 5, trims: true}}).applyTo("abcdefg"),
    "abcde");

// should cause error
assert.throws(
    () => vs.string({maxLength: {length: 5, trims: false}}).applyTo("abcdefg"),
    {name: "ValueSchemaError", cause: vs.CAUSE.MAX_LENGTH});
assert.throws(
    () => vs.string({maxLength: 5}).applyTo("abcdefg"), // shorthand of {length: 5, trims: false}
    {name: "ValueSchemaError", cause: vs.CAUSE.MAX_LENGTH});
```

##### `pattern`

Specifies acceptable pattern by regular expression.

You can also use `STRING.PATTERN` constants

|constant|explanation|
|--------|-----------|
|`STRING.PATTERN.EMAIL`|email address that follows [RFC5321](https://tools.ietf.org/html/rfc5321) / [RFC5322](https://tools.ietf.org/html/rfc5322)|
|`STRING.PATTERN.HTTP`|HTTP/HTTPS URL|
|`STRING.PATTERN.IPV4`|IPv4 address|
|`STRING.PATTERN.IPV6`|IPv6 address|
|`STRING.PATTERN.URI`|URI that follows [RFC3986](https://tools.ietf.org/html/rfc3986)|

```javascript
// should be OK
assert.deepStrictEqual(
    vs.string({pattern: /^Node.js$/}).applyTo("NodeXjs"),
    "NodeXjs");
assert.deepStrictEqual(
    vs.string({pattern: vs.STRING.PATTERN.URI}).applyTo("https://example.com/path/to/resource?name=value#hash"),
    "https://example.com/path/to/resource?name=value#hash");


// should cause error
assert.throws(
    () => vs.string({pattern: /^Node.js$/}).applyTo("NODE.JS"),
    {name: "ValueSchemaError", cause: vs.CAUSE.PATTERN});
assert.throws(
    () => vs.string({pattern: vs.STRING.PATTERN.URI}).applyTo("https://例.com/"),
    {name: "ValueSchemaError", cause: vs.CAUSE.PATTERN});
```

### numeric string

#### ambient declarations

```typescript
type OptionsForNumericString = {
    ifUndefined?: string | null;
    ifEmptyString?: string | null;
    ifNull?: string | null;

    fullWidthToHalf?: boolean;
    joinsArray?: boolean;

    minLength?: number;
    maxLength?: number | {length: number, trims: boolean};
    separatedBy?: string | RegExp;
    pattern?: RegExp;
    checksum?: NUMERIC_STRING.CHECKSUM_ALGORITHM;
}
function numericString(options?: OptionsForNumericString): NumericStringSchema;

type ErrorHandler = (err: ValueSchemaError) => string | null | never;
interface NumericStringSchema {
    applyTo(value: unknown, onError?: ErrorHandler): string | null
}
```

#### `applyTo(value[, onError])`

Apply schema to `value`.

If an error occurs, this method calls `onError` (if specified) or throw `ValueSchemaError` (otherwise).

```javascript
// should be OK
assert.strictEqual(
    vs.numericString().applyTo("123"),
    "123");

// should be adjusted
assert.strictEqual(
    vs.numericString().applyTo(123),
    "123");

// should cause error
assert.throws(
    () => vs.numericString().applyTo("abc"),
    {name: "ValueSchemaError", cause: vs.CAUSE.PATTERN});
```

#### options

##### `ifUndefined`

Specifies return value when input value is `undefined`.

If this option is omitted, `applyTo(undefined)` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.numericString({ifUndefined: "123"}).applyTo(undefined),
    "123");

// should cause error
assert.throws(
    () => vs.numericString().applyTo(undefined),
    {name: "ValueSchemaError", cause: vs.CAUSE.UNDEFINED});
```

##### `ifNull`

Specifies return value when input value is `null`.

If this option is omitted, `applyTo(null)` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.numericString({ifNull: "456"}).applyTo(null),
    "456");

// should cause error
assert.throws(
    () => vs.numericString().applyTo(null),
    {name: "ValueSchemaError", cause: vs.CAUSE.NULL});
```

##### `ifEmptyString`

Specifies return value when input value is `""`.

If this option is omitted, `applyTo("")` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.numericString({ifEmptyString: "456"}).applyTo(""),
    "456");

// should cause error
assert.throws(
    () => vs.numericString().applyTo(""),
    {name: "ValueSchemaError", cause: vs.CAUSE.EMPTY_STRING});
```

##### `separatedBy`

Assumes an input value is separated by delimiter, and ignore them.

```javascript
// should be adjusted
assert.strictEqual(
    vs.numericString({separatedBy: "-"}).applyTo("4111-1111-1111-1111"),
    "4111111111111111");

// should cause error
assert.throws(
    () => vs.numericString().applyTo("4111-1111-1111-1111"),
    {name: "ValueSchemaError", cause: vs.CAUSE.PATTERN});
```

##### `fullWidthToHalf`

Converts full-width string to half-width; e.g., `"１２３４"`.
**defaults: false**

```javascript
// should be adjusted
assert.strictEqual(
    vs.numericString({fullWidthToHalf: true}).applyTo("１２３４"),
    "1234");

// should cause error
assert.throws(
    () => vs.numericString().applyTo("１２３４"),
    {name: "ValueSchemaError", cause: vs.CAUSE.PATTERN});
```

##### `joinsArray`

Assumes an input value is array, and join them.
**defaults: false**

This method is useful for the following form.

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

```javascript
// should be adjusted
assert.strictEqual(
    vs.numericString({joinsArray: true}).applyTo(["1234", "5678"]),
    "12345678");

// should cause error
assert.throws(
    () => vs.numericString().applyTo(["1234", "5678"]),
    {name: "ValueSchemaError", cause: vs.CAUSE.TYPE});
```

##### `minLength`

Limits minimum length of input string.

```javascript
// should be OK
assert.strictEqual(
    vs.numericString({minLength: 4}).applyTo("1234"),
    "1234");

// should cause error
assert.throws(
    () => vs.numericString({minLength: 5}).applyTo("1234"),
    {name: "ValueSchemaError", cause: vs.CAUSE.MIN_LENGTH});
```

##### `maxLength`

Limits maximum length of an input string.

```javascript
// should be OK
assert.strictEqual(
    vs.numericString({maxLength: {length: 4, trims: false}}).applyTo("1234"),
    "1234");

// should be adjusted
assert.strictEqual(
    vs.numericString({maxLength: {length: 5, trims: true}, separatedBy: "-"}).applyTo("1234-5678"),
    "12345");

// should cause error
assert.throws(
    () => vs.numericString({maxLength: {length: 5, trims: false}}).applyTo("123456"),
    {name: "ValueSchemaError", cause: vs.CAUSE.MAX_LENGTH});
assert.throws(
    () => vs.numericString({maxLength: 5}).applyTo("123456"), // shorthand of {length: 5, trims: false}
    {name: "ValueSchemaError", cause: vs.CAUSE.MAX_LENGTH});
```

##### `checksum`

Checks input value by specified algorithm.

|algorithm name|explanation|used by|constant|aliases|
|--------------|-----------|-------|--------|-------|
|`"luhn"`|[Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm)|credit card|`NUMERIC_STRING.CHECKSUM_ALGORITHM.LUHN`|`NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD`|
|`"modulus10/weight3:1"`|[Modulus 10 / Weight 3:1](https://en.wikipedia.org/wiki/International_Standard_Book_Number#ISBN-13_check_digit_calculation)|ISBN-13, EAN, JAN|`NUMERIC_STRING.CHECKSUM_ALGORITHM.MODULUS10_WEIGHT3_1`|`NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13` / `NUMERIC_STRING.CHECKSUM_ALGORITHM.EAN` / `NUMERIC_STRING.CHECKSUM_ALGORITHM.JAN`|

```javascript
// should be OK
assert.strictEqual(
    vs.numericString({checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.LUHN}).applyTo("4111111111111111"),
    "4111111111111111");
assert.strictEqual(
    vs.numericString({checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD}).applyTo("4111111111111111"), // alias of LUHN
    "4111111111111111");
assert.strictEqual(
    vs.numericString({checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.MODULUS10_WEIGHT3_1}).applyTo("9784101092058"),
    "9784101092058");
assert.strictEqual(
    vs.numericString({checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13}).applyTo("9784101092058"), // alias of MODULUS10_WEIGHT3_1
    "9784101092058");
assert.strictEqual(
    vs.numericString({checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.EAN}).applyTo("9784101092058"), // alias of MODULUS10_WEIGHT3_1
    "9784101092058");
assert.strictEqual(
    vs.numericString({checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.JAN}).applyTo("9784101092058"), // alias of MODULUS10_WEIGHT3_1
    "9784101092058");

// should cause error
assert.throws(
    () => vs.numericString({checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.LUHN}).applyTo("4111111111111112"),
    {name: "ValueSchemaError", cause: vs.CAUSE.CHECKSUM});
```

### email

#### ambient declarations

```typescript
type OptionsForEmail = {
    ifUndefined?: string | null;
    ifEmptyString?: string | null;
    ifNull?: string | null;

    trims?: boolean;
    pattern?: RegExp;
}
function email(options?: OptionsForEmail): EmailSchema;

type ErrorHandler = (err: ValueSchemaError) => string | null | never;
interface EmailSchema {
    applyTo(value: unknown, onError?: ErrorHandler): string | null
}
```

#### `applyTo(value[, onError])`

Apply schema to `value`.

If an error occurs, this method calls `onError` (if specified) or throw `ValueSchemaError` (otherwise).

```javascript
// should be OK
assert.strictEqual(
    vs.email().applyTo("user+mailbox/department=shipping@example.com"),
    "user+mailbox/department=shipping@example.com"); // dot-string
assert.strictEqual(
    vs.email().applyTo("!#$%&'*+-/=?^_`.{|}~@example.com"),
    "!#$%&'*+-/=?^_`.{|}~@example.com"); // dot-string
assert.strictEqual(
    vs.email().applyTo("\"Fred\\\"Bloggs\"@example.com"),
    "\"Fred\\\"Bloggs\"@example.com"); // quoted-string
assert.strictEqual(
    vs.email().applyTo("\"Joe.\\\\Blow\"@example.com"),
    "\"Joe.\\\\Blow\"@example.com"); // quoted-string
assert.strictEqual(
    vs.email().applyTo("user@example-domain.com"),
    "user@example-domain.com");
assert.strictEqual(
    vs.email().applyTo("user@example2.com"),
    "user@example2.com");

// should cause error
assert.throws(
    () => vs.email().applyTo("@example.com"),
    {name: "ValueSchemaError", cause: vs.CAUSE.PATTERN});
assert.throws(
    () => vs.email().applyTo(".a@example.com"),
    {name: "ValueSchemaError", cause: vs.CAUSE.PATTERN});
assert.throws(
    () => vs.email().applyTo("a.@example.com"),
    {name: "ValueSchemaError", cause: vs.CAUSE.PATTERN});
assert.throws(
    () => vs.email().applyTo("a..a@example.com"),
    {name: "ValueSchemaError", cause: vs.CAUSE.PATTERN});
assert.throws(
    () => vs.email().applyTo("user@example@com"),
    {name: "ValueSchemaError", cause: vs.CAUSE.PATTERN});
assert.throws(
    () => vs.email().applyTo("user-example-com"),
    {name: "ValueSchemaError", cause: vs.CAUSE.PATTERN});
assert.throws(
    () => vs.email().applyTo("user@example_domain.com"),
    {name: "ValueSchemaError", cause: vs.CAUSE.PATTERN});
assert.throws(
    () => vs.email().applyTo("user@example.com2"),
    {name: "ValueSchemaError", cause: vs.CAUSE.PATTERN});
```

#### options

##### `ifUndefined`

Specifies return value when input value is `undefined`.

If this option is omitted, `applyTo(undefined)` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.email({ifUndefined: "user@example.com"}).applyTo(undefined),
    "user@example.com");

// should cause error
assert.throws(
    () => vs.email().applyTo(undefined),
    {name: "ValueSchemaError", cause: vs.CAUSE.UNDEFINED});
```

##### `ifNull`

Specifies return value when input value is `null`.

If this option is omitted, `applyTo(null)` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.email({ifNull: "user@example.com"}).applyTo(null),
    "user@example.com");

// should cause error
assert.throws(
    () => vs.email().applyTo(null),
    {name: "ValueSchemaError", cause: vs.CAUSE.NULL});
```

##### `ifEmptyString`

Specifies return value when input value is `""`.

If this option is omitted, `applyTo(null)` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.email({ifEmptyString: "user@example.com"}).applyTo(""),
    "user@example.com");

// should cause error
assert.throws(
    () => vs.email().applyTo(""),
    {name: "ValueSchemaError", cause: vs.CAUSE.EMPTY_STRING});
```

##### `trims`

Removes whitespace from both ends of input.
**defaults: false**

```javascript
// should be adjusted
assert.strictEqual(
    vs.email({trims: true}).applyTo("\r\n user@example.com \t "),
    "user@example.com");

// should cause error
assert.throws(
    () => vs.email().applyTo("\r\n user@example.com1 \t "),
    {name: "ValueSchemaError", cause: vs.CAUSE.PATTERN});
assert.throws(
    () => vs.email({trims: true}).applyTo(" \t\r\n "),
    {name: "ValueSchemaError", cause: vs.CAUSE.EMPTY_STRING});
```

##### `pattern`

Specifies acceptable pattern by regular expression.

```javascript
// should be OK
assert.strictEqual(
    vs.email({pattern: /^[\w\.]+@([\w\-]+\.)+\w+$/}).applyTo("......@example.com"), // accept leading/trailing/consecutively dots
    "......@example.com");

// should cause errors
assert.throws(
    () => vs.email().applyTo("......@example.com"),
    {name: "ValueSchemaError", cause: vs.CAUSE.PATTERN});
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
