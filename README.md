node-adjuster
===

validate and adjust input values

## How to use

install by npm.
```bash
npm install -S adjuster
```

### number

```javascript
import adjuster from "adjuster";

// should be OK
adjuster.number().adjust("-123");        // === -123;
adjuster.number().in(1, 3, 5).adjust(1); // === 1

// should be adjusted
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

### string

```javascript
import adjuster from "adjuster";

// should be OK
adjuster.string().adjust(123);                                // === "123"
adjuster.string().allowEmpty("xyz").adjust("");               // === "xyz"
adjuster.string().in("eat", "sleep", "play").adjust("sleep"); // === "sleep"

// should be adjusted
adjuster.string().default("xyz").adjust(undefined);     // === "xyz"
adjuster.string().maxLength(5, true).adjust("abcdefg"); // === "abcde"

// should cause errors
adjuster.string().adjust(undefined); // throws AdjusterError; err.cause === adjuster.CAUSE.REQUIRED
adjuster.string().adjust(""); // throws AdjusterError; err.cause === adjuster.CAUSE.EMPTY
adjuster.string().in("eat", "sleep", "play").adjust("study"); // throws AdjusterError; err.cause === adjuster.CAUSE.IN
adjuster.string().minLength(5).adjust("a"); // throws AdjusterError; err.cause === adjuster.CAUSE.MIN_LENGTH
adjuster.string().maxLength(5).adjust("abcdefg"); // throws AdjusterError; err.cause === adjuster.CAUSE.MAX_LENGTH
```

### e-mail

```javascript
import adjuster from "adjuster";

// should be OK
adjuster.email().adjust("user+mailbox/department=shipping@example.com"); // dot-string
adjuster.email().adjust("!#$%&'*+-/=?^_`.{|}~@example.com");             // dot-string
adjuster.email().adjust("\"Fred\\\"Bloggs\"@example.com");               // quoted-string
adjuster.email().adjust("\"Joe.\\\\Blow\"@example.com");                 // quoted-string
adjuster.email().adjust("user@example-domain.com");
adjuster.email().adjust("user@example2.com");

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

### multiple data

```javascript
import adjuster from "adjuster";

const inputData = {
    id: "1",
    name: "Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Ciprin Cipriano de la Santísima Trinidad Ruiz y Picasso",
    email: "picasso@example.com",
    state: "active",
    limit: "0",
};
const adjusters = {
    id: adjuster.number().minValue(1),
    name: adjuster.string().maxLength(16, true),
    email: adjuster.email(),
    state: adjuster.string().in("active", "inactive"),
    limit: adjuster.number().default(10).minValue(1, true).maxValue(100, true),
    offset: adjuster.number().default(0).minValue(0, true),
};
const expected = {
    id: 1,
    name: "Pablo Diego José",
    email: "picasso@example.com",
    state: "active",
    limit: 1,
    offset: 0,
};

const adjusted = adjuster.adjustData(inputData, adjusters);
// expect(adjusted).toEqual(expected);
```

## Release notes

* 2018/04/18 *version 0.1.0*
    * First release.
