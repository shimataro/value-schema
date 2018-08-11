node-adjuster
===

[![Build Status (Windows)][image-build-windows]][link-build-windows]
[![Build Status (macOS)][image-build-macos]][link-build-macos]
[![Build Status (Linux)][image-build-linux]][link-build-linux]
[![Release][image-release]][link-release]
[![Node.js version][image-engine]][link-engine]
[![License][image-license]][link-license]

validate and adjust input values

## Table of Contents

* [Introduction](#introduction)
* [Install](#install)
* [Loading](#loading)
* [Reference](#reference)
    * [types and constants](#types-and-constants)
    * [basic usage](#basic-usage)
    * [number](#number)
    * [number array](#number-array)
    * [string](#string)
    * [string array](#string-array)
    * [numeric string](#numeric-string)
    * [IPv4](#ipv4)
    * [IPv6](#ipv6)
    * [email](#email)
* [Changelog](#changelog)

---

## Introduction

All of web applications need handling input parameters, consists of following steps:
* fill default values
* cast types
* validate values
* ...and revise them if needed

`node-adjuster` does all of them, by compact and highly readable code!

### example

```javascript
import adjuster from "adjuster";
import assert from "assert";

const constraints = { // constraints for input
    id: adjuster.number().minValue(1), // number, >=1
    name: adjuster.string().maxLength(16, true), // string, max 16 characters (trims if over)
    age: adjuster.number().integer(true).minValue(0), // number, integer (trims if decimal), >=0
    email: adjuster.email(), // e-mail
    state: adjuster.string().only("active", "inactive"), // string, accepts only "active" and "inactive"
    classes: adjuster.numberArray().separatedBy(",").ignoreEachErrors(), // array of number, separated by ",", ignores errors
    skills: adjuster.stringArray().separatedBy(",").ignoreEachErrors(), // array of string, separated by ",", ignores errors
    credit_card: adjuster.numericString().separatedBy("-").checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.CREDIT_CARD), // numeric string, separated by "-", checks by Luhn algorithm
    remote_addr: adjuster.ipv4(), // IPv4
    remote_addr_ipv6: adjuster.ipv6(), // IPv6
    limit: adjuster.number().integer().default(10).minValue(1, true).maxValue(100, true), // number, integer, omittable (sets 10 if omitted), >=1 (sets 1 if less), <=100 (sets 100 if greater)
    offset: adjuster.number().integer().default(0).minValue(0, true), // number, integer, omiitable (sets 0 if omited), >=0 (sets 0 if less)
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
const expected = { // should be adjusted to this
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

// Let's adjust!
const adjusted = adjuster.adjust(input, constraints);

// verification
assert.deepStrictEqual(adjusted, expected);
```

That's all! No control flows! Isn't it cool?

For details, see [basic usage](#basic-usage).

## Install

install from [npm registry](https://www.npmjs.com/package/adjuster).
```bash
npm install -S adjuster
```

NOTE: package name is `adjuster`, NOT `node-adjuster`!

## Loading

### using [Babel](https://babeljs.io/)

```javascript
import adjuster from "adjuster";
```

### CommonJS

```javascript
var adjuster = require("adjuster").default;
```
or
```javascript
var {default: adjuster} = require("adjuster");
```

### ES Modules
```javascript
// foo.mjs - in the same way as Babel!
import adjuster from "adjuster";
```

## Reference
### types and constants
#### `AdjusterError`
The `AdjusterError` object represents an error when trying to adjust invalid value.

##### properties

|name|description|
|----|-----------|
|`name`|`"AdjusterError"`|
|`message`|human-readable description of the error, including a string `cause`|
|`cause`|the cause of adjustment error; see `adjuster.CAUSE`|
|`value`|the value to adjust|
|`key`|key name that caused error; only filled in `adjuster.adjust()`, otherwise `null`|

#### `adjuster.CAUSE`
The cause of adjustment error.

For more information, see below examples.

#### `adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM`
Checksum algorithms for `adjuster.numericString().checksum()`.

For more information, see [numeric string](#numeric-string).

#### `adjuster.STRING_PATTERN`
Regular expressions for `adjuster.string().pattern()`.

For more information, see [string](#string).

### basic usage
#### ambient declarations

```typescript
namespace adjuster {
    export declare function adjust(data: Object, constraints: Object, onError?: (err: AdjusterError|null) => any): Object;
}
```

#### `adjuster.adjust(data, constraints[, onError])`
Validate and adjust a input value.

##### `data`
An object to adjust; e.g. `req.query`, `req.body` (in [Express](http://expressjs.com/))

This `data` is not overwritten.

##### `constraints`
Constraints object for adjustment.

* key: the name of `data` to adjust value
* value: the adjustment object; see below examples

##### `onError(err)`
Callback function for each errors.
If no errors, this function will not be called.

If this parameter is omitted, `adjuster.adjust()` throws `AdjusterError` on first error and remaining adjustment process will be cancelled.

* `err`
    * an instance of `AdjusterError` or `null`
    * `err.key` indicates a key name that caused error
    * `err` will be `null` after all adjustment has finished and errors has occurred
        * `onError()` will no longer be called after `null` passed
* returns
    * an adjuted value
    * `undefined` means this key will not be included in returned object from `adjuster.adjust()`
    * return value of `onError(null)` is ignored
* throws
    * an exception that will thrown from `adjuster.adjust()`
    * remaining adjustment processes will be cancelled

##### examples

###### successful
For more information, see below references about [`adjuster.number()`](#number), [`adjuster.string()`](#string), and so on.

```javascript
import adjuster from "adjuster";
import assert from "assert";

const constraints = {
    id: adjuster.number().minValue(1),
    name: adjuster.string().maxLength(16, true),
    age: adjuster.number().integer(true).minValue(0),
    email: adjuster.email(),
    state: adjuster.string().only("active", "inactive"),
    classes: adjuster.numberArray().separatedBy(",").ignoreEachErrors(),
    skills: adjuster.stringArray().separatedBy(",").ignoreEachErrors(),
    credit_card: adjuster.numericString().separatedBy("-").checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.CREDIT_CARD),
    remote_addr: adjuster.ipv4(),
    remote_addr_ipv6: adjuster.ipv6(),
    limit: adjuster.number().integer().default(10).minValue(1, true).maxValue(100, true),
    offset: adjuster.number().integer().default(0).minValue(0, true),
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

const adjusted = adjuster.adjust(input, constraints);
assert.deepStrictEqual(adjusted, expected);
```

###### error handling 1
adjust errors

```javascript
import adjuster from "adjuster";
import assert from "assert";

const constraints = {
    id: adjuster.number().minValue(1),
    name: adjuster.string().maxLength(16, true),
    email: adjuster.email(),
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

const adjusted = adjuster.adjust(input, constraints, generateErrorHandler());
assert.deepStrictEqual(adjusted, expected);

function generateErrorHandler() {
    return (err) => {
        if (err === null) {
            // adjustment finished
            return;
        }

        if (err.key === "id") {
            // adjust to 100 on `id` error
            return 100;
        }
        // remove otherwise
    };
}
```

###### error handling 2
throw exception after finished

```javascript
import adjuster from "adjuster";
import assert from "assert";

const constraints = {
    id: adjuster.number().minValue(1),
    name: adjuster.string().maxLength(16, true),
    email: adjuster.email(),
};
const input = {
    id: 0, // error! (>= 1)
    name: "", // error! (empty string is not allowed)
    email: "john@example.com", // OK
};

try {
    adjuster.adjust(input, constraints, generateErrorHandler());
}
catch (err) {
    // do something
    assert.strictEqual(err.message, "id,name");
}

function generateErrorHandler() {
    const messages = [];
    return (err) => {
        if (err === null) {
            // adjustment finished; join key name as message
            throw new Error(messages.join(","));
        }

        // append key name
        messages.push(err.key);
    };
}
```

###### error handling 3
catch a first error by omitting error handler

```javascript
import adjuster from "adjuster";
import assert from "assert";

const constraints = {
    id: adjuster.number().minValue(1),
    name: adjuster.string().maxLength(16, true),
    email: adjuster.email(),
};
const input = {
    id: 0, // error! (>= 1)
    name: "", // error! (empty string is not allowed)
    email: "john@example.com", // OK
};

try {
    const adjusted = adjuster.adjust(input, constraints);
}
catch (err) {
    // catch a first error
    assert.strictEqual(err.key, "id");
}
```

###### error handling 4
when input value is not an object

NOTE: `constraint` won't be checked because it's predictable; should be generated by programmer, not an external input

```javascript
import adjuster from "adjuster";
import assert from "assert";

const constraints = {};
const input = 123;

try {
    // `input` must be an object
    const adjusted = adjuster.adjust(input, constraints);
}
catch (err) {
    assert.strictEqual(err.key, null);
    assert.strictEqual(err.cause, adjuster.CAUSE.NOT_OBJECT);
}
```

### number
#### ambient declarations

```typescript
namespace adjuster {
    export declare function number(): NumberAdjuster;
}

interface NumberAdjuster {
    // adjustment method
    adjust(value: any, onError?: (err: AdjusterError) => number|void): number;

    // feature methods (chainable)
    strict(): NumberAdjuster;
    default(value: number): NumberAdjuster;
    acceptNull(value?: number|null /* = null */): NumberAdjuster;
    acceptEmptyString(value?: number|null /* = null */): NumberAdjuster;
    acceptSpecialFormats(): NumberAdjuster;
    integer(adjust?: boolean /* = false */): NumberAdjuster;
    only(...values: number[]): NumberAdjuster;
    minValue(value: number, adjust?: boolean /* = false */): NumberAdjuster;
    maxValue(value: number, adjust?: boolean /* = false */): NumberAdjuster;
}
```

#### `adjust(value[, onError])`
Validate and adjust a input value.

If an error occurs, call `onError` (if specified) or throw `AdjusterError` (otherwise)

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.number().adjust(-123),
    -123);

// should be adjusted
assert.strictEqual(
    adjuster.number().adjust("-123"),
    -123);
assert.strictEqual(
    adjuster.number().adjust(true),
    1);
assert.strictEqual(
    adjuster.number().adjust(false),
    0);

// should cause error
assert.strictEqual( // catch error by callback function (that returns a value from adjust() method)
    adjuster.number().adjust(
        "abc",
        (err) => 10),
    10);
assert.throws( // ... or try-catch syntax
    () => adjuster.number().adjust("abc"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
assert.throws(
    () => adjuster.number().adjust("true"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
```

#### `strict()`
Enable strict type check.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.number().adjust("123"),
    123);
assert.strictEqual(
    adjuster.number().adjust(true),
    1);

// should cause error
assert.throws(
    () => adjuster.number().strict().adjust("123"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
assert.throws(
    () => adjuster.number().strict().adjust(true),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
```

#### `default(value)`
Accept `undefined` for input, and adjust to `value`.

If this method is not called, `adjust(undefined)` causes `AdjusterError`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.number().default(1).adjust(undefined),
    1);

// should cause error
assert.throws(
    () => adjuster.number().adjust(undefined),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.REQUIRED));
```

#### `acceptNull([value])`
Accept a `null` for input, and adjust to `value`.

If this method is not called, `adjust(null)` causes `AdjusterError`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.number().acceptNull(1).adjust(null),
    1);

// should cause error
assert.throws(
    () => adjuster.number().adjust(null),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NULL));
```

#### `acceptEmptyString([value])`
Accept an empty string(`""`) for input, and adjust to `value`.

If this method is not called, `adjust("")` causes `AdjusterError`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.number().acceptEmptyString(1).adjust(""),
    1);

// should cause error
assert.throws(
    () => adjuster.number().adjust(""),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
```

#### `acceptSpecialFormats()`
Accept all special number formats; i.e., `"1e+2"`, `"0x100"`, `"0o100"`, `"0b100"`.

If this method is not called, the above examples causes `AdjusterError`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.number().acceptSpecialFormats().adjust("1e+2"),
    100);
assert.strictEqual(
    adjuster.number().acceptSpecialFormats().adjust("0x100"),
    256);
assert.strictEqual(
    adjuster.number().acceptSpecialFormats().adjust("0o100"),
    64);
assert.strictEqual(
    adjuster.number().acceptSpecialFormats().adjust("0b100"),
    4);

// should cause error
assert.throws(
    () => adjuster.number().adjust("1e+2"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));

```

#### `integer([adjust])`
Limit an input value to integer.

If `adjust` is true, value will be adjusted to an integer.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.number().integer(true).adjust(3.14),
    3);
assert.strictEqual(
    adjuster.number().integer(true).adjust("3.14"),
    3);
assert.strictEqual(
    adjuster.number().integer(true).adjust(-3.14),
    -3);
assert.strictEqual(
    adjuster.number().integer(true).adjust("-3.14"),
    -3);

// should cause error
assert.throws(
    () => adjuster.number().integer().adjust(3.14),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
assert.throws(
    () => adjuster.number().integer().adjust("3.14"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
assert.throws(
    () => adjuster.number().integer().adjust("3."),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
```

#### `only(...values)`
Accept only `values`.

If input value is not in `values`, `adjust()` method causes `AdjusterError`.

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.number().only(1, 3, 5).adjust(1),
    1);

// should cause error
assert.throws(
    () => adjuster.number().only(1, 3, 5).adjust(2),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.ONLY));
```

#### `minValue(value[, adjust])`
Limit minimum value to `value`.

If input value is less than `value`, `adjust()` method returns `value` (if `adjust` is truthy) or causes `AdjusterError` (falsy; default).

By default, `value` equals `Number.MIN_SAFE_INTEGER`.

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.number().adjust(Number.MIN_SAFE_INTEGER),
    Number.MIN_SAFE_INTEGER);
assert.strictEqual(
    adjuster.number().minValue(1).adjust(1),
    1);

// should be adjusted
assert.strictEqual(
    adjuster.number().minValue(1, true).adjust(0),
    1);

// should cause errors
assert.throws(
    () => adjuster.number().adjust(Number.MIN_SAFE_INTEGER - 1),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MIN_VALUE));
assert.throws(
    () => adjuster.number().minValue(1).adjust(0),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MIN_VALUE));
```

#### `maxValue(value[, adjust])`
Limit maximum value to `value`.

If input value is greater than `value`, `adjust()` method returns `value` (if `adjust` is truthy) or causes `AdjusterError` (falsy; default).

By default, `value` equals `Number.MAX_SAFE_INTEGER`.

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.number().adjust(Number.MAX_SAFE_INTEGER),
    Number.MAX_SAFE_INTEGER);
assert.strictEqual(
    adjuster.number().maxValue(1).adjust(1),
    1);

// should be adjusted
assert.strictEqual(
    adjuster.number().maxValue(100, true).adjust(101),
    100);

// should cause errors
assert.throws(
    () => adjuster.number().adjust(Number.MAX_SAFE_INTEGER + 1),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MAX_VALUE));
assert.throws(
    () => adjuster.number().maxValue(100).adjust(101),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MAX_VALUE));
```

### number array
#### ambient declarations

```typescript
namespace adjuster {
    export declare function numberArray(): NumberArrayAdjuster;
}

interface NumberArrayAdjuster {
    // adjustment method
    adjust(value: any, onError?: (err: AdjusterError) => number[]|void): number[];

    // feature methods (chainable)
    default(value: number[]): NumberArrayAdjuster;
    acceptNull(value?: number[]|null /* = null */): NumberArrayAdjuster;
    acceptEmptyString(value: number[]|null /* = null */): NumberArrayAdjuster;
    separatedBy(separator: string|RegExp): NumberArrayAdjuster;
    toArray(): NumberArrayAdjuster;
    minLength(length: number): NumberArrayAdjuster;
    maxLength(length: number, adjust?: boolean /* = false */): NumberArrayAdjuster;
    ignoreEachErrors(): NumberArrayAdjuster;
    eachDefault(value: number): NumberArrayAdjuster;
    eachAcceptNull(value?: number|null /* = null */): NumberArrayAdjuster;
    eachAcceptEmptyString(value?: number|null /* = null */): NumberArrayAdjuster;
    eachAcceptSpecialFormats(): NumberArrayAdjuster;
    eachInteger(adjust?: boolean /* = false */): NumberArrayAdjuster;
    eachOnly(...values: number[]): NumberArrayAdjuster;
    eachMinValue(value: number, adjust?: boolean /* = false */): NumberArrayAdjuster;
    eachMaxValue(value: number, adjust?: boolean /* = false */): NumberArrayAdjuster;
}
```

#### `adjust(value[, onError])`
Validate and adjust input values.

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.numberArray().adjust([1, 2, 3]),
    [1, 2, 3]);

// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().adjust([1, "-2", "+3"]),
    [1, -2, 3]);

// should cause error
assert.throws(
    () => adjuster.numberArray().adjust("abc"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
assert.throws(
    () => adjuster.numberArray().adjust(0),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
```

#### `default(value)`
Accept `undefined` for input, and adjust to `value`.

If this method is not called, `adjust(undefined)` causes `AdjusterError`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().default([1, 2]).adjust(undefined),
    [1, 2]);

// should cause error
assert.throws(
    () => adjuster.numberArray().adjust(undefined),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.REQUIRED));
```

#### `acceptNull([value])`
Accept a `null` for input, and adjust to `value`.

If this method is not called, `adjust(null)` causes `AdjusterError`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().acceptNull([1, 2, 3]).adjust(null),
    [1, 2, 3]);

// should cause error
assert.throws(
    () => adjuster.numberArray().adjust(null),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NULL));
```

#### `acceptEmptyString([value])`
Accept an empty string(`""`) for input, and adjust to `value`.

If this method is not called, `adjust("")` causes `AdjusterError`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().acceptEmptyString([1, 2]).adjust(""),
    [1, 2]);

// should cause error
assert.throws(
    () => adjuster.numberArray().adjust(""),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
```

#### `separatedBy(separator)`
Assume an input value is string and separated by `separator`.

If an input type is array, this method does nothing.

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.numberArray().separatedBy(",").adjust([1, 2, 3]),
    [1, 2, 3]);

// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().separatedBy(",").adjust("1,2,3"),
    [1, 2, 3]);

// should cause error
assert.throws(
    () => adjuster.numberArray().adjust("1,2,3"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
```

#### `toArray()`
Convert an input value to array if not.

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.numberArray().toArray().adjust([0]),
    [0]);

// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().toArray().adjust(0),
    [0]);

// should cause error
assert.throws(
    () => adjuster.numberArray().adjust(0),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
```

#### `minLength(length)`
Limit minimum length of input array to `length`.

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.numberArray().minLength(2).adjust([1, 2]),
    [1, 2]);

// should cause errors
assert.throws(
    () => adjuster.numberArray().minLength(2).adjust([1]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MIN_LENGTH));
```

#### `maxLength(length[, adjust])`
Limit maximum length of an input array to `length`.

If array length is greater than `length`, `adjust()` method truncates the length to `length` (if `adjust` is truthy) or causes `AdjusterError` (falsy; default).

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.numberArray().maxLength(2).adjust([1, 2]),
    [1, 2]);

// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().maxLength(2, true).adjust([1, 2, 3]),
    [1, 2]);

// should cause error
assert.throws(
    () => adjuster.numberArray().maxLength(2).adjust([1, 2, 3]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MAX_LENGTH));
```

#### `ignoreEachErrors()`
Ignore the errors of each element.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().ignoreEachErrors().adjust([1, "abc", 2]),
    [1, 2]);

// should cause error
assert.throws(
    () => adjuster.numberArray().adjust([1, "abc", 2]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_TYPE));
```

#### `eachDefault(value)`
Accept `undefined` for each elements of input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().eachDefault(2).adjust([1, undefined, 3]),
    [1, 2, 3]);

// should cause error
assert.throws(
    () => adjuster.numberArray().adjust([1, undefined, 3]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_REQUIRED));
```

#### `eachAcceptNull([value])`
Accept a `null` for each elements of input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().eachAcceptNull(2).adjust([1, null, 3]),
    [1, 2, 3]);

// should cause error
assert.throws(
    () => adjuster.numberArray().adjust([1, null, 3]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_NULL));
```

#### `eachAcceptEmptyString([value])`
Accept an empty string(`""`) for each elements of input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().eachAcceptEmptyString(2).adjust([1, "", 3]),
    [1, 2, 3]);

// should cause eerror
assert.throws(
    () => adjuster.numberArray().adjust([""]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_EMPTY));
```

#### `eachAcceptSpecialFormats()`
Accept all special number formats for each elements of input.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().eachAcceptSpecialFormats().adjust(["1e+2", "0x100", "0o100", "0b100"]),
    [100, 256, 64, 4]);

// should cause eerror
assert.throws(
    () => adjuster.numberArray().adjust(["1e+2", "0x100", "0o100", "0b100"]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_TYPE));
```

#### `eachOnly(...values)`
Accept only `values` for each elements of input.

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.numberArray().eachOnly(1, 2, 3).adjust([1, 2]),
    [1, 2]);

// should cause error
assert.throws(
    () => adjuster.numberArray().eachOnly(1, 2, 3).adjust([0, 1]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_ONLY));
```

#### `eachMinValue(value[, adjust])`
Limit minimum value to `value` for each elements of input.

If the element is less than `value`, it will be adjusted to `value` (if `adjust` is truthy) or cause `AdjusterError` (falsy; default).

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.numberArray().eachMinValue(10).adjust([10, 11, 12]),
    [10, 11, 12]);

// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().ignoreEachErrors().eachMinValue(10).adjust([9, 10, 11]),
    [10, 11]);
assert.deepStrictEqual(
    adjuster.numberArray().eachMinValue(10, true).adjust([9, 10, 11]),
    [10, 10, 11]);

// should cause errors
assert.throws(
    () => adjuster.numberArray().eachMinValue(10).adjust([9, 10, 11]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_MIN_VALUE));
```

#### `eachMaxValue(value[, adjust])`
Limit maximum value to `value` for each elements of input.

If the element is greater than `value`, it will be adjusted to `value` (if `adjust` is truthy) or cause `AdjusterError` (falsy; default).

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.numberArray().eachMaxValue(10).adjust([8, 9, 10]),
    [8, 9, 10]);

// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().ignoreEachErrors().eachMaxValue(10).adjust([9, 10, 11]),
    [9, 10]);
assert.deepStrictEqual(
    adjuster.numberArray().eachMaxValue(10, true).adjust([9, 10, 11]),
    [9, 10, 10]);

// should cause errors
assert.throws(
    () => adjuster.numberArray().eachMaxValue(10).adjust([9, 10, 11]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_MAX_VALUE));
```

### string
#### ambient declarations

```typescript
namespace adjuster {
    export declare function string(): StringAdjuster;
}

interface StringAdjuster {
    // adjustment method
    adjust(value: any, onError?: (err: AdjusterError) => string|void): string;

    // feature methods (chainable)
    default(value: string): StringAdjuster;
    acceptNull(value?: string|null /* = null */): StringAdjuster;
    acceptEmptyString(value?: string|null /* = null */): StringAdjuster;
    trim(): StringAdjuster;
    only(...values: string[]): StringAdjuster;
    minLength(length: number): StringAdjuster;
    maxLength(length: number, adjust?: boolean /* = false */): StringAdjuster;
    pattern(pattern: string|RegExp): StringAdjuster;
}
```

#### `adjust(value[, onError])`
Validate and adjust a input value.

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.string().adjust("123"),
    "123");

// should be adjusted
assert.strictEqual(
    adjuster.string().adjust(123),
    "123");
```

#### `default(value)`
Accept `undefined` for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.string().default("xyz").adjust(undefined),
    "xyz");

// should cause error
assert.throws(
    () => adjuster.string().adjust(undefined),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.REQUIRED));
```

#### `acceptNull([value])`
Accept a `null` for input, and adjust to `value`.

If this method is not called, `adjust(null)` causes `AdjusterError`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.string().acceptNull("x").adjust(null),
    "x");

// should cause error
assert.throws(
    () => adjuster.string().adjust(null),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NULL));
```

#### `acceptEmptyString([value])`
Accept an empty string(`""`) for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.string().acceptEmptyString("xyz").adjust(""),
    "xyz");

// should cause error
assert.throws(
    () => adjuster.string().adjust(""),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
```


#### `trim()`
Remove whitespace from both ends of input.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.string().trim().adjust("\r\n hell, word \t "),
    "hell, word");

// should cause error
assert.throws(
    () => adjuster.string().trim().adjust(" \t\r\n "),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
```

#### `only(...values)`
Accept only `values`.

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.string().only("eat", "sleep", "play").adjust("sleep"),
    "sleep");
assert.strictEqual(
    adjuster.string().only("").adjust(""),
    "");

// should cause error
assert.throws(
    () => adjuster.string().only("eat", "sleep", "play").adjust("study"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.ONLY));
```

#### `minLength(length)`
Limit minimum length of input string to `length`.

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.string().minLength(5).adjust("abcde"),
    "abcde");

// should cause error
assert.throws(
    () => adjuster.string().minLength(5).adjust("a"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MIN_LENGTH));
```

#### `maxLength(length[, adjust])`
Limit maximum length of an input string to `length`.

If string length is greater than `length`, `adjust()` method truncates the length to `length` (if `adjust` is truthy) or causes `AdjusterError` (falsy; default).

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.string().maxLength(5).adjust("abcde"),
    "abcde");

// should be adjusted
assert.strictEqual(
    adjuster.string().maxLength(5, true).adjust("abcdefg"),
    "abcde");

// should cause error
assert.throws(
    () => adjuster.string().maxLength(5).adjust("abcdefg"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MAX_LENGTH));
```

#### `pattern(pattern)`
Specify acceptable pattern by regular expression.

You can also use `adjuster.STRING_PATTERN` constants

|constant|explanation|
|--------|-----------|
|`adjuster.STRING_PATTERN.URI`|URI that follows [RFC3986](https://tools.ietf.org/html/rfc3986)|

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.string().pattern(/^Go+gle$/).adjust("Gogle"),
    "Gogle");
assert.deepStrictEqual(
    adjuster.string().pattern("^Go+gle$").adjust("Google"),
    "Google");
assert.deepStrictEqual(
    adjuster.string().pattern(adjuster.STRING_PATTERN.URI).adjust("https://example.com/path/to/resource?name=value#hash"),
    "https://example.com/path/to/resource?name=value#hash");


// should cause error
assert.throws(
    () => adjuster.string().pattern(/^Go+gle$/).adjust("Ggle"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(
    () => adjuster.string().pattern(adjuster.STRING_PATTERN.URI).adjust("https://例.com/"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
```


### string array
#### ambient declarations

```typescript
namespace adjuster {
    export declare function stringArray(): StringArrayAdjuster;
}

interface StringArrayAdjuster {
    // adjustment method
    adjust(value: any, onError?: (err: AdjusterError) => string[]|void): string[];

    // feature methods (chainable)
    default(value: string[]): StringArrayAdjuster;
    acceptNull(value?: string[]|null /* = null */): StringArrayAdjuster;
    acceptEmptyString(value: string[]|null /* = null */): StringArrayAdjuster;
    separatedBy(separator: string|RegExp): StringArrayAdjuster;
    toArray(): StringArrayAdjuster;
    minLength(length: number): StringArrayAdjuster;
    maxLength(length: number, adjust?: boolean /* = false */): StringArrayAdjuster;
    ignoreEachErrors(): StringArrayAdjuster;
    eachDefault(value: string): StringArrayAdjuster;
    eachAcceptNull(value?: string|null /* = null */): StringArrayAdjuster;
    eachAcceptEmptyString(value?: string|null /* = null */): StringArrayAdjuster;
    eachTrim(): StringArrayAdjuster;
    eachOnly(...values: string[]): StringArrayAdjuster;
    eachMinLength(length: number): StringArrayAdjuster;
    eachMaxLength(length: number, adjust?: boolean /* = false */): StringArrayAdjuster;
    eachPattern(pattern: string|RegExp): StringArrayAdjuster;
}
```

#### `adjust(value[, onError])`
Validate and adjust input values.

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.stringArray().adjust(["a", "b"]),
    ["a", "b"]);

// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().adjust(["a", 1, -2]),
    ["a", "1", "-2"]);

// should cause errors
assert.throws(
    () => adjuster.stringArray().adjust("abc"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
```

#### `default(value)`
Accept `undefined` for input, and adjust to `value`.

If this method is not called, `adjust(undefined)` causes `AdjusterError`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().default(["a", "b"]).adjust(undefined),
    ["a", "b"]);

// should cause errors
assert.throws(
    () => adjuster.stringArray().adjust(undefined),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.REQUIRED));
```

#### `acceptNull([value])`
Accept a `null` for input, and adjust to `value`.

If this method is not called, `adjust(null)` causes `AdjusterError`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().acceptNull(["a", "b"]).adjust(null),
    ["a", "b"]);

// should cause error
assert.throws(
    () => adjuster.stringArray().adjust(null),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NULL));
```

#### `acceptEmptyString([value])`
Accept an empty string(`""`) for input, and adjust to `value`.

If this method is not called, `adjust("")` causes `AdjusterError`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().acceptEmptyString(["a", "b"]).adjust(""),
    ["a", "b"]);

// should cause errors
assert.throws(
    () => adjuster.stringArray().adjust(""),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
```

#### `separatedBy(separator)`
Assume an input value is string and separated by `separator`.

If an input type is array, this method does nothing.

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.stringArray().separatedBy(",").adjust(["a", "b", "c"]),
    ["a", "b", "c"]);

// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().separatedBy(",").adjust("a,b,c"),
    ["a", "b", "c"]);

// should cause errors
assert.throws(
    () => adjuster.stringArray().adjust("a,b,c"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
```

#### `toArray()`
Convert an input value to array if not.

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.stringArray().toArray().adjust(["a"]),
    ["a"]);

// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().toArray().adjust("a"),
    ["a"]);

// should cause errors
assert.throws(
    () => adjuster.stringArray().adjust("a"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
```

#### `minLength(length)`
Limit minimum length of input array to `length`.

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.stringArray().minLength(1).adjust(["a"]),
    ["a"]);

// should cause errors
assert.throws(
    () => adjuster.stringArray().minLength(1).adjust([]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MIN_LENGTH));
```

#### `maxLength(length[, adjust])`
Limit maximum length of an input array to `length`.

If array length is greater than `length`, `adjust()` method truncates the length to `length` (if `adjust` is truthy) or causes `AdjusterError` (falsy; default).

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.stringArray().maxLength(2).adjust(["a"]),
    ["a"]);

// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().maxLength(1, true).adjust(["a", "b"]),
    ["a"]);

// should cause errors
assert.throws(
    () => adjuster.stringArray().maxLength(1).adjust(["a", "b"]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MAX_LENGTH));
```

#### `ignoreEachErrors()`
Ignore the errors of each element.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().ignoreEachErrors().adjust(["a", "", 1]),
    ["a", "1"]);

// should cause errors
assert.throws(
    () => adjuster.stringArray().adjust(["a", "", 1]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_EMPTY));
```

#### `eachDefault(value)`
Accept `undefined` for each elements of input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().eachDefault("z").adjust(["a", undefined, "b"]),
    ["a", "z", "b"]);

// should cause errors
assert.throws(
    () => adjuster.stringArray().adjust(["a", undefined, "b"]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_REQUIRED));
```

#### `eachAcceptNull([value])`
Accept a `null` for each elements of input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().eachAcceptNull("z").adjust(["a", null, "b"]),
    ["a", "z", "b"]);

// should cause error
assert.throws(
    () => adjuster.stringArray().adjust(["a", null, "b"]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_NULL));
```

#### `eachAcceptEmptyString([value])`
Accept an empty string(`""`) for each elements of input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().eachAcceptEmptyString("z").adjust(["a", "", "b"]),
    ["a", "z", "b"]);

// should cause errors
assert.throws(
    () => adjuster.stringArray().adjust([""]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_EMPTY));
```

#### `eachTrim()`
Remove whitespace from both ends of each elements of input.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().eachTrim().adjust([" a", "b\t", "\rc\n"]),
    ["a", "b", "c"]);
```

#### `eachOnly(...values)`
Accept only `values` for each elements of input.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().eachOnly("a", "b").adjust(["a"]),
    ["a"]);

// should cause errors
assert.throws(
    () => adjuster.stringArray().eachOnly("a", "b").adjust(["x"]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_ONLY));
```

#### `eachMinLength(length[, adjust])`
Limit minimum string length to `length` for each elements of input.

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.stringArray().eachMinLength(3).adjust(["abc", "xyz"]),
    ["abc", "xyz"]);

// should cause errors
assert.throws(
    () => adjuster.stringArray().eachMinLength(3).adjust(["ab"]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_MIN_LENGTH));
```

#### `eachMaxLength(length[, adjust])`
Limit maximum string length to `length` for each elements of input.

If the length is greater than `length`, it will be adjusted to `value` (if `adjust` is truthy) or cause `AdjusterError` (falsy; default).

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.stringArray().eachMaxLength(3).adjust(["abc", "xyz"]),
    ["abc", "xyz"]);

// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().eachMaxLength(3, true).adjust(["abcd", "xyz0"]),
    ["abc", "xyz"]);

// should cause errors
assert.throws(
    () => adjuster.stringArray().eachMaxLength(3).adjust(["abcd"]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_MAX_LENGTH));
```

#### `eachPattern(pattern)`
Specify acceptable pattern for each elements of input by regular expression.

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.stringArray().eachPattern(/^Go+gle$/).adjust(["Google"]),
    ["Google"]);

// should cause errors
assert.throws(
    () => adjuster.stringArray().eachPattern(/^Go+gle$/).adjust(["Ggle"]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_PATTERN));
```

### numeric string
#### ambient declarations

```typescript
namespace adjuster {
    export declare function numericString(): NumericStringAdjuster;
}

interface NumericStringAdjuster {
    // adjustment method
    adjust(value: any, onError?: (err: AdjusterError) => string|void): string;

    // feature methods (chainable)
    default(value: string): NumericStringAdjuster;
    acceptNull(value?: string|null /* = null */): NumericStringAdjuster;
    acceptEmptyString(value?: string|null /* = null */): NumericStringAdjuster;
    joinArray(): NumericStringAdjuster;
    separatedBy(separator: string|RegExp): NumericStringAdjuster;
    minLength(length: number): NumericStringAdjuster;
    maxLength(length: number, adjust?: boolean /* = false */): NumericStringAdjuster;
    checksum(algorithm: string): NumericStringAdjuster;
}
```

#### `adjust(value[, onError])`
Validate and adjust input values.

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.numericString().adjust("123"),
    "123");

// should be adjusted
assert.strictEqual(
    adjuster.numericString().adjust(123),
    "123");
```

#### `default(value)`
Accpet `undefined` for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.numericString().default("123").adjust(undefined),
    "123");

// should cause error
assert.throws(
    () => adjuster.numericString().adjust(undefined),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.REQUIRED));
```

#### `acceptNull([value])`
Accept a `null` for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.numericString().acceptNull("456").adjust(null),
    "456");

// should cause error
assert.throws(
    () => adjuster.numericString().adjust(null),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NULL));
```

#### `acceptEmptyString([value])`
Accept an empty string(`""`) for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.numericString().acceptEmptyString("456").adjust(""),
    "456");

// should cause error
assert.throws(
    () => adjuster.numericString().adjust(""),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
```

#### `separatedBy(separator)`
Assume an input value is separated by `separator`, and ignore them.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.numericString().separatedBy("-").adjust("4111-1111-1111-1111"),
    "4111111111111111");

// should cause error
assert.throws(
    () => adjuster.numericString().adjust("4111-1111-1111-1111"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
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
// should be adjusted
assert.strictEqual(
    adjuster.numericString().joinArray().adjust(["1234", "5678"]),
    "12345678");

// should cause error
assert.throws(
    () => adjuster.numericString().adjust(["1234", "5678"]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
```

#### `minLength(length)`
Limit minimum length of input string to `length`.

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.numericString().minLength(4).adjust("1234"),
    "1234");

// should cause error
assert.throws(
    () => adjuster.numericString().minLength(5).adjust("1234"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MIN_LENGTH));
```

#### `maxLength(length[, adjust])`
Limit maximum length of an input string to `length`.

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.numericString().maxLength(4).adjust("1234"),
    "1234");

// should be adjusted
assert.strictEqual(
    adjuster.numericString().separatedBy("-").maxLength(5, true).adjust("1234-5678"),
    "12345");

// should cause error
assert.throws(
    () => adjuster.numericString().maxLength(5).adjust("123456"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MAX_LENGTH));
```

#### `checksum(algorithm)`
Check an input value by specified algorithm.

|algorithm name|explanation|used by|constant|aliases|
|--------------|-----------|-------|--------|-------|
|`"luhn"`|[Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm)|credit card|`adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.LUHN`|`adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.CREDIT_CARD`|
|`"modulus10/weight3:1"`|[Modulus 10 / Weight 3:1](https://en.wikipedia.org/wiki/International_Standard_Book_Number#ISBN-13_check_digit_calculation)|ISBN-13, EAN, JAN|`adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.MODULUS10_WEIGHT3_1`|`adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.ISBN13` / `adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.EAN` / `adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.JAN`|

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.numericString().checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.LUHN).adjust("4111111111111111"),
    "4111111111111111");
assert.strictEqual(
    adjuster.numericString().checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.CREDIT_CARD).adjust("4111111111111111"), // alias of LUHN
    "4111111111111111");
assert.strictEqual(
    adjuster.numericString().checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.MODULUS10_WEIGHT3_1).adjust("9784101092058"),
    "9784101092058");
assert.strictEqual(
    adjuster.numericString().checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.ISBN13).adjust("9784101092058"), // alias of MODULUS10_WEIGHT3_1
    "9784101092058");
assert.strictEqual(
    adjuster.numericString().checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.EAN).adjust("9784101092058"), // alias of MODULUS10_WEIGHT3_1
    "9784101092058");
assert.strictEqual(
    adjuster.numericString().checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.JAN).adjust("9784101092058"), // alias of MODULUS10_WEIGHT3_1
    "9784101092058");

// should cause error
assert.throws(
    () => adjuster.numericString().checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.LUHN).adjust("4111111111111112"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NUMERIC_STRING_CHECKSUM));
```

### IPv4
#### ambient declarations

```typescript
namespace adjuster {
    export declare function ipv4(): IPv4Adjuster;
}

interface IPv4Adjuster {
    // adjustment method
    adjust(value: any, onError?: (err: AdjusterError) => string|void): string;

    // feature methods (chainable)
    default(value: string): IPv4Adjuster;
    acceptNull(value?: string|null /* = null */): IPv4Adjuster;
    acceptEmptyString(value?: string|null /* = null */): IPv4Adjuster;
    trim(): IPv4Adjuster;
}
```

#### `adjust(value[, onError])`
Validate and adjust a input value.

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.ipv4().adjust("0.0.0.0"),
    "0.0.0.0");
assert.strictEqual(
    adjuster.ipv4().adjust("192.168.0.1"),
    "192.168.0.1");
assert.strictEqual(
    adjuster.ipv4().adjust("255.255.255.255"),
    "255.255.255.255");

// should cause error
assert.throws(
    () => adjuster.ipv4().adjust("0.0.0."),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(
    () => adjuster.ipv4().adjust("0.0.0.0."),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(
    () => adjuster.ipv4().adjust("255.255.255.256"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
```

#### `default(value)`
Accept `undefined` for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.ipv4().default("0.0.0.0").adjust(undefined),
    "0.0.0.0");

// should cause error
assert.throws(
    () => adjuster.ipv4().adjust(undefined),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.REQUIRED));
```

#### `acceptNull([value])`
Accept a `null` for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.ipv4().acceptNull("0.0.0.0").adjust(null),
    "0.0.0.0");

// should cause error
assert.throws(
    () => adjuster.ipv4().adjust(null),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NULL));
```

#### `acceptEmptyString([value])`
Accept an empty string(`""`) for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.ipv4().acceptEmptyString("0.0.0.0").adjust(""),
    "0.0.0.0");

// should cause error
assert.throws(
    () => adjuster.ipv4().adjust(""),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
```

#### `trim()`
Remove whitespace from both ends of input.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.ipv4().trim().adjust("\r\n 1.1.1.1 \t "),
    "1.1.1.1");

// should cause error
assert.throws(
    () => adjuster.ipv4().trim().adjust(" \t\r\n "),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
```

### IPv6
#### ambient declarations

```typescript
namespace adjuster {
    export declare function ipv6(): IPv6Adjuster;
}

interface IPv6Adjuster {
    // adjustment method
    adjust(value: any, onError?: (err: AdjusterError) => string|void): string;

    // feature methods (chainable)
    default(value: string): IPv6Adjuster;
    acceptNull(value?: string|null /* = null */): IPv6Adjuster;
    acceptEmptyString(value?: string|null /* = null */): IPv6Adjuster;
    trim(): IPv6Adjuster;
}
```

#### `adjust(value[, onError])`
Validate and adjust a input value.

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.ipv6().adjust("0000:0000:0000:0000:0000:0000:0000:0000"),
    "0000:0000:0000:0000:0000:0000:0000:0000");
assert.strictEqual(
    adjuster.ipv6().adjust("::1"),
    "::1");
assert.strictEqual(
    adjuster.ipv6().adjust("::"),
    "::");
assert.strictEqual(
    adjuster.ipv6().adjust("1::1"),
    "1::1");
assert.strictEqual(
    adjuster.ipv6().adjust("::ffff:192.0.2.1"), // IPv4-mapped address
    "::ffff:192.0.2.1");

// should cause error
assert.throws(
    () => adjuster.ipv6().adjust("0000"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(
    () => adjuster.ipv6().adjust("ffff:"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(
    () => adjuster.ipv6().adjust("0000:0000:0000:0000:0000:0000:0000:0000:"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
```

#### `default(value)`
Accept `undefined` for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.ipv6().default("::").adjust(undefined),
    "::");

// should cause error
assert.throws(
    () => adjuster.ipv6().adjust(undefined),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.REQUIRED));
```

#### `acceptNull([value])`
Accept a `null` for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.ipv6().acceptNull("::").adjust(null),
    "::");

// should cause error
assert.throws(
    () => adjuster.ipv6().adjust(null),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NULL));
```

#### `acceptEmptyString([value])`
Accept an empty string(`""`) for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.ipv6().acceptEmptyString("::").adjust(""),
    "::");

// should cause error
assert.throws(
    () => adjuster.ipv6().adjust(""),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
```

#### `trim()`
Remove whitespace from both ends of input.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.ipv6().trim().adjust("\r\n ::1 \t "),
    "::1");

// should cause error
assert.throws(
    () => adjuster.ipv6().adjust("\r\n ::1 \t "),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(
    () => adjuster.ipv6().trim().adjust(" \t\r\n "),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
```

### email
#### ambient declarations

```typescript
namespace adjuster {
    export declare function email(): EmailAdjuster;
}

interface EmailAdjuster {
    // adjustment method
    adjust(value: any, onError?: (err: AdjusterError) => string|void): string;

    // feature methods (chainable)
    default(value: string): EmailAdjuster;
    acceptNull(value?: string|null /* = null */): EmailAdjuster;
    acceptEmptyString(value?: string|null /* = null */): EmailAdjuster;
    trim(): EmailAdjuster;
    pattern(pattern: string|RegExp): EmailAdjuster;
}
```

#### `adjust(value[, onError])`
Validate and adjust a input value.

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.email().adjust("user+mailbox/department=shipping@example.com"),
    "user+mailbox/department=shipping@example.com"); // dot-string
assert.strictEqual(
    adjuster.email().adjust("!#$%&'*+-/=?^_`.{|}~@example.com"),
    "!#$%&'*+-/=?^_`.{|}~@example.com"); // dot-string
assert.strictEqual(
    adjuster.email().adjust("\"Fred\\\"Bloggs\"@example.com"),
    "\"Fred\\\"Bloggs\"@example.com"); // quoted-string
assert.strictEqual(
    adjuster.email().adjust("\"Joe.\\\\Blow\"@example.com"),
    "\"Joe.\\\\Blow\"@example.com"); // quoted-string
assert.strictEqual(
    adjuster.email().adjust("user@example-domain.com"),
    "user@example-domain.com");
assert.strictEqual(
    adjuster.email().adjust("user@example2.com"),
    "user@example2.com");

// should cause error
assert.throws(
    () => adjuster.email().adjust("@example.com"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(
    () => adjuster.email().adjust(".a@example.com"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(
    () => adjuster.email().adjust("a.@example.com"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(
    () => adjuster.email().adjust("a..a@example.com"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(
    () => adjuster.email().adjust("user@example@com"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(
    () => adjuster.email().adjust("user-example-com"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(
    () => adjuster.email().adjust("user@example_domain.com"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(
    () => adjuster.email().adjust("user@example.com2"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
```

#### `default(value)`
Accept `undefined` for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.email().default("user@example.com").adjust(undefined),
    "user@example.com");

// should cause error
assert.throws(
    () => adjuster.email().adjust(undefined),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.REQUIRED));
```

#### `acceptNull([value])`
Accept a `null` for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.email().acceptNull("user@example.com").adjust(null),
    "user@example.com");

// should cause error
assert.throws(
    () => adjuster.email().adjust(null),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NULL));
```

#### `acceptEmptyString([value])`
Accept an empty string(`""`) for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.email().acceptEmptyString("user@example.com").adjust(""),
    "user@example.com");

// should cause error
assert.throws(
    () => adjuster.email().adjust(""),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
```

#### `trim()`
Remove whitespace from both ends of input.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.email().trim().adjust("\r\n user@example.com \t "),
    "user@example.com");

// should cause error
assert.throws(
    () => adjuster.email().adjust("\r\n user@example.com1 \t "),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(
    () => adjuster.email().trim().adjust(" \t\r\n "),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
```

#### `pattern(pattern)`
Specify acceptable pattern by regular expression.

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.email().pattern(/^[\w\.]+@([\w\-]+\.)+\w+$/).adjust("......@example.com"), // accept leading/trailing/consecutively dots
    "user@example.com");

// should cause errors
assert.throws(
    () => adjuster.email().adjust("......@example.com"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

[image-build-windows]: https://img.shields.io/appveyor/ci/shimataro/node-adjuster/master.svg?label=Windows
[link-build-windows]: https://ci.appveyor.com/project/shimataro/node-adjuster
[image-build-macos]: https://img.shields.io/travis/shimataro/node-adjuster/master.svg?label=macOS
[link-build-macos]: https://travis-ci.org/shimataro/node-adjuster
[image-build-linux]: https://img.shields.io/travis/shimataro/node-adjuster/master.svg?label=Linux
[link-build-linux]: https://travis-ci.org/shimataro/node-adjuster
[image-release]: https://img.shields.io/github/release/shimataro/node-adjuster.svg
[link-release]: https://github.com/shimataro/node-adjuster/releases
[image-engine]: https://img.shields.io/node/v/adjuster.svg
[link-engine]: https://nodejs.org/
[image-license]: https://img.shields.io/github/license/shimataro/node-adjuster.svg
[link-license]: ./LICENSE
