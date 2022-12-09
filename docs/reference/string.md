# string

## ambient declarations

```typescript
export function string(rules?: RulesForString): StringSchema;

type RulesForString = {
    strictType?: boolean;

    ifUndefined?: string | null;
    ifEmptyString?: string | null;
    ifNull?: string | null;

    trims?: boolean;

    only?: string[];
    minLength?: number;
    maxLength?: number | {length: number, trims: boolean};
    pattern?: RegExp;

    converter?: (value: string, fail: () => never) => string;
}
type ErrorHandler = (err: ValueSchemaError) => string | null | never;
interface StringSchema {
    applyTo(value: unknown, onError?: ErrorHandler): string | null
}
```

## `applyTo(value[, onError])`

Applies schema to `value`.

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
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
```

## rules

### `strictType`

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
    () => vs.string({strictType: true}).applyTo(123),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
assert.throws(
    () => vs.string({strictType: true}).applyTo(true),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
```

### `ifUndefined`

Specifies return value when input value is `undefined`.

**NOTE:** `{ifUndefined: undefined}` is NOT equivalent to `{}`. The former accepts `undefined` input value (and keeps it as-is), the latter doesn't.

```javascript
// should be adjusted
assert.strictEqual(
    vs.string({ifUndefined: "xyz"}).applyTo(undefined),
    "xyz");

// should cause error
assert.throws(
    () => vs.string().applyTo(undefined),
    {name: "ValueSchemaError", rule: vs.RULE.UNDEFINED});

// should accept `undefined` value
assert.strictEqual(
    vs.string({ifUndefined: undefined}).applyTo(undefined),
    undefined);
```

### `ifNull`

Specifies return value when input value is `null`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.string({ifNull: "x"}).applyTo(null),
    "x");

// should cause error
assert.throws(
    () => vs.string().applyTo(null),
    {name: "ValueSchemaError", rule: vs.RULE.NULL});
```

### `ifEmptyString`

Specifies return value when input value is `undefined`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.string({ifEmptyString: "xyz"}).applyTo(""),
    "xyz");

// should cause error
assert.throws(
    () => vs.string().applyTo(""),
    {name: "ValueSchemaError", rule: vs.RULE.EMPTY_STRING});
```

### `trims`

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
    {name: "ValueSchemaError", rule: vs.RULE.EMPTY_STRING});
```

### `only`

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
    {name: "ValueSchemaError", rule: vs.RULE.ONLY});
```

### `minLength`

Limits minimum length of input string.

```javascript
// should be OK
assert.strictEqual(
    vs.string({minLength: 5}).applyTo("abcde"),
    "abcde");

// should cause error
assert.throws(
    () => vs.string({minLength: 5}).applyTo("a"),
    {name: "ValueSchemaError", rule: vs.RULE.MIN_LENGTH});
```

### `maxLength`

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
    {name: "ValueSchemaError", rule: vs.RULE.MAX_LENGTH});
assert.throws(
    () => vs.string({maxLength: 5}).applyTo("abcdefg"), // shorthand of {length: 5, trims: false}
    {name: "ValueSchemaError", rule: vs.RULE.MAX_LENGTH});
```

### `pattern`

Specifies acceptable pattern by regular expression.

You can also use `STRING.PATTERN` constants

|constant|explanation|
|--------|-----------|
|`STRING.PATTERN.EMAIL`|email address that follows [RFC5321](https://tools.ietf.org/html/rfc5321) / [RFC5322](https://tools.ietf.org/html/rfc5322)|
|`STRING.PATTERN.HTTP`|HTTP/HTTPS URL|
|`STRING.PATTERN.IPV4`|IPv4 address|
|`STRING.PATTERN.IPV6`|IPv6 address|
|`STRING.PATTERN.URI`|URI that follows [RFC3986](https://tools.ietf.org/html/rfc3986)|
|`STRING.PATTERN.UUID`|UUID|

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
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
assert.throws(
    () => vs.string({pattern: vs.STRING.PATTERN.URI}).applyTo("https://例.com/"),
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
```

### `converter`

Converts input value to another.

`fail()` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.string({converter: value => value.toLowerCase()}).applyTo("123ABCxyz"),
    "123abcxyz");

// should cause errors
assert.throws(
    () => vs.string({converter: (value, fail) => fail()}).applyTo("foo"),
    {name: "ValueSchemaError", rule: vs.RULE.CONVERTER});
```
