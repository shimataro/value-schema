# boolean

## ambient declarations

```typescript
export function boolean(rules?: RulesForBoolean): BooleanSchema;

type RulesForBoolean = {
    strictType?: boolean;
    acceptsAllNumbers?: boolean;

    ifUndefined?: boolean | null;
    ifEmptyString?: boolean | null;
    ifNull?: boolean | null;
}
type ErrorHandler = (err: ValueSchemaError) => boolean | null | never;
interface BooleanSchema {
    applyTo(value: unknown, onError?: ErrorHandler): boolean | null
}
```

## `applyTo(value[, onError])`

Applies schema to `value`.

If an error occurs, this method calls `onError` (if specified) or throw `ValueSchemaError` (otherwise).

```javascript
// should be OK
assert.strictEqual(
    vs.boolean().applyTo(true),
    true);
assert.strictEqual(
    vs.boolean().applyTo(false),
    false);

// should be adjusted
assert.strictEqual(
    vs.boolean().applyTo(1),
    true);
assert.strictEqual(
    vs.boolean().applyTo(0),
    false);
assert.strictEqual(
    vs.boolean().applyTo("1"),
    true);
assert.strictEqual(
    vs.boolean().applyTo("0"), // "0" is truthy in JavaScript, but value-schema treats as false!
    false);

// other truthy values
for (const truthy of ["true", "TRUE", "yes", "YES", "on", "ON"]) {
    assert.strictEqual(
        vs.boolean().applyTo(truthy),
        true);
}
// other falsy values
for (const falsy of ["false", "FALSE", "no", "NO", "off", "OFF"]) {
    assert.strictEqual(
        vs.boolean().applyTo(falsy),
        false);
}

// should cause error
assert.throws(
    () => vs.boolean().applyTo(-1), // accepts only 0,1
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
assert.throws(
    () => vs.boolean().applyTo("abc"),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
assert.throws(
    () => vs.boolean().applyTo([]),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
assert.throws(
    () => vs.boolean().applyTo({}),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
```

## rules

### `strictType`

Enable strict type check.
**defaults: false**

**HANDLE WITH CARE!**
In URL encoding, all values will be treated as string.
Use this method when your system accepts **ONLY** JSON encoding (`application/json`)

```javascript
// should cause error
assert.throws(
    () => vs.boolean({strictType: true}).applyTo(1),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
assert.throws(
    () => vs.boolean({strictType: true}).applyTo("1"),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
assert.throws(
    () => vs.boolean({strictType: true}).applyTo("true"),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
```

### `acceptsAllNumbers`

Accepts all numbers or not, other than 0 / 1.
**defaults: false**

```javascript
// should be adjusted
assert.strictEqual(
    vs.boolean({acceptsAllNumbers: true}).applyTo(-1),
    true);
assert.strictEqual(
    vs.boolean({acceptsAllNumbers: true}).applyTo("100"),
    true);
```

### `ifUndefined`

Specifies return value when input value is `undefined`.

**NOTE:** `{ifUndefined: undefined}` is NOT equivalent to `{}`. The former accepts `undefined` input value (and keeps it as-is), the latter doesn't.

```javascript
// should be adjusted
assert.strictEqual(
    vs.boolean({ifUndefined: true}).applyTo(undefined),
    true);

// should cause error
assert.throws(
    () => vs.boolean().applyTo(undefined),
    {name: "ValueSchemaError", rule: vs.RULE.UNDEFINED});

// should accept `undefined` value
assert.strictEqual(
    vs.boolean({ifUndefined: undefined}).applyTo(undefined),
    undefined);
```

### `ifNull`

Specifies return value when input value is `null`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.boolean({ifNull: true}).applyTo(null),
    true);

// should cause error
assert.throws(
    () => vs.boolean().applyTo(null),
    {name: "ValueSchemaError", rule: vs.RULE.NULL});
```

### `ifEmptyString`

Specifies return value when input value is `""`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.boolean({ifEmptyString: true}).applyTo(""),
    true);

// should cause error
assert.throws(
    () => vs.boolean().applyTo(""),
    {name: "ValueSchemaError", rule: vs.RULE.EMPTY_STRING});
```
