# email

## ambient declarations

```typescript
export function email(rules?: RulesForEmail): EmailSchema;

type RulesForEmail = {
    ifUndefined?: string | null;
    ifEmptyString?: string | null;
    ifNull?: string | null;

    trims?: boolean;
    pattern?: RegExp;
}
type ErrorHandler = (err: ValueSchemaError) => string | null | never;
interface EmailSchema {
    applyTo(value: unknown, onError?: ErrorHandler): string | null
}
```

## `applyTo(value[, onError])`

Applies schema to `value`.

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
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
assert.throws(
    () => vs.email().applyTo(".a@example.com"),
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
assert.throws(
    () => vs.email().applyTo("a.@example.com"),
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
assert.throws(
    () => vs.email().applyTo("a..a@example.com"),
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
assert.throws(
    () => vs.email().applyTo("user@example@com"),
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
assert.throws(
    () => vs.email().applyTo("user-example-com"),
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
assert.throws(
    () => vs.email().applyTo("user@example_domain.com"),
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
assert.throws(
    () => vs.email().applyTo("user@example.com2"),
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
```

## rules

### `ifUndefined`

Specifies return value when input value is `undefined`.

**NOTE:** `{ifUndefined: undefined}` is NOT equivalent to `{}`. The former accepts `undefined` input value (and keeps it as-is), the latter doesn't.

```javascript
// should be adjusted
assert.strictEqual(
    vs.email({ifUndefined: "user@example.com"}).applyTo(undefined),
    "user@example.com");

// should cause error
assert.throws(
    () => vs.email().applyTo(undefined),
    {name: "ValueSchemaError", rule: vs.RULE.UNDEFINED});

// should accept `undefined` value
assert.strictEqual(
    vs.email({ifUndefined: undefined}).applyTo(undefined),
    undefined);
```

### `ifNull`

Specifies return value when input value is `null`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.email({ifNull: "user@example.com"}).applyTo(null),
    "user@example.com");

// should cause error
assert.throws(
    () => vs.email().applyTo(null),
    {name: "ValueSchemaError", rule: vs.RULE.NULL});
```

### `ifEmptyString`

Specifies return value when input value is `""`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.email({ifEmptyString: "user@example.com"}).applyTo(""),
    "user@example.com");

// should cause error
assert.throws(
    () => vs.email().applyTo(""),
    {name: "ValueSchemaError", rule: vs.RULE.EMPTY_STRING});
```

### `trims`

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
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
assert.throws(
    () => vs.email({trims: true}).applyTo(" \t\r\n "),
    {name: "ValueSchemaError", rule: vs.RULE.EMPTY_STRING});
```

### `pattern`

Specifies acceptable pattern by regular expression.

```javascript
// should be OK
assert.strictEqual(
    vs.email({pattern: /^[\w\.]+@([\w\-]+\.)+\w+$/}).applyTo("......@example.com"), // accept leading/trailing/consecutively dots
    "......@example.com");

// should cause errors
assert.throws(
    () => vs.email().applyTo("......@example.com"),
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
```
