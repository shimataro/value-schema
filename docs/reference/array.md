# array

## ambient declarations

```typescript
export function array<T>(rules?: RulesForArray<T>): ArraySchema;

type RulesForArray<T> = {
    ifUndefined?: T[] | null;
    ifEmptyString?: T[] | null;
    ifNull?: T[] | null;

    separatedBy?: string | RegExp;
    toArray?: boolean;
    minLength?: number;
    maxLength?: number | {length: number, trims: boolean};
    each?: BaseSchema<T> | {schema: BaseSchema<T>, ignoresErrors: boolean};

    converter?: (values: T[], fail: () => never) => T[];
}
type ErrorHandler<T> = (err: ValueSchemaError) => T[] | null | never;
interface ArraySchema<T> {
    applyTo(value: unknown, onError?: ErrorHandler): T[] | null
}
```

## `applyTo(value[, onError])`

Applies schema to `value`.

If an error occurs, this method calls `onError` (if specified) or throw `ValueSchemaError` (otherwise).

```javascript
// should be OK
assert.deepStrictEqual(
    vs.array().applyTo([1, "a"]),
    [1, "a"]);

// should cause error
assert.throws(
    () => vs.array().applyTo("abc"),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
assert.throws(
    () => vs.array().applyTo(0),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
```

## rules

### `ifUndefined`

Specifies return value when input value is `undefined`.

**NOTE:** `{ifUndefined: undefined}` is NOT equivalent to `{}`. The former accepts `undefined` input value (and keeps it as-is), the latter doesn't.

```javascript
// should be adjusted
assert.deepStrictEqual(
    vs.array({ifUndefined: [1, "a"]}).applyTo(undefined),
    [1, "a"]);

// should cause error
assert.throws(
    () => vs.array().applyTo(undefined),
    {name: "ValueSchemaError", rule: vs.RULE.UNDEFINED});

// should accept `undefined` value
assert.strictEqual(
    vs.array({ifUndefined: undefined}).applyTo(undefined),
    undefined);
```

### `ifNull`

Specifies return value when input value is `null`.

```javascript
// should be adjusted
assert.deepStrictEqual(
    vs.array({ifNull: [1, "a"]}).applyTo(null),
    [1, "a"]);

// should cause error
assert.throws(
    () => vs.array().applyTo(null),
    {name: "ValueSchemaError", rule: vs.RULE.NULL});
```

### `ifEmptyString`

Specifies return value when input value is `""`.

```javascript
// should be adjusted
assert.deepStrictEqual(
    vs.array({ifEmptyString: [1, "a"]}).applyTo(""),
    [1, "a"]);

// should cause error
assert.throws(
    () => vs.array().applyTo(""),
    {name: "ValueSchemaError", rule: vs.RULE.EMPTY_STRING});
```

### `separatedBy`

Assumes an input value is string and separated by delimiter.

If an input type is array, this option will be ignored.

```javascript
// should be OK
assert.deepStrictEqual(
    vs.array({separatedBy: ","}).applyTo([1, 2, 3]),
    [1, 2, 3]);

// should be adjusted
assert.deepStrictEqual(
    vs.array({separatedBy: ","}).applyTo("1,2,3"),
    ["1", "2", "3"]);

// should cause error
assert.throws(
    () => vs.array().applyTo("1,2,3"),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
```

### `toArray`

Converts an input value to array if not.
**defaults: false**

```javascript
// should be OK
assert.deepStrictEqual(
    vs.array({toArray: true}).applyTo([0]),
    [0]);

// should be adjusted
assert.deepStrictEqual(
    vs.array({toArray: true}).applyTo(0),
    [0]);

// should cause error
assert.throws(
    () => vs.array().applyTo(0),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
```

### `minLength`

Limits minimum length of input array.

```javascript
// should be OK
assert.deepStrictEqual(
    vs.array({minLength: 2}).applyTo([1, 2]),
    [1, 2]);

// should cause errors
assert.throws(
    () => vs.array({minLength: 2}).applyTo([1]),
    {name: "ValueSchemaError", rule: vs.RULE.MIN_LENGTH});
```

### `maxLength`

Limits maximum length of an input array.

```javascript
// should be OK
assert.deepStrictEqual(
    vs.array({maxLength: {length: 2, trims: false}}).applyTo([1, 2]),
    [1, 2]);

// should be adjusted
assert.deepStrictEqual(
    vs.array({maxLength: {length: 2, trims: true}}).applyTo([1, 2, 3]),
    [1, 2]);

// should cause error
assert.throws(
    () => vs.array({maxLength: {length: 2, trims: false}}).applyTo([1, 2, 3]),
    {name: "ValueSchemaError", rule: vs.RULE.MAX_LENGTH});
assert.throws(
    () => vs.array({maxLength: 2}).applyTo([1, 2, 3]), // shorthand of {length: 1, trims: false}
    {name: "ValueSchemaError", rule: vs.RULE.MAX_LENGTH});
```

### `each`

Apply schema for each elements.

```javascript
// should be adjusted
assert.deepStrictEqual(
    vs.array({each: {schema: vs.number(), ignoresErrors: true}}).applyTo([true, "abc", 2]),
    [1, 2]);

// should cause error
assert.throws(
    () => vs.array({each: {schema: vs.number(), ignoresErrors: false}}).applyTo([true, "abc", 2]),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
assert.throws(
    () => vs.array({each: vs.number()}).applyTo([true, "abc", 2]), // shorthand of {schema: vs.number(), ignoresErrors: false}
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
```

### `converter`

Converts input value to another.

`fail()` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.deepStrictEqual(
    vs.array({each: vs.number(), separatedBy: ",", converter: values => values.sort()}).applyTo("4,1,5,2"),
    [1, 2, 4, 5]);

// should cause errors
assert.throws(
    () => vs.array({converter: (value, fail) => fail()}).applyTo([]),
    {name: "ValueSchemaError", rule: vs.RULE.CONVERTER});
```
