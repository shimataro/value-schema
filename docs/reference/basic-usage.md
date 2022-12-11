# basic usage

## `applySchemaObject(schemaObject, input[, onError[, onFinishWithError]])`

apply `schemaObject` to `data`.

### `data`

An object to be applied schema; e.g., `req.query`, `req.body` (in [Express](http://expressjs.com/))

`data` will **NOT** be overwritten.

### `schemaObject`

Schema object.

* key: property name of `data`
* value: schema instance; see below examples

### `onError(err)`

Callback function for each errors.
If no errors, this function will not be called.

If this parameter is omitted, `applySchemaObject()` throws `ValueSchemaError` on first error and remaining adjusting process will be cancelled.

* `err`
    * an instance of `ValueSchemaError`
    * `err.keyStack` indicates path to key name that caused error: `(string | number)[]`
* returns
    * an adjuted value
* throws
    * an exception that will thrown from `applySchemaObject()`
    * remaining processes will be cancelled

### `onFinishWithError()`

Will be called after finish with error.
Will **NOT** called if no errors.

### examples

#### successful

For more information, see below references about [`number()`](./number.md), [`string()`](./string.md), and so on.

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

In TypeScript, type inference and auto-completion work perfectly!

#### error handling 1

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

const actual = vs.applySchemaObject(schemaObject, input, (err) => {
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

#### error handling 2

throw exception after finished with error

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
    vs.applySchemaObject(schemaObject, input, (err) => {
        // append key name
        const key = err.keyStack.shift();
        if(key !== undefined) {
            messages.push(key);
        }
    }, () => {
        // finish with error; join key name as message
        throw Error(messages.sort().join(","));
    });
}, {
    name: "Error",
    message: "id,name",
});
```

#### error handling 3

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
    vs.applySchemaObject(schemaObject, input);
}, {
    name: "ValueSchemaError",
    rule: vs.RULE.MIN_VALUE,
    value: 0,
    keyStack: ["id"],
});
```

#### error handling 4

when input value is not an object

NOTE: `schemaObject` won't be checked because it's predictable; generated by programmer, not an external input

```javascript
import vs from "value-schema";
import assert from "assert";

const schemaObject = {};
const input = 123;

assert.throws(() => {
    // `input` must be an object
    vs.applySchemaObject(schemaObject, input);
}, {
    name: "ValueSchemaError",
    rule: vs.RULE.TYPE,
    value: 123,
    keyStack: [],
});
```
