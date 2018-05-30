node-adjuster
===

[![Build Status](https://img.shields.io/travis/shimataro/node-adjuster/develop.svg)](https://travis-ci.org/shimataro/node-adjuster)
[![Release](https://img.shields.io/github/release/shimataro/node-adjuster.svg)](https://github.com/shimataro/node-adjuster/releases)
![Node.js version](https://img.shields.io/node/v/adjuster.svg)
![License](https://img.shields.io/github/license/shimataro/node-adjuster.svg)

validate and adjust input values

## Table of Contents

* [Install](#install)
* [How to use](#how-to-use)
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

## How to use
### basic usage

```javascript
import adjuster from "adjuster";
import assert from "assert";

const adjusters = {
    id: adjuster.number().minValue(1),
    name: adjuster.string().maxLength(16, true),
    email: adjuster.email(),
    state: adjuster.string().in("active", "inactive"),
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

const adjusted = adjuster.adjust(input, adjusters);
assert.deepStrictEqual(adjusted, expected);
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
    allowEmptyString(value?: number|null /* = null */): NumberAdjuster;
    in(...values: number[]): NumberAdjuster;
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

#### `in(...values)`
Accept only `values`.

If input value is not in `values`, `adjust()` method causes `AdjusterError`.

##### examples

```javascript
// should be OK
assert.strictEqual(
    adjuster.number().in(1, 3, 5).adjust(1),
    1);

// should cause error
assert.throws(
    () => adjuster.number().in(1, 3, 5).adjust(2),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.IN));
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
    allowEmptyString(value: number[]|null /* = null */): NumberArrayAdjuster;
    separatedBy(separator: string|RegExp): NumberArrayAdjuster;
    toArray(): NumberArrayAdjuster;
    minLength(length: number): NumberArrayAdjuster;
    maxLength(length: number, adjust?: boolean /* = false */): NumberArrayAdjuster;
    ignoreEachErrors(): NumberArrayAdjuster;
    eachDefault(value: number): NumberArrayAdjuster;
    eachAllowEmptyString(value?: number|null /* = null */): NumberArrayAdjuster;
    eachIn(...values: number[]): NumberArrayAdjuster;
    eachMinValue(value: number, adjust?: boolean /* = false */): NumberArrayAdjuster;
    eachMaxValue(value: number, adjust?: boolean /* = false */): NumberArrayAdjuster;
}
```

#### `adjust(value[, onError])`
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
Limit minimum length of array to `length`.

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

#### `eachAllowEmptyString([value])`
Allow an empty string(`""`) for each elements of input, and adjust to `value`.

##### examples

```javascript
// should be adjusted
assert.deepStrictEqual(
    adjuster.numberArray().eachAllowEmptyString(2).adjust([1, "", 3]),
    [1, 999, 3]);

// should cause eerror
assert.throws(
    () => adjuster.numberArray().adjust([""]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_EMPTY));
```

#### `eachIn(...values)`
Accept only `values` for each elements of input.

##### examples

```javascript
// should be OK
assert.deepStrictEqual(
    adjuster.numberArray().eachIn(1, 2, 3).adjust([1, 2]),
    [1, 2]);

// should cause error
assert.throws(
    () => adjuster.numberArray().eachIn(1, 2, 3).adjust([0, 1]),
    (err) => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_IN));
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

```javascript
import adjuster from "adjuster";
import assert from "assert";

// should be OK
assert.strictEqual(adjuster.string().adjust("123")                             , "123");
assert.strictEqual(adjuster.string().allowEmptyString("xyz").adjust("")        , "xyz");
assert.strictEqual(adjuster.string().in("eat", "sleep", "play").adjust("sleep"), "sleep");

// should be adjusted
assert.strictEqual(adjuster.string().adjust(123)                         , "123");
assert.strictEqual(adjuster.string().default("xyz").adjust(undefined)    , "xyz");
assert.strictEqual(adjuster.string().trim().adjust("\r\n hell, word \t "),"hell, word");
assert.strictEqual(adjuster.string().maxLength(5, true).adjust("abcdefg"), "abcde");

// should cause errors
assert.throws(() => adjuster.string().adjust(undefined)                         , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.REQUIRED));
assert.throws(() => adjuster.string().adjust("")                                , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
assert.throws(() => adjuster.string().trim().adjust(" \t\r\n ")                 , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
assert.throws(() => adjuster.string().in("eat", "sleep", "play").adjust("study"), err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.IN));
assert.throws(() => adjuster.string().minLength(5).adjust("a")                  , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MIN_LENGTH));
assert.throws(() => adjuster.string().maxLength(5).adjust("abcdefg")            , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MAX_LENGTH));
```

### string array

```javascript
import adjuster from "adjuster";
import assert from "assert";

// should be OK
assert.deepStrictEqual(adjuster.stringArray().adjust(["a", "b"])                        , ["a", "b"]);
assert.deepStrictEqual(adjuster.stringArray().minLength(1).adjust(["a"])                , ["a"]);
assert.deepStrictEqual(adjuster.stringArray().maxLength(2).adjust(["a"])                , ["a"]);
assert.deepStrictEqual(adjuster.stringArray().eachIn("a", "b").adjust(["a"])            , ["a"]);
assert.deepStrictEqual(adjuster.stringArray().eachMinLength(3).adjust(["abc", "xyz"])   , ["abc", "xyz"]);
assert.deepStrictEqual(adjuster.stringArray().eachMaxLength(3).adjust(["abc", "xyz"])   , ["abc", "xyz"]);
assert.deepStrictEqual(adjuster.stringArray().eachPattern(/^Go+gle$/).adjust(["Google"]), ["Google"]);

// should be adjusted
assert.deepStrictEqual(adjuster.stringArray().adjust(["a", 1, -2])                              , ["a", "1", "-2"]);
assert.deepStrictEqual(adjuster.stringArray().default(["a", "b"]).adjust(undefined)             , ["a", "b"]);
assert.deepStrictEqual(adjuster.stringArray().allowEmptyString(["a", "b"]).adjust("")           , ["a", "b"]);
assert.deepStrictEqual(adjuster.stringArray().separatedBy(",").adjust("a,b,c")                  , ["a", "b", "c"]);
assert.deepStrictEqual(adjuster.stringArray().toArray().adjust("a")                             , ["a"]);
assert.deepStrictEqual(adjuster.stringArray().maxLength(1, true).adjust(["a", "b"])             , ["a"]);
assert.deepStrictEqual(adjuster.stringArray().ignoreEachErrors().adjust([undefined, "a", "", 1]), ["a", "1"]);
assert.deepStrictEqual(adjuster.stringArray().eachDefault("z").adjust(["a", undefined, "b"])    , ["a", "z", "b"]);
assert.deepStrictEqual(adjuster.stringArray().eachAllowEmptyString("z").adjust(["a", "", "b"])  , ["a", "z", "b"]);
assert.deepStrictEqual(adjuster.stringArray().eachTrim().adjust([" a", "b\t", "\rc\n"])         , ["a", "b", "c"]);
assert.deepStrictEqual(adjuster.stringArray().eachMaxLength(3, true).adjust(["abcd", "xyz0"])   , ["abc", "xyz"]);

// should cause errors
assert.throws(() => adjuster.stringArray().adjust("abc")                           , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
assert.throws(() => adjuster.stringArray().adjust(undefined)                       , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.REQUIRED));
assert.throws(() => adjuster.stringArray().adjust("")                              , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
assert.throws(() => adjuster.stringArray().minLength(1).adjust([])                 , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MIN_LENGTH));
assert.throws(() => adjuster.stringArray().maxLength(1).adjust(["a", "b"])         , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MAX_LENGTH));
assert.throws(() => adjuster.stringArray().adjust(["a", undefined, "b"])           , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_REQUIRED));
assert.throws(() => adjuster.stringArray().adjust([""])                            , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_EMPTY));
assert.throws(() => adjuster.stringArray().eachIn("a", "b").adjust(["x"])          , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_IN));
assert.throws(() => adjuster.stringArray().eachMinLength(3).adjust(["ab"])         , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_MIN_LENGTH));
assert.throws(() => adjuster.stringArray().eachMaxLength(3).adjust(["abcd"])       , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_MAX_LENGTH));
assert.throws(() => adjuster.stringArray().eachPattern(/^Go+gle$/).adjust(["Ggle"]), err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_PATTERN));
```

### numeric string

```javascript
import adjuster from "adjuster";
import assert from "assert";

// should be OK
assert.strictEqual(adjuster.numericString().adjust("123")                                                                                   , "123");
assert.strictEqual(adjuster.numericString().minLength(4).adjust("1234")                                                                     , "1234");
assert.strictEqual(adjuster.numericString().maxLength(4).adjust("1234")                                                                     , "1234");
assert.strictEqual(adjuster.numericString().checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.LUHN).adjust("4111111111111111")            , "4111111111111111");
assert.strictEqual(adjuster.numericString().checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.CREDIT_CARD).adjust("4111111111111111")     , "4111111111111111"); // alias of LUHN
assert.strictEqual(adjuster.numericString().checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.MODULUS10_WEIGHT3_1).adjust("9784101092058"), "9784101092058");
assert.strictEqual(adjuster.numericString().checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.ISBN13).adjust("9784101092058")             , "9784101092058"); // alias of MODULUS10_WEIGHT3_1
assert.strictEqual(adjuster.numericString().checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.EAN).adjust("9784101092058")                , "9784101092058"); // alias of MODULUS10_WEIGHT3_1
assert.strictEqual(adjuster.numericString().checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.JAN).adjust("9784101092058")                , "9784101092058"); // alias of MODULUS10_WEIGHT3_1

// should be adjusted
assert.strictEqual(adjuster.numericString().adjust(123)                                            , "123");
assert.strictEqual(adjuster.numericString().default("123").adjust(undefined)                       , "123");
assert.strictEqual(adjuster.numericString().allowEmptyString("456").adjust("")                     , "456");
assert.strictEqual(adjuster.numericString().joinArray().adjust(["1234", "5678"])                   , "12345678");
assert.strictEqual(adjuster.numericString().separatedBy("-").adjust("1234-5678")                   , "12345678");
assert.strictEqual(adjuster.numericString().separatedBy("-").maxLength(5, true).adjust("1234-5678"), "12345");

// should cause errors
assert.throws(() => adjuster.numericString().adjust(undefined)                                                                   , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.REQUIRED));
assert.throws(() => adjuster.numericString().adjust("")                                                                          , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
assert.throws(() => adjuster.numericString().minLength(5).adjust("1234")                                                         , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MIN_LENGTH));
assert.throws(() => adjuster.numericString().maxLength(5).adjust("123456")                                                       , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MAX_LENGTH));
assert.throws(() => adjuster.numericString().checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.LUHN).adjust("4111111111111112"), err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.NUMERIC_STRING_CHECKSUM));
```

### IPv4

```javascript
import adjuster from "adjuster";
import assert from "assert";

// should be OK
assert.strictEqual(adjuster.ipv4().adjust("0.0.0.0")        , "0.0.0.0");
assert.strictEqual(adjuster.ipv4().adjust("192.168.0.1")    , "192.168.0.1");
assert.strictEqual(adjuster.ipv4().adjust("255.255.255.255"), "255.255.255.255");

// should be adjusted
assert.strictEqual(adjuster.ipv4().trim().adjust("\r\n 1.1.1.1 \t "), "1.1.1.1");

// should cause errors; err.cause === adjuster.CAUSE.PATTERN
assert.throws(() => adjuster.ipv4().trim().adjust(" \t\r\n "), err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
assert.throws(() => adjuster.ipv4().adjust("0.0.0.")         , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(() => adjuster.ipv4().adjust("0.0.0.0.")       , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(() => adjuster.ipv4().adjust("255.255.255.256"), err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
```

### IPv6

```javascript
import adjuster from "adjuster";
import assert from "assert";

// should be OK
assert.strictEqual(adjuster.ipv6().adjust("0000:0000:0000:0000:0000:0000:0000:0000"), "0000:0000:0000:0000:0000:0000:0000:0000");
assert.strictEqual(adjuster.ipv6().adjust("::1")                                    , "::1");
assert.strictEqual(adjuster.ipv6().adjust("::")                                     , "::");
assert.strictEqual(adjuster.ipv6().adjust("1::1")                                   , "1::1");
assert.strictEqual(adjuster.ipv6().adjust("::ffff:192.0.2.1")                       , "::ffff:192.0.2.1"); // IPv4-mapped address

// should be adjusted
assert.strictEqual(adjuster.ipv6().trim().adjust("\r\n ::1 \t "), "::1");

// should cause errors; err.cause === adjuster.CAUSE.PATTERN
assert.throws(() => adjuster.ipv6().trim().adjust(" \t\r\n "), err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
assert.throws(() => adjuster.ipv6().adjust("0000")                                    , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(() => adjuster.ipv6().adjust("ffff:")                                   , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(() => adjuster.ipv6().adjust("0000:0000:0000:0000:0000:0000:0000:0000:"), err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
```

### email

```javascript
import adjuster from "adjuster";
import assert from "assert";

// should be OK
assert.strictEqual(adjuster.email().adjust("user+mailbox/department=shipping@example.com"), "user+mailbox/department=shipping@example.com"); // dot-string
assert.strictEqual(adjuster.email().adjust("!#$%&'*+-/=?^_`.{|}~@example.com")            , "!#$%&'*+-/=?^_`.{|}~@example.com"); // dot-string
assert.strictEqual(adjuster.email().adjust("\"Fred\\\"Bloggs\"@example.com")              , "\"Fred\\\"Bloggs\"@example.com"); // quoted-string
assert.strictEqual(adjuster.email().adjust("\"Joe.\\\\Blow\"@example.com")                , "\"Joe.\\\\Blow\"@example.com"); // quoted-string
assert.strictEqual(adjuster.email().adjust("user@example-domain.com")                     , "user@example-domain.com");
assert.strictEqual(adjuster.email().adjust("user@example2.com")                           , "user@example2.com");

// should be adjusted
assert.strictEqual(adjuster.email().trim().adjust("\r\n trim@example.com \t "), "trim@example.com");

// should cause errors
assert.throws(() => adjuster.email().adjust("@example.com")           , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(() => adjuster.email().adjust(".a@example.com")         , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(() => adjuster.email().adjust("a.@example.com")         , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(() => adjuster.email().adjust("a..a@example.com")       , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(() => adjuster.email().adjust("user@example@com")       , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(() => adjuster.email().adjust("user-example-com")       , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(() => adjuster.email().adjust("user@example_domain.com"), err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
assert.throws(() => adjuster.email().adjust("user@example.com2")      , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.PATTERN));
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
