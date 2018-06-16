node-adjuster
===

[![Build Status](https://img.shields.io/travis/shimataro/node-adjuster/develop.svg)](https://travis-ci.org/shimataro/node-adjuster)
[![Release](https://img.shields.io/github/release/shimataro/node-adjuster.svg)](https://github.com/shimataro/node-adjuster/releases)
![Node.js version](https://img.shields.io/node/v/adjuster.svg)
![License](https://img.shields.io/github/license/shimataro/node-adjuster.svg)

validate and adjust input values

## Table of Contents

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

## Install

install from [npm registry](https://www.npmjs.com/package/adjuster).
```bash
npm install -S adjuster
```

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

ES Modules(`.mjs`) is not provided for now.

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
Checksum algorithms for `adjuster.numericString()`.

For more information, see [numeric string](#numeric-string).

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
    email: adjuster.email(),
    state: adjuster.string().only("active", "inactive"),
    classes: adjuster.numberArray().separatedBy(",").ignoreEachErrors(),
    skills: adjuster.stringArray().separatedBy(",").ignoreEachErrors(),
    credit_card: adjuster.numericString().separatedBy("-").checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.CREDIT_CARD),
    remote_addr: adjuster.ipv4(),
    remote_addr_ipv6: adjuster.ipv6(),
    limit: adjuster.number().default(10).minValue(1, true).maxValue(100, true),
    offset: adjuster.number().default(0).minValue(0, true),
};
const input = {
    id: "1",
    name: "Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Ciprin Cipriano de la Santísima Trinidad Ruiz y Picasso",
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
        if(err === null) {
            // adjustment finished
            return;
        }

        if(err.key === "id") {
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
catch(err) {
    // do something
    assert.strictEqual(err.message, "id,name");
}

function generateErrorHandler() {
    const messages = [];
    return (err) => {
        if(err === null) {
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
catch(err) {
    // catch a first error
    assert.strictEqual(err.key, "id");
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
    adjust(value: any, onError?: (cause: string, value: any) => number|void): number;

    // feature methods (chainable)
    default(value: number): NumberAdjuster;
    allowNull(value?: number|null /* = null */): NumberAdjuster;
    allowEmptyString(value?: number|null /* = null */): NumberAdjuster;
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

// should cause error
assert.strictEqual( // catch error by callback function (that returns a value from adjust() method)
    adjuster.number().adjust(
        "abc",
        (err) => 10),
    10);
assert.throws( // ... or try-catch syntax
    () => adjuster.number().adjust("abc"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
```

#### `default(value)`
Allow `undefined` for input, and adjust to `value`.

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

#### `allowNull([value])`
Allow a `null` for input, and adjust to `value`.

If this method is not called, `adjust(null)` causes `AdjusterError`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.number().allowNull(1).adjust(null),
    1);

// should cause error
assert.throws(
    () => adjuster.number().adjust(null),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NULL));
```

#### `allowEmptyString([value])`
Allow an empty string(`""`) for input, and adjust to `value`.

If this method is not called, `adjust("")` causes `AdjusterError`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.number().allowEmptyString(1).adjust(""),
    1);

// should cause error
assert.throws(
    () => adjuster.number().adjust(""),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
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

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.number().minValue(1).adjust(1),
    1);

// should be adjusted
assert.strictEqual(
    adjuster.number().minValue(1, true).adjust(0),
    1);

// should cause errors
assert.throws(
    () => adjuster.number().minValue(1).adjust(0),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MIN_VALUE));
```

#### `maxValue(value[, adjust])`
Limit maximum value to `value`.

If input value is greater than `value`, `adjust()` method returns `value` (if `adjust` is truthy) or causes `AdjusterError` (falsy; default).

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.number().maxValue(1).adjust(1),
    1);

// should be adjusted
assert.strictEqual(
    adjuster.number().maxValue(100, true).adjust(101),
    100);

// should cause errors
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
    adjust(value: any, onError?: (cause: string, value: any) => number[]|void): number[];

    // feature methods (chainable)
    default(value: number[]): NumberArrayAdjuster;
    allowNull(value?: number[]|null /* = null */): NumberArrayAdjuster;
    allowEmptyString(value: number[]|null /* = null */): NumberArrayAdjuster;
    separatedBy(separator: string|RegExp): NumberArrayAdjuster;
    toArray(): NumberArrayAdjuster;
    minLength(length: number): NumberArrayAdjuster;
    maxLength(length: number, adjust?: boolean /* = false */): NumberArrayAdjuster;
    ignoreEachErrors(): NumberArrayAdjuster;
    eachDefault(value: number): NumberArrayAdjuster;
    eachAllowNull(value?: number|null /* = null */): NumberArrayAdjuster;
    eachAllowEmptyString(value?: number|null /* = null */): NumberArrayAdjuster;
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
Allow `undefined` for input, and adjust to `value`.

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

#### `allowNull([value])`
Allow a `null` for input, and adjust to `value`.

If this method is not called, `adjust(null)` causes `AdjusterError`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().allowNull([1, 2, 3]).adjust(null),
    [1, 2, 3]);

// should cause error
assert.throws(
    () => adjuster.numberArray().adjust(null),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NULL));
```

#### `allowEmptyString([value])`
Allow an empty string(`""`) for input, and adjust to `value`.

If this method is not called, `adjust("")` causes `AdjusterError`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().allowEmptyString([1, 2]).adjust(""),
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
Allow `undefined` for each elements of input, and adjust to `value`.

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

#### `eachAllowNull([value])`
Allow a `null` for each elements of input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().eachAllowNull(2).adjust([1, null, 3]),
    [1, 2, 3]);

// should cause error
assert.throws(
    () => adjuster.numberArray().adjust([1, null, 3]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_NULL));
```

#### `eachAllowEmptyString([value])`
Allow an empty string(`""`) for each elements of input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().eachAllowEmptyString(2).adjust([1, "", 3]),
    [1, 2, 3]);

// should cause eerror
assert.throws(
    () => adjuster.numberArray().adjust([""]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_EMPTY));
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
    adjust(value: any, onError?: (cause: string, value: any) => string|void): string;

    // feature methods (chainable)
    default(value: string): StringAdjuster;
    allowNull(value?: string|null /* = null */): StringAdjuster;
    allowEmptyString(value?: string|null /* = null */): StringAdjuster;
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
Allow `undefined` for input, and adjust to `value`.

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

#### `allowNull([value])`
Allow a `null` for input, and adjust to `value`.

If this method is not called, `adjust(null)` causes `AdjusterError`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.string().allowNull("x").adjust(null),
    "x");

// should cause error
assert.throws(
    () => adjuster.string().adjust(null),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NULL));
```

#### `allowEmptyString([value])`
Allow an empty string(`""`) for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.string().allowEmptyString("xyz").adjust(""),
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

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.string().pattern(/^Go+gle$/).adjust("Gogle"),
    "Gogle");
assert.deepStrictEqual(
    adjuster.string().pattern("^Go+gle$").adjust("Google"),
    "Google");

// should cause error
assert.throws(
    () => adjuster.string().pattern(/^Go+gle$/).adjust("Ggle"),
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
    adjust(value: any, onError?: (cause: string, value: any) => string[]|void): string[];

    // feature methods (chainable)
    default(value: string[]): StringArrayAdjuster;
    allowNull(value?: string[]|null /* = null */): StringArrayAdjuster;
    allowEmptyString(value: string[]|null /* = null */): StringArrayAdjuster;
    separatedBy(separator: string|RegExp): StringArrayAdjuster;
    toArray(): StringArrayAdjuster;
    minLength(length: number): StringArrayAdjuster;
    maxLength(length: number, adjust?: boolean /* = false */): StringArrayAdjuster;
    ignoreEachErrors(): StringArrayAdjuster;
    eachDefault(value: string): StringArrayAdjuster;
    eachAllowNull(value?: string|null /* = null */): StringArrayAdjuster;
    eachAllowEmptyString(value?: string|null /* = null */): StringArrayAdjuster;
    eachTrim(): StringArrayAdjuster;
    eachOnly(...values: string[]): StringArrayAdjuster;
    eachMinLength(length: number): StringArrayAdjuster;
    eachMaxLength(length: number, adjust?: boolean /* = false */): StringArrayAdjuster;
    eachPattern(pattern: string|RegExp): StringArrayAdjuster;
}
```

#### `adjust(value[, onError])`
Validate and adjust input values.

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
Allow `undefined` for input, and adjust to `value`.

If this method is not called, `adjust(undefined)` causes `AdjusterError`.
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

#### `allowNull([value])`
Allow a `null` for input, and adjust to `value`.

If this method is not called, `adjust(null)` causes `AdjusterError`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().allowNull(["a", "b"]).adjust(null),
    ["a", "b"]);

// should cause error
assert.throws(
    () => adjuster.stringArray().adjust(null),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NULL));
```

#### `allowEmptyString([value])`
Allow an empty string(`""`) for input, and adjust to `value`.

If this method is not called, `adjust("")` causes `AdjusterError`.

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().allowEmptyString(["a", "b"]).adjust(""),
    ["a", "b"]);

// should cause errors
assert.throws(
    () => adjuster.stringArray().adjust(""),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
```

#### `separatedBy(separator)`
Assume an input value is string and separated by `separator`.

If an input type is array, this method does nothing.

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
Allow `undefined` for each elements of input, and adjust to `value`.

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

#### `eachAllowNull([value])`
Allow a `null` for each elements of input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().eachAllowNull("z").adjust(["a", null, "b"]),
    ["a", "z", "b"]);

// should cause error
assert.throws(
    () => adjuster.stringArray().adjust(["a", null, "b"]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_NULL));
```

#### `eachAllowEmptyString([value])`
Allow an empty string(`""`) for each elements of input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.stringArray().eachAllowEmptyString("z").adjust(["a", "", "b"]),
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
    adjust(value: any, onError?: (cause: string, value: any) => string|void): string;

    // feature methods (chainable)
    default(value: string): NumericStringAdjuster;
    allowNull(value?: string|null /* = null */): NumericStringAdjuster;
    allowEmptyString(value?: string|null /* = null */): NumericStringAdjuster;
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
Allow `undefined` for input, and adjust to `value`.

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

#### `allowNull([value])`
Allow a `null` for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.numericString().allowNull("456").adjust(null),
    "456");

// should cause error
assert.throws(
    () => adjuster.numericString().adjust(null),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NULL));
```

#### `allowEmptyString([value])`
Allow an empty string(`""`) for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.numericString().allowEmptyString("456").adjust(""),
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
    adjust(value: any, onError?: (cause: string, value: any) => string|void): string;

    // feature methods (chainable)
    default(value: string): IPv4Adjuster;
    allowNull(value?: string|null /* = null */): IPv4Adjuster;
    allowEmptyString(value?: string|null /* = null */): IPv4Adjuster;
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
Allow `undefined` for input, and adjust to `value`.

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

#### `allowNull([value])`
Allow a `null` for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.ipv4().allowNull("0.0.0.0").adjust(null),
    "0.0.0.0");

// should cause error
assert.throws(
    () => adjuster.ipv4().adjust(null),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NULL));
```

#### `allowEmptyString([value])`
Allow an empty string(`""`) for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.ipv4().allowEmptyString("0.0.0.0").adjust(""),
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
    adjust(value: any, onError?: (cause: string, value: any) => string|void): string;

    // feature methods (chainable)
    default(value: string): IPv6Adjuster;
    allowNull(value?: string|null /* = null */): IPv6Adjuster;
    allowEmptyString(value?: string|null /* = null */): IPv6Adjuster;
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
Allow `undefined` for input, and adjust to `value`.

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

#### `allowNull([value])`
Allow a `null` for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.ipv6().allowNull("::").adjust(null),
    "::");

// should cause error
assert.throws(
    () => adjuster.ipv6().adjust(null),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NULL));
```

#### `allowEmptyString([value])`
Allow an empty string(`""`) for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.ipv6().allowEmptyString("::").adjust(""),
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
    adjust(value: any, onError?: (cause: string, value: any) => string|void): string;

    // feature methods (chainable)
    default(value: string): EmailAdjuster;
    allowNull(value?: string|null /* = null */): EmailAdjuster;
    allowEmptyString(value?: string|null /* = null */): EmailAdjuster;
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
Allow `undefined` for input, and adjust to `value`.

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

#### `allowNull([value])`
Allow a `null` for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.email().allowNull("user@example.com").adjust(null),
    "user@example.com");

// should cause error
assert.throws(
    () => adjuster.email().adjust(null),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NULL));
```

#### `allowEmptyString([value])`
Allow an empty string(`""`) for input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.strictEqual(
    adjuster.email().allowEmptyString("user@example.com").adjust(""),
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
    adjuster.email().pattern(/^[\w\.]+@([\w\-]+\.)+\w+$/).adjust("......@example.com"), // allow leading/trailing/consecutively dots
    "user@example.com");

// should cause errors
assert.throws(
    () => adjuster.email().adjust("......@example.com"),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
