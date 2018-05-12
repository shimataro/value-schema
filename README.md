node-adjuster
===

[![Build Status](https://travis-ci.org/shimataro/node-adjuster.svg?branch=develop)](https://travis-ci.org/shimataro/node-adjuster)

validate and adjust input values

## How to use

install by npm.
```bash
npm install -S adjuster
```

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
    remote_addr: "127.0.0.1",
    remote_addr_ipv6: "::1",
    limit: 1,
    offset: 0,
};

const adjusted = adjuster.adjust(input, adjusters);
assert.deepStrictEqual(adjusted, expected);
```

### number

```javascript
import adjuster from "adjuster";
import assert from "assert";

// should be OK
assert.strictEqual(adjuster.number().adjust(-123)         , -123);
assert.strictEqual(adjuster.number().in(1, 3, 5).adjust(1), 1);

// should be adjusted
assert.strictEqual(adjuster.number().adjust("-123")                 , -123);
assert.strictEqual(adjuster.number().default(10).adjust(undefined)  , 10);
assert.strictEqual(adjuster.number().allowEmpty(123).adjust("")     , 123);
assert.strictEqual(adjuster.number().minValue(1, true).adjust(0)    , 1);
assert.strictEqual(adjuster.number().maxValue(100, true).adjust(101), 100);

// should cause errors
assert.strictEqual(adjuster.number().adjust(undefined, (err) => 10), 10); // catch error by callback function (that returns a value from adjust() method)
assert.throws(() => adjuster.number().adjust(undefined)        , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.REQUIRED)); // ... or try-catch syntax
assert.throws(() => adjuster.number().adjust("abc")            , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
assert.throws(() => adjuster.number().adjust("")               , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
assert.throws(() => adjuster.number().in(1, 3, 5).adjust(2)    , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.IN));
assert.throws(() => adjuster.number().minValue(1).adjust(0)    , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MIN_VALUE));
assert.throws(() => adjuster.number().maxValue(100).adjust(101), err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MAX_VALUE));
```

### numberArray

```javascript
import adjuster from "adjuster";
import assert from "assert";

// should be OK
assert.deepStrictEqual(adjuster.numberArray().adjust([1, 2, 3])                    , [1, 2, 3]);
assert.deepStrictEqual(adjuster.numberArray().minLength(2).adjust([1, 2])          , [1, 2]);
assert.deepStrictEqual(adjuster.numberArray().maxLength(2).adjust([1, 2])          , [1, 2]);
assert.deepStrictEqual(adjuster.numberArray().eachIn(1, 2, 3).adjust([1, 2])       , [1, 2]);
assert.deepStrictEqual(adjuster.numberArray().eachMinValue(10).adjust([10, 11, 12]), [10, 11, 12]);
assert.deepStrictEqual(adjuster.numberArray().eachMaxValue(10).adjust([8, 9, 10])  , [8, 9, 10]);

// should be adjusted
assert.deepStrictEqual(adjuster.numberArray().adjust([1, "-2", "+3"])                            , [1, -2, 3]);
assert.deepStrictEqual(adjuster.numberArray().default([1, 2]).adjust(undefined)                  , [1, 2]);
assert.deepStrictEqual(adjuster.numberArray().allowEmpty([1, 2]).adjust("")                      , [1, 2]);
assert.deepStrictEqual(adjuster.numberArray().separatedBy(",").adjust("1,2,3")                   , [1, 2, 3]);
assert.deepStrictEqual(adjuster.numberArray().toArray().adjust(0)                                , [0]);
assert.deepStrictEqual(adjuster.numberArray().maxLength(2, true).adjust([1, 2, 3])               , [1, 2]);
assert.deepStrictEqual(adjuster.numberArray().ignoreEachErrors().adjust([undefined, 1, "abc", 2]), [1, 2]);
assert.deepStrictEqual(adjuster.numberArray().eachDefault(999).adjust([1, undefined, 3])         , [1, 999, 3]);
assert.deepStrictEqual(adjuster.numberArray().eachAllowEmpty(999).adjust([1, "", 3])             , [1, 999, 3]);
assert.deepStrictEqual(adjuster.numberArray().eachMinValue(10, true).adjust([9, 10, 11])         , [10, 10, 11]);
assert.deepStrictEqual(adjuster.numberArray().eachMaxValue(10, true).adjust([9, 10, 11])         , [9, 10, 10]);

// should cause errors
assert.throws(() => adjuster.numberArray().adjust("abc")                       , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
assert.throws(() => adjuster.numberArray().adjust(0)                           , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.TYPE));
assert.throws(() => adjuster.numberArray().adjust(undefined)                   , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.REQUIRED));
assert.throws(() => adjuster.numberArray().adjust("")                          , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
assert.throws(() => adjuster.numberArray().minLength(2).adjust([1])            , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MIN_LENGTH));
assert.throws(() => adjuster.numberArray().maxLength(2).adjust([1, 2, 3])      , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MAX_LENGTH));
assert.throws(() => adjuster.numberArray().adjust(["abc"])                     , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_TYPE));
assert.throws(() => adjuster.numberArray().adjust([1, undefined, 3])           , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_REQUIRED));
assert.throws(() => adjuster.numberArray().adjust([""])                        , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_EMPTY));
assert.throws(() => adjuster.numberArray().eachIn(1, 2, 3).adjust([0, 1])      , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_IN));
assert.throws(() => adjuster.numberArray().eachMinValue(10).adjust([9, 10, 11]), err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_MIN_VALUE));
assert.throws(() => adjuster.numberArray().eachMaxValue(10).adjust([9, 10, 11]), err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EACH_MAX_VALUE));
```

### string

```javascript
import adjuster from "adjuster";
import assert from "assert";

// should be OK
assert.strictEqual(adjuster.string().adjust("123")                             , "123");
assert.strictEqual(adjuster.string().allowEmpty("xyz").adjust("")              , "xyz");
assert.strictEqual(adjuster.string().in("eat", "sleep", "play").adjust("sleep"), "sleep");

// should be adjusted
assert.strictEqual(adjuster.string().adjust(123)                         , "123");
assert.strictEqual(adjuster.string().default("xyz").adjust(undefined)    , "xyz");
assert.strictEqual(adjuster.string().maxLength(5, true).adjust("abcdefg"), "abcde");

// should cause errors
assert.throws(() => adjuster.string().adjust(undefined)                         , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.REQUIRED));
assert.throws(() => adjuster.string().adjust("")                                , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMPTY));
assert.throws(() => adjuster.string().in("eat", "sleep", "play").adjust("study"), err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.IN));
assert.throws(() => adjuster.string().minLength(5).adjust("a")                  , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MIN_LENGTH));
assert.throws(() => adjuster.string().maxLength(5).adjust("abcdefg")            , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.MAX_LENGTH));
```

### stringArray

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
assert.deepStrictEqual(adjuster.stringArray().allowEmpty(["a", "b"]).adjust("")                 , ["a", "b"]);
assert.deepStrictEqual(adjuster.stringArray().separatedBy(",").adjust("a,b,c")                  , ["a", "b", "c"]);
assert.deepStrictEqual(adjuster.stringArray().toArray().adjust("a")                             , ["a"]);
assert.deepStrictEqual(adjuster.stringArray().maxLength(1, true).adjust(["a", "b"])             , ["a"]);
assert.deepStrictEqual(adjuster.stringArray().ignoreEachErrors().adjust([undefined, "a", "", 1]), ["a", "1"]);
assert.deepStrictEqual(adjuster.stringArray().eachDefault("z").adjust(["a", undefined, "b"])    , ["a", "z", "b"]);
assert.deepStrictEqual(adjuster.stringArray().eachAllowEmpty("z").adjust(["a", "", "b"])        , ["a", "z", "b"]);
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

### IPv4

```javascript
import adjuster from "adjuster";
import assert from "assert";

// should be OK
assert.strictEqual(adjuster.ipv4().adjust("0.0.0.0")        , "0.0.0.0");
assert.strictEqual(adjuster.ipv4().adjust("192.168.0.1")    , "192.168.0.1");
assert.strictEqual(adjuster.ipv4().adjust("255.255.255.255"), "255.255.255.255");

// should cause errors; err.cause === adjuster.CAUSE.IPV4
assert.throws(() => adjuster.ipv4().adjust("0.0.0.")         , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.IPV4));
assert.throws(() => adjuster.ipv4().adjust("0.0.0.0.")       , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.IPV4));
assert.throws(() => adjuster.ipv4().adjust("255.255.255.256"), err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.IPV4));
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

// should cause errors; err.cause === adjuster.CAUSE.IPV6
assert.throws(() => adjuster.ipv6().adjust("0000")                                    , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.IPV6));
assert.throws(() => adjuster.ipv6().adjust("ffff:")                                   , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.IPV6));
assert.throws(() => adjuster.ipv6().adjust("0000:0000:0000:0000:0000:0000:0000:0000:"), err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.IPV6));
```

### e-mail

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

// should cause errors
assert.throws(() => adjuster.email().adjust("@example.com")           , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMAIL));
assert.throws(() => adjuster.email().adjust(".a@example.com")         , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMAIL));
assert.throws(() => adjuster.email().adjust("a.@example.com")         , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMAIL));
assert.throws(() => adjuster.email().adjust("a..a@example.com")       , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMAIL));
assert.throws(() => adjuster.email().adjust("user@example@com")       , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMAIL));
assert.throws(() => adjuster.email().adjust("user-example-com")       , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMAIL));
assert.throws(() => adjuster.email().adjust("user@example_domain.com"), err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMAIL));
assert.throws(() => adjuster.email().adjust("user@example.com2")      , err => (err.name === "AdjusterError" && err.cause === adjuster.CAUSE.EMAIL));
```

## Release notes

* **NEXT VERSION**
    * New Functions
        * `adjuster.numberArray()`
        * `adjuster.stringArray()`
    * Change Specifications
        * rename `adjuster.adjustData()` to `adjuster.adjust()`
        * throw first error when both `onError` and `onErrorAll` are null in `adjuster.adjust()`
    * Others
        * support [Visual Studio Code](https://code.visualstudio.com/) officially
* 2018/05/06 *version 0.4.0*
    * New Functions
        * `adjuster.ipv4()`
        * `adjuster.ipv6()`
    * Change Specifications
        * strict IPv4 and IPv6 validation for `adjuster.email()`
* 2018/04/22 *version 0.3.0*
    * Bugfixes
        * quoted-pair of email
        * import error in `EmailAdjuster.es`
    * Change Specifications
        * limit the length of local/domain part of email
* 2018/04/21 *version 0.2.0*
    * Bugfixes
        * test error on npm@5
    * Change Specifications
        * enable to specify value to `allowEmpty()`
        * support IPv6 domain for `EmailAdjuster`
* 2018/04/18 *version 0.1.0*
    * First release.
