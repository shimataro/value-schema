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
// expect(adjusted).toEqual(expected);
```

### number

```javascript
import adjuster from "adjuster";

// should be OK
adjuster.number().adjust(-123);          // === -123;
adjuster.number().in(1, 3, 5).adjust(1); // === 1

// should be adjusted
adjuster.number().adjust("-123");                  // === -123;
adjuster.number().default(10).adjust(undefined);   // === 10
adjuster.number().allowEmpty(123).adjust("");      // === 123
adjuster.number().minValue(1, true).adjust(0);     // === 1
adjuster.number().maxValue(100, true).adjust(101); // === 100

// should cause errors
adjuster.number().adjust(undefined);         // throws AdjusterError; err.cause === adjuster.CAUSE.REQUIRED
adjuster.number().adjust(undefined, (err) => { // ...or catch by callback function
    return 10; // returns a value from adjust() method
}); // === 10
adjuster.number().adjust("abc");             // throws AdjusterError; err.cause === adjuster.CAUSE.TYPE
adjuster.number().adjust("");                // throws AdjusterError; err.cause === adjuster.CAUSE.EMPTY
adjuster.number().in(1, 3, 5).adjust(2);     // throws AdjusterError; err.cause === adjuster.CAUSE.IN
adjuster.number().minValue(1).adjust(0);     // throws AdjusterError; err.cause === adjuster.CAUSE.MIN_VALUE
adjuster.number().maxValue(100).adjust(101); // throws AdjusterError; err.cause === adjuster.CAUSE.MAX_VALUE
```

### numberArray

```javascript
import adjuster from "adjuster";

// should be OK
adjuster.numberArray().adjust([1, 2, 3]);                       // === [1, 2, 3]
adjuster.numberArray().minLength(2).adjust([1, 2]);             // === [1, 2]
adjuster.numberArray().maxLength(2).adjust([1, 2]);             // === [1, 2]
adjuster.numberArray().eachIn(1, 2, 3).adjust([1, 2]);          // === [1, 2]
adjuster.numberArray().eachMinValue(10).adjust([10, 11, 12]);   // === [10, 11, 12]
adjuster.numberArray().eachMaxValue(10).adjust([8, 9, 10]);     // === [8, 9, 10]

// should be adjusted
adjuster.numberArray().adjust([1, "-2", "+3"]);                             // === [1, -2, 3]
adjuster.numberArray().default([1, 2]).adjust(undefined);                   // === [1, 2]
adjuster.numberArray().allowEmpty([1, 2]).adjust("");                       // === [1, 2]
adjuster.numberArray().separatedBy(",").adjust("1,2,3");                    // === [1, 2, 3]
adjuster.numberArray().toArray().adjust(0);                                 // === [0]
adjuster.numberArray().maxLength(2, true).adjust([1, 2, 3]);                // === [1, 2]
adjuster.numberArray().ignoreEachErrors().adjust([undefined, 1, "abc", 2]); // === [1, 2]
adjuster.numberArray().eachDefault(999).adjust([1, undefined, 3]);          // === [1, 999, 3]
adjuster.numberArray().eachAllowEmpty(999).adjust([1, "", 3]);              // === [1, 999, 3]
adjuster.numberArray().eachMinValue(10, true).adjust([9, 10, 11]);          // === [10, 10, 11]
adjuster.numberArray().eachMaxValue(10, true).adjust([9, 10, 11]);          // === [9, 10, 10]

// should cause errors
adjuster.numberArray().adjust("abc");                           // throws AdjusterError; err.cause === adjuster.CAUSE.TYPE
adjuster.numberArray().adjust(0);                               // throws AdjusterError; err.cause === adjuster.CAUSE.TYPE
adjuster.numberArray().adjust(undefined);                       // throws AdjusterError; err.cause === adjuster.CAUSE.REQUIRED
adjuster.numberArray().adjust("");                              // throws AdjusterError; err.cause === adjuster.CAUSE.EMPTY
adjuster.numberArray().minLength(2).adjust([1]);                // throws AdjusterError; err.cause === adjuster.CAUSE.MIN_LENGTH
adjuster.numberArray().maxLength(2).adjust([1, 2, 3]);          // throws AdjusterError; err.cause === adjuster.CAUSE.MAX_LENGTH
adjuster.numberArray().adjust(["abc"]);                         // throws AdjusterError; err.cause === adjuster.CAUSE.EACH_TYPE
adjuster.numberArray().adjust([1, undefined, 3]);               // throws AdjusterError; err.cause === adjuster.CAUSE.EACH_REQUIRED
adjuster.numberArray().adjust([""]);                            // throws AdjusterError; err.cause === adjuster.CAUSE.EACH_EMPTY
adjuster.numberArray().eachIn(1, 2, 3).adjust([0, 1]);          // throws AdjusterError; err.cause === adjuster.CAUSE.EACH_IN
adjuster.numberArray().eachMinValue(10).adjust([9, 10, 11]);    // throws AdjusterError; err.cause === adjuster.CAUSE.EACH_MIN_VALUE
adjuster.numberArray().eachMaxValue(10).adjust([9, 10, 11]);    // throws AdjusterError; err.cause === adjuster.CAUSE.EACH_MAX_VALUE
```

### string

```javascript
import adjuster from "adjuster";

// should be OK
adjuster.string().adjust("123");                              // === "123"
adjuster.string().allowEmpty("xyz").adjust("");               // === "xyz"
adjuster.string().in("eat", "sleep", "play").adjust("sleep"); // === "sleep"

// should be adjusted
adjuster.string().adjust(123);                          // === "123"
adjuster.string().default("xyz").adjust(undefined);     // === "xyz"
adjuster.string().maxLength(5, true).adjust("abcdefg"); // === "abcde"

// should cause errors
adjuster.string().adjust(undefined); // throws AdjusterError; err.cause === adjuster.CAUSE.REQUIRED
adjuster.string().adjust(""); // throws AdjusterError; err.cause === adjuster.CAUSE.EMPTY
adjuster.string().in("eat", "sleep", "play").adjust("study"); // throws AdjusterError; err.cause === adjuster.CAUSE.IN
adjuster.string().minLength(5).adjust("a"); // throws AdjusterError; err.cause === adjuster.CAUSE.MIN_LENGTH
adjuster.string().maxLength(5).adjust("abcdefg"); // throws AdjusterError; err.cause === adjuster.CAUSE.MAX_LENGTH
```

### stringArray

```javascript
import adjuster from "adjuster";

// should be OK
adjuster.stringArray().adjust(["a", "b"]);                          // === ["a", "b"]
adjuster.stringArray().minLength(1).adjust(["a"]);                  // === ["a"]
adjuster.stringArray().maxLength(2).adjust(["a"]);                  // === ["a"]
adjuster.stringArray().eachIn("a", "b").adjust(["a"]);              // === ["a"]
adjuster.stringArray().eachMinLength(3).adjust(["abc", "xyz"]);     // === ["abc", "xyz"]
adjuster.stringArray().eachMaxLength(3).adjust(["abc", "xyz"]);     // === ["abc", "xyz"]
adjuster.stringArray().eachPattern(/^Go+gle$/).adjust(["Google"]);  // === ["Google"]

// should be adjusted
adjuster.stringArray().adjust(["a", 1, -2]);                                // === ["a", "1", "-2"]
adjuster.stringArray().default(["a", "b"]).adjust(undefined);               // === ["a", "b"]
adjuster.stringArray().allowEmpty(["a", "b"]).adjust("");                   // === ["a", "b"]
adjuster.stringArray().separatedBy(",").adjust("a,b,c");                    // === ["a", "b", "c"]
adjuster.stringArray().toArray().adjust("a");                               // === ["a"]
adjuster.stringArray().maxLength(1, true).adjust(["a", "b"]);               // === ["a"]
adjuster.stringArray().ignoreEachErrors().adjust([undefined, "a", "", 1]);  // === ["a", "1"]
adjuster.stringArray().eachDefault("z").adjust(["a", undefined, "b"]);      // === ["a", "z", "b"]
adjuster.stringArray().eachAllowEmpty("z").adjust(["a", "", "b"]);          // === ["a", "z", "b"]
adjuster.stringArray().eachMaxLength(3, true).adjust(["abcd", "xyz0"]);     // === ["abc", "xyz"]

// should cause errors
adjuster.stringArray().adjust("abc");                               // throws AdjusterError; err.cause === adjuster.CAUSE.TYPE
adjuster.stringArray().adjust(undefined);                           // throws AdjusterError; err.cause === adjuster.CAUSE.REQUIRED
adjuster.stringArray().adjust("");                                  // throws AdjusterError; err.cause === adjuster.CAUSE.EMPTY
adjuster.stringArray().minLength(1).adjust([]);                     // throws AdjusterError; err.cause === adjuster.CAUSE.MIN_LENGTH
adjuster.stringArray().maxLength(1).adjust(["a", "b"]);             // throws AdjusterError; err.cause === adjuster.CAUSE.MAX_LENGTH
adjuster.stringArray().adjust(["a", undefined, "b"]);               // throws AdjusterError; err.cause === adjuster.CAUSE.EACH_REQUIRED
adjuster.stringArray().adjust([""]);                                // throws AdjusterError; err.cause === adjuster.CAUSE.EACH_EMPTY
adjuster.stringArray().eachIn("a", "b").adjust(["x"]);              // throws AdjusterError; err.cause === adjuster.CAUSE.EACH_IN
adjuster.stringArray().eachMinLength(3).adjust(["ab"]);             // throws AdjusterError; err.cause === adjuster.CAUSE.EACH_MIN_LENGTH
adjuster.stringArray().eachMaxLength(3).adjust(["abcd"]);           // throws AdjusterError; err.cause === adjuster.CAUSE.EACH_MAX_LENGTH
adjuster.stringArray().eachPattern(/^Go+gle$/).adjust(["Ggle"]);    // throws AdjusterError; err.cause === adjuster.CAUSE.EACH_PATTERN
```

### IPv4

```javascript
import adjuster from "adjuster";

// should be OK
adjuster.ipv4().adjust("0.0.0.0");          // === "0.0.0.0"
adjuster.ipv4().adjust("192.168.0.1");      // === "192.168.0.1"
adjuster.ipv4().adjust("255.255.255.255");  // === "255.255.255.255"

// should cause errors; err.cause === adjuster.CAUSE.IPV4
adjuster.ipv4().adjust("0.0.0.");
adjuster.ipv4().adjust("0.0.0.0.");
adjuster.ipv4().adjust("255.255.255.256");
```

### IPv6

```javascript
import adjuster from "adjuster";

// should be OK
adjuster.ipv6().adjust("0000:0000:0000:0000:0000:0000:0000:0000");  // === "0000:0000:0000:0000:0000:0000:0000:0000"
adjuster.ipv6().adjust("::1");                                      // === "::1"
adjuster.ipv6().adjust("::");                                       // === "::"
adjuster.ipv6().adjust("1::1");                                     // === "1::1"
adjuster.ipv6().adjust("::ffff:192.0.2.1");                         // === "::ffff:192.0.2.1"; IPv4-mapped address

// should cause errors; err.cause === adjuster.CAUSE.IPV6
adjuster.ipv6().adjust("0000");
adjuster.ipv6().adjust("ffff:");
adjuster.ipv6().adjust("0000:0000:0000:0000:0000:0000:0000:0000:");
```

### e-mail

```javascript
import adjuster from "adjuster";

// should be OK
adjuster.email().adjust("user+mailbox/department=shipping@example.com"); // === "user+mailbox/department=shipping@example.com"; dot-string
adjuster.email().adjust("!#$%&'*+-/=?^_`.{|}~@example.com");             // === "!#$%&'*+-/=?^_`.{|}~@example.com"; dot-string
adjuster.email().adjust("\"Fred\\\"Bloggs\"@example.com");               // === "\"Fred\\\"Bloggs\"@example.com"; quoted-string
adjuster.email().adjust("\"Joe.\\\\Blow\"@example.com");                 // === "\"Joe.\\\\Blow\"@example.com"; quoted-string
adjuster.email().adjust("user@example-domain.com");                      // === "user@example-domain.com"
adjuster.email().adjust("user@example2.com");                            // === "user@example2.com"

// should cause errors; err.cause === adjuster.CAUSE.EMAIL
adjuster.email().adjust("@example.com");
adjuster.email().adjust(".a@example.com");
adjuster.email().adjust("a.@example.com");
adjuster.email().adjust("a..a@example.com");
adjuster.email().adjust("user@example@com");
adjuster.email().adjust("user-example-com");
adjuster.email().adjust("user@example_domain.com");
adjuster.email().adjust("user@example.com2");
```

## Release notes

* **NEXT VERSION**
    * New Functions
        * `adjuster.numberArray()`
        * `adjuster.stringArray()`
    * Change Specifications
        * rename `adjuster.adjustData()` to `adjuster.adjust()`
        * throw first error when both `onError` and `onErrorAll` are null in `adjuster.adjust()`
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
