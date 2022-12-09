# date

Accepts below values and returns [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object.

* [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) extended-format
    * string type
    * always
    * in fact, not strict specification but SUBSET like following:
        * `2000-01-02T03:04:05.678Z`
        * `2000-01-02T03:04:05Z`
        * `2000-01-02T03:04Z`
* [unixtime](https://en.wikipedia.org/wiki/Unix_time)-format
    * number or number-like string type
    * optional

## ambient declarations

```typescript
export function date(rules?: RulesForDate): DateSchema;

type RulesForNumber = {
    iso8601?: {
        defaultTimezone?: string;
    },
    unixtime?: {
        strictType?: boolean;
        precision: UNIXTIME.PRECISION;
    },

    ifUndefined?: Date | null;
    ifEmptyString?: Date | null;
    ifNull?: Date | null;

    minValue?: Date | {value: Date, adjusts: boolean};
    maxValue?: Date | {value: Date, adjusts: boolean};

    converter?: (value: Date, fail: () => never) => Date;
}
type ErrorHandler = (err: ValueSchemaError) => Date | null | never;
interface DateSchema {
    applyTo(value: unknown, onError?: ErrorHandler): Date | null
}
```

## `applyTo(value[, onError])`

Applies schema to `value`.

If an error occurs, this method calls `onError` (if specified) or throw `ValueSchemaError` (otherwise).

```javascript
// should be OK
assert.deepStrictEqual(
    vs.date().applyTo("2000-01-02T03:04:05.678Z"), // accepts ISO8601-based string, and returns Date object
    new Date("2000-01-02T03:04:05.678Z"));
assert.deepStrictEqual(
    vs.date().applyTo("2000-01-02T03:04:05.678+09:00"), // timezone +09:00
    new Date("2000-01-01T18:04:05.678Z"));

assert.deepStrictEqual(
    vs.date().applyTo("2000-01-02T03:04:05Z"), // milliseconds can be omitted
    new Date("2000-01-02T03:04:05.000Z"));
assert.deepStrictEqual(
    vs.date().applyTo("2000-01-02T03:04Z"), // seconds can also be omitted
    new Date("2000-01-02T03:04:00.000Z"));

// should cause error
assert.deepStrictEqual( // catch error by callback function (that returns a value from applyTo() method)
    vs.date().applyTo(
        "abc",
        (err) => new Date("2000-01-02T03:04:05.678Z")),
    new Date("2000-01-02T03:04:05.678Z"));
assert.throws( // ... or try-catch syntax
    () => vs.date().applyTo("abc"),
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});

assert.throws(
    () => vs.date().applyTo("2000-01-02T03:04:05.678"), // timezone can NOT be omitted if default timezone is not specified
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
assert.throws(
    () => vs.date().applyTo(946782245678), // unixtime-based number can NOT be used by default
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
```

## rules

### `iso8601`

```javascript
// should be adjusted
assert.deepStrictEqual(
    vs.date({
        iso8601: {
            defaultTimezone: "Z", // optional; defaults ""
        },
    }).applyTo("2000-01-02T03:04:05.678"), // timezone can be omitted
    new Date("2000-01-02T03:04:05.678Z"));
assert.deepStrictEqual(
    vs.date({
        iso8601: {
            defaultTimezone: "Z",
        },
    }).applyTo("2000-01-02T03:04:05.678+09:00"), // timezone in input value will be prioritized over default timezone
    new Date("2000-01-01T18:04:05.678Z"));

// should cause error
assert.throws(
    () => vs.date({
        iso8601: {
            defaultTimezone: "",
        }
    }).applyTo("2000-01-02T03:04:05.678"), // timezone can NOT be omitted if default timezone is empty
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
```

### `unixtime`

Accept unixtime-based number or number-like string.
When this parameter is omitted, unixtime will not be accepted.

|value|description|
|-----|-----------|
|`DATE.UNIXTIME.PRECISION.MILLISECONDS`|milliseconds precision|
|`DATE.UNIXTIME.PRECISION.SECONDS`|seconds precision|
|`DATE.UNIXTIME.PRECISION.MINUTES`|minutes precision|

```javascript
// should be adjusted
assert.deepStrictEqual(
    vs.date({
        unixtime: {
            strictType: false, // optional; defaults false
            precision: vs.DATE.UNIXTIME.PRECISION.MILLISECONDS, // required
        },
    }).applyTo(946782245678),
    new Date("2000-01-02T03:04:05.678Z"));
assert.deepStrictEqual(
    vs.date({
        unixtime: {
            strictType: false,
            precision: vs.DATE.UNIXTIME.PRECISION.MILLISECONDS,
        },
    }).applyTo("946782245678"), // also accepts number-like string
    new Date("2000-01-02T03:04:05.678Z"));
assert.deepStrictEqual(
    vs.date({
        unixtime: {
            precision: vs.DATE.UNIXTIME.PRECISION.SECONDS, // seconds precision
        },
    }).applyTo(946782245),
    new Date("2000-01-02T03:04:05.000Z"));
assert.deepStrictEqual(
    vs.date({
        unixtime: {
            precision: vs.DATE.UNIXTIME.PRECISION.MINUTES, // minutes precision
        },
    }).applyTo(15779704),
    new Date("2000-01-02T03:04:00.000Z"));

// should cause error
assert.throws(
    () => vs.date({
        unixtime: {
            strictType: true, // accepts only number type
            precision: vs.DATE.UNIXTIME.PRECISION.MILLISECONDS,
        }
    }).applyTo("946782245678"),
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
```

### `ifUndefined`

Specifies return value when input value is `undefined`.

**NOTE:** `{ifUndefined: undefined}` is NOT equivalent to `{}`. The former accepts `undefined` input value (and keeps it as-is), the latter doesn't.

```javascript
// should be adjusted
assert.deepStrictEqual(
    vs.date({ifUndefined: new Date("2000-01-02T03:04:05.678Z")}).applyTo(undefined),
    new Date("2000-01-02T03:04:05.678Z"));

// should cause error
assert.throws(
    () => vs.date().applyTo(undefined),
    {name: "ValueSchemaError", rule: vs.RULE.UNDEFINED});

// should accept `undefined` value
assert.deepStrictEqual(
    vs.date({ifUndefined: undefined}).applyTo(undefined),
    undefined);
```

### `ifNull`

Specifies return value when input value is `null`.

```javascript
// should be adjusted
assert.deepStrictEqual(
    vs.date({ifNull: new Date("2000-01-02T03:04:05.678Z")}).applyTo(null),
    new Date("2000-01-02T03:04:05.678Z"));

// should cause error
assert.throws(
    () => vs.date().applyTo(null),
    {name: "ValueSchemaError", rule: vs.RULE.NULL});
```

### `ifEmptyString`

Specifies return value when input value is `""`.

```javascript
// should be adjusted
assert.deepStrictEqual(
    vs.date({ifEmptyString: new Date("2000-01-02T03:04:05.678Z")}).applyTo(""),
    new Date("2000-01-02T03:04:05.678Z"));

// should cause error
assert.throws(
    () => vs.date().applyTo(""),
    {name: "ValueSchemaError", rule: vs.RULE.EMPTY_STRING});
```

### `minValue`

Limits minimum value.

```javascript
// should be adjusted
assert.deepStrictEqual(
    vs.date({minValue: {value: new Date("2000-01-02T03:04:05.678Z"), adjusts: true}}).applyTo("2000-01-01T00:00:00.000Z"),
    new Date("2000-01-02T03:04:05.678Z"));

// should cause errors
assert.throws(
    () => vs.date({minValue: {value: new Date("2000-01-02T03:04:05.678Z"), adjusts: false}}).applyTo("2000-01-01T00:00:00.000Z"),
    {name: "ValueSchemaError", rule: vs.RULE.MIN_VALUE});
assert.throws(
    () => vs.date({minValue: new Date("2000-01-02T03:04:05.678Z")}).applyTo("2000-01-01T00:00:00.000Z"), // shorthand of {value: new Date("2000-01-02T03:04:05.678Z"), adjusts: false}
    {name: "ValueSchemaError", rule: vs.RULE.MIN_VALUE});
```

### `maxValue`

Limits maximum value.

```javascript
// should be adjusted
assert.deepStrictEqual(
    vs.date({maxValue: {value: new Date("2000-01-02T03:04:05.678Z"), adjusts: true}}).applyTo("2000-12-31T23:59:59.999Z"),
    new Date("2000-01-02T03:04:05.678Z"));

// should cause errors
assert.throws(
    () => vs.date({maxValue: {value: new Date("2000-01-02T03:04:05.678Z"), adjusts: false}}).applyTo("2000-12-31T23:59:59.999Z"),
    {name: "ValueSchemaError", rule: vs.RULE.MAX_VALUE});
assert.throws(
    () => vs.date({maxValue: new Date("2000-01-02T03:04:05.678Z")}).applyTo("2000-12-31T23:59:59.999Z"), // shorthand of {value: new Date("2000-01-02T03:04:05.678Z"), adjusts: false}
    {name: "ValueSchemaError", rule: vs.RULE.MAX_VALUE});
```

### `converter`

Converts input value to another.

`fail()` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.deepStrictEqual(
    vs.date({converter: value => new Date(value.getTime() + 1000)}).applyTo("2000-01-01T00:00:00.000Z"),
    new Date("2000-01-01T00:00:01.000Z"));

// should cause errors
assert.throws(
    () => vs.date({converter: (value, fail) => fail()}).applyTo("2000-01-01T00:00:00.000Z"),
    {name: "ValueSchemaError", rule: vs.RULE.CONVERTER});
```
