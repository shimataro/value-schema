# object

## ambient declarations

```typescript
export function object(rules?: RulesForObject): ObjectSchema;

type RulesForObject = {
    ifUndefined?: object | null;
    ifEmptyString?: object | null;
    ifNull?: object | null;

    schemaObject?: Record<string, BaseSchema>;

    converter?: (values: object, fail: () => never) => object;
}
type ErrorHandler = (err: ValueSchemaError) => object | null | never;
interface ObjectSchema {
    applyTo(value: unknown, onError?: ErrorHandler): object | null
}
```

## `applyTo(value[, onError])`

Applies schema to `value`.

If an error occurs, this method calls `onError` (if specified) or throw `ValueSchemaError` (otherwise).

```javascript
// should be OK
assert.deepStrictEqual(
    vs.object().applyTo({a: 1, b: 2}),
    {a: 1, b: 2});

// should cause error
assert.throws(
    () => vs.object().applyTo("abc"),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
assert.throws(
    () => vs.object().applyTo(0),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
```

## rules

### `ifUndefined`

Specifies return value when input value is `undefined`.

**NOTE:** `{ifUndefined: undefined}` is NOT equivalent to `{}`. The former accepts `undefined` input value (and keeps it as-is), the latter doesn't.

```javascript
// should be adjusted
assert.deepStrictEqual(
    vs.object({ifUndefined: {a: 1, b: 2}}).applyTo(undefined),
    {a: 1, b: 2});

// should cause error
assert.throws(
    () => vs.object().applyTo(undefined),
    {name: "ValueSchemaError", rule: vs.RULE.UNDEFINED});

// should accept `undefined` value
assert.strictEqual(
    vs.object({ifUndefined: undefined}).applyTo(undefined),
    undefined);
```

### `ifNull`

Specifies return value when input value is `null`.

```javascript
// should be adjusted
assert.deepStrictEqual(
    vs.object({ifNull: {a: 1, b: 2}}).applyTo(null),
    {a: 1, b: 2});

// should cause error
assert.throws(
    () => vs.object().applyTo(null),
    {name: "ValueSchemaError", rule: vs.RULE.NULL});
```

### `ifEmptyString`

Specifies return value when input value is `""`.

```javascript
// should be adjusted
assert.deepStrictEqual(
    vs.object({ifEmptyString: {a: 1, b: 2}}).applyTo(""),
    {a: 1, b: 2});

// should cause error
assert.throws(
    () => vs.object().applyTo(""),
    {name: "ValueSchemaError", rule: vs.RULE.EMPTY_STRING});
```

### `schemaObject`

Applies `schemaObject` to input value.

```javascript
// should be OK
const schemaObject = {a: vs.number(), b: vs.string()};
assert.deepStrictEqual(
    vs.object({schemaObject}).applyTo({a: 1, b: "2"}),
    {a: 1, b: "2"});

// should be adjusted
assert.deepStrictEqual(
    vs.object({schemaObject}).applyTo({a: 1, b: 2}),
    {a: 1, b: "2"});

// should cause error
assert.throws(
    () => vs.object({schemaObject}).applyTo({a: "x", b: "2"}),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
```

### `converter`

Converts input value to another.

`fail()` causes `ValueSchemaError`.

Below example uses [case](https://www.npmjs.com/package/case) package.

```javascript
// should be adjusted
function keysToCamel(values) {
    return Object.entries(values).reduce((prev, [key, value]) => {
        return {
            ...prev,
            [Case.camel(key)]: value,
        };
    }, {});
}
const input = {
    "first name": "John",
    "last-name": "Doe",
    "credit_card": "4111111111111111",
};
const output = {
    firstName: "John",
    lastName: "Doe",
    creditCard: "4111111111111111",
}
assert.deepStrictEqual(
    vs.object({converter: keysToCamel}).applyTo(input),
    output);

// should cause errors
assert.throws(
    () => vs.object({converter: (value, fail) => fail()}).applyTo({}),
    {name: "ValueSchemaError", rule: vs.RULE.CONVERTER});
```
