# number

## ambient declarations

```typescript
export function number(rules?: RulesForNumber): NumberSchema;

type RulesForNumber = {
    strictType?: boolean;
    acceptsSpecialFormats?: boolean;
    acceptsFullWidth?: boolean;

    ifUndefined?: number | null;
    ifEmptyString?: number | null;
    ifNull?: number | null;

    integer?: boolean | NUMBER.INTEGER;
    only?: number[];
    minValue?: number | {value: number, adjusts: boolean};
    maxValue?: number | {value: number, adjusts: boolean};

    converter?: (value: number, fail: () => never) => number;
}
type ErrorHandler = (err: ValueSchemaError) => number | null | never;
interface NumberSchema {
    applyTo(value: unknown, onError?: ErrorHandler): number | null
}
```

## `applyTo(value[, onError])`

Applies schema to `value`.

If an error occurs, this method calls `onError` (if specified) or throw `ValueSchemaError` (otherwise).

```javascript
// should be OK
assert.strictEqual(
    vs.number().applyTo(-123),
    -123);

// should be adjusted
assert.strictEqual(
    vs.number().applyTo("-123"),
    -123);
assert.strictEqual(
    vs.number().applyTo(true),
    1);
assert.strictEqual(
    vs.number().applyTo(false),
    0);

// should cause error
assert.strictEqual( // catch error by callback function (that returns a value from applyTo() method)
    vs.number().applyTo(
        "abc",
        (err) => 10),
    10);
assert.throws( // ... or try-catch syntax
    () => vs.number().applyTo("abc"),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
assert.throws(
    () => vs.number().applyTo("true"),
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
// should be adjusted
assert.strictEqual(
    vs.number().applyTo("123"),
    123);
assert.strictEqual(
    vs.number().applyTo(true),
    1);

// should cause error
assert.throws(
    () => vs.number({strictType: true}).applyTo("123"),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
assert.throws(
    () => vs.number({strictType: true}).applyTo(true),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
```

### `ifUndefined`

Specifies return value when input value is `undefined`.

**NOTE:** `{ifUndefined: undefined}` is NOT equivalent to `{}`. The former accepts `undefined` input value (and keeps it as-is), the latter doesn't.

```javascript
// should be adjusted
assert.strictEqual(
    vs.number({ifUndefined: 1}).applyTo(undefined),
    1);

// should cause error
assert.throws(
    () => vs.number().applyTo(undefined),
    {name: "ValueSchemaError", rule: vs.RULE.UNDEFINED});

// should accept `undefined` value
assert.strictEqual(
    vs.number({ifUndefined: undefined}).applyTo(undefined),
    undefined);
```

### `ifNull`

Specifies return value when input value is `null`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.number({ifNull: 1}).applyTo(null),
    1);

// should cause error
assert.throws(
    () => vs.number().applyTo(null),
    {name: "ValueSchemaError", rule: vs.RULE.NULL});
```

### `ifEmptyString`

Specifies return value when input value is `""`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.number({ifEmptyString: 1}).applyTo(""),
    1);

// should cause error
assert.throws(
    () => vs.number().applyTo(""),
    {name: "ValueSchemaError", rule: vs.RULE.EMPTY_STRING});
```

### `acceptsSpecialFormats`

Accepts all special number formats; e.g., `"1e+2"`, `"0x100"`, `"0o100"`, `"0b100"`.
**defaults: false**

```javascript
// should be adjusted
assert.strictEqual(
    vs.number({acceptsSpecialFormats: true}).applyTo("1e+2"),
    100);
assert.strictEqual(
    vs.number({acceptsSpecialFormats: true}).applyTo("0x100"),
    256);
assert.strictEqual(
    vs.number({acceptsSpecialFormats: true}).applyTo("0o100"),
    64);
assert.strictEqual(
    vs.number({acceptsSpecialFormats: true}).applyTo("0b100"),
    4);

// should cause error
assert.throws(
    () => vs.number().applyTo("1e+2"),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
```

### `acceptsFullWidth`

Accepts full-width string; e.g., `"１２３４．５"`, `"1２3４.５"`.
**defaults: false**

```javascript
// should be adjusted
assert.strictEqual(
    vs.number({acceptsFullWidth: true}).applyTo("１２３４．５"),
    1234.5);

// should cause error
assert.throws(
    () => vs.number().applyTo("１２３４．５"),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
```

### `integer`

Limits an input value to integer.

|value|description|
|-----|-----------|
|`NUMBER.INTEGER.NO` (`0`) / `false`|does not limit to integer|
|`NUMBER.INTEGER.YES` (`1`) / `true`|limits to integer, but does not round|
|`NUMBER.INTEGER.FLOOR` (`2`)|rounds towards −∞|
|`NUMBER.INTEGER.FLOOR_RZ` (`3`)|rounds towards 0|
|`NUMBER.INTEGER.CEIL` (`4`)|rounds towards +∞|
|`NUMBER.INTEGER.CEIL_RI` (`5`)|rounds towards ∞|
|`NUMBER.INTEGER.HALF_UP` (`6`)|rounds half towards +∞|
|`NUMBER.INTEGER.HALF_UP_RZ` (`7`)|rounds half towards 0|
|`NUMBER.INTEGER.HALF_DOWN` (`8`)|rounds half towards −∞|
|`NUMBER.INTEGER.HALF_DOWN_RZ` (`9`)|rounds half towards 0|

```javascript
// should be adjusted
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.FLOOR}).applyTo(3.14),
    3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.FLOOR}).applyTo("3.14"),
    3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.FLOOR}).applyTo(-3.14),
    -4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.FLOOR_RZ}).applyTo(3.14),
    3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.FLOOR_RZ}).applyTo(-3.14),
    -3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.CEIL}).applyTo(3.14),
    4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.CEIL}).applyTo(-3.14),
    -3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.CEIL_RI}).applyTo(3.14),
    4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.CEIL_RI}).applyTo(-3.14),
    -4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_UP}).applyTo(3.49),
    3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_UP}).applyTo(3.5),
    4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_UP}).applyTo(-3.5),
    -3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_UP}).applyTo(-3.51),
    -4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_UP_RZ}).applyTo(3.49),
    3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_UP_RZ}).applyTo(3.5),
    4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_UP_RZ}).applyTo(-3.49),
    -3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_UP_RZ}).applyTo(-3.5),
    -4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_DOWN}).applyTo(3.5),
    3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_DOWN}).applyTo(3.51),
    4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_DOWN}).applyTo(-3.49),
    -3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_DOWN}).applyTo(-3.5),
    -4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_DOWN_RZ}).applyTo(3.5),
    3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_DOWN_RZ}).applyTo(3.51),
    4);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_DOWN_RZ}).applyTo(-3.5),
    -3);
assert.strictEqual(
    vs.number({integer: vs.NUMBER.INTEGER.HALF_DOWN_RZ}).applyTo(-3.51),
    -4);

// should cause error
assert.throws(
    () => vs.number({integer: true}).applyTo(3.14),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
assert.throws(
    () => vs.number({integer: vs.NUMBER.INTEGER.YES}).applyTo(3.14), // equivalent to "true"
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
```

### `only`

Accepts only particular values.

```javascript
// should be OK
assert.strictEqual(
    vs.number({only: [1, 3, 5]}).applyTo(1),
    1);

// should cause error
assert.throws(
    () => vs.number({only: [1, 3, 5]}).applyTo(2),
    {name: "ValueSchemaError", rule: vs.RULE.ONLY});
```

### `minValue`

Limits minimum value.

```javascript
// should be adjusted
assert.strictEqual(
    vs.number({minValue: {value: 1, adjusts: true}}).applyTo(0),
    1);

// should cause errors
assert.throws(
    () => vs.number({minValue: {value: 1, adjusts: false}}).applyTo(0),
    {name: "ValueSchemaError", rule: vs.RULE.MIN_VALUE});
assert.throws(
    () => vs.number({minValue: 1}).applyTo(0), // shorthand of {value: 1, adjusts: false}
    {name: "ValueSchemaError", rule: vs.RULE.MIN_VALUE});
```

### `maxValue`

Limits maximum value.

```javascript
// should be adjusted
assert.strictEqual(
    vs.number({maxValue: {value: 100, adjusts: true}}).applyTo(101),
    100);

// should cause errors
assert.throws(
    () => vs.number({maxValue: {value: 100, adjusts: false}}).applyTo(101),
    {name: "ValueSchemaError", rule: vs.RULE.MAX_VALUE});
assert.throws(
    () => vs.number({maxValue: 100}).applyTo(101), // shorthand of {value: 100, adjusts: false}
    {name: "ValueSchemaError", rule: vs.RULE.MAX_VALUE});
```

### `converter`

Converts input value to another.

`fail()` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.number({converter: value => value * 2}).applyTo("1"),
    2);

// should cause errors
assert.throws(
    () => vs.number({converter: (value, fail) => fail()}).applyTo(0),
    {name: "ValueSchemaError", rule: vs.RULE.CONVERTER});
```
