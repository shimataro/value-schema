# numeric string

## ambient declarations

```typescript
export function numericString(rules?: RulesForNumericString): NumericStringSchema;

type RulesForNumericString = {
    ifUndefined?: string | null;
    ifEmptyString?: string | null;
    ifNull?: string | null;

    fullWidthToHalf?: boolean;
    joinsArray?: boolean;

    minLength?: number;
    maxLength?: number | {length: number, trims: boolean};
    separatedBy?: string | RegExp;
    pattern?: RegExp;
    checksum?: NUMERIC_STRING.CHECKSUM_ALGORITHM;

    converter?: (value: string, fail: () => never) => string;
}
type ErrorHandler = (err: ValueSchemaError) => string | null | never;
interface NumericStringSchema {
    applyTo(value: unknown, onError?: ErrorHandler): string | null
}
```

## `applyTo(value[, onError])`

Applies schema to `value`.

If an error occurs, this method calls `onError` (if specified) or throw `ValueSchemaError` (otherwise).

```javascript
// should be OK
assert.strictEqual(
    vs.numericString().applyTo("123"),
    "123");

// should be adjusted
assert.strictEqual(
    vs.numericString().applyTo(123),
    "123");

// should cause error
assert.throws(
    () => vs.numericString().applyTo("abc"),
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
```

## rules

### `ifUndefined`

Specifies return value when input value is `undefined`.

**NOTE:** `{ifUndefined: undefined}` is NOT equivalent to `{}`. The former accepts `undefined` input value (and keeps it as-is), the latter doesn't.

```javascript
// should be adjusted
assert.strictEqual(
    vs.numericString({ifUndefined: "123"}).applyTo(undefined),
    "123");

// should cause error
assert.throws(
    () => vs.numericString().applyTo(undefined),
    {name: "ValueSchemaError", rule: vs.RULE.UNDEFINED});

// should accept `undefined` value
assert.strictEqual(
    vs.numericString({ifUndefined: undefined}).applyTo(undefined),
    undefined);
```

### `ifNull`

Specifies return value when input value is `null`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.numericString({ifNull: "456"}).applyTo(null),
    "456");

// should cause error
assert.throws(
    () => vs.numericString().applyTo(null),
    {name: "ValueSchemaError", rule: vs.RULE.NULL});
```

### `ifEmptyString`

Specifies return value when input value is `""`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.numericString({ifEmptyString: "456"}).applyTo(""),
    "456");

// should cause error
assert.throws(
    () => vs.numericString().applyTo(""),
    {name: "ValueSchemaError", rule: vs.RULE.EMPTY_STRING});
```

### `separatedBy`

Assumes an input value is separated by delimiter, and ignore them.

```javascript
// should be adjusted
assert.strictEqual(
    vs.numericString({separatedBy: "-"}).applyTo("4111-1111-1111-1111"),
    "4111111111111111");

// should cause error
assert.throws(
    () => vs.numericString().applyTo("4111-1111-1111-1111"),
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
```

### `fullWidthToHalf`

Converts full-width string to half-width; e.g., `"１２３４"`.
**defaults: false**

```javascript
// should be adjusted
assert.strictEqual(
    vs.numericString({fullWidthToHalf: true}).applyTo("１２３４"),
    "1234");

// should cause error
assert.throws(
    () => vs.numericString().applyTo("１２３４"),
    {name: "ValueSchemaError", rule: vs.RULE.PATTERN});
```

### `joinsArray`

Assumes an input value is array, and join them.
**defaults: false**

This method is useful for the following form.

```html
<!-- "cc_number" will be passed in array -->
<form>
    Input credit card number:
    <input name="cc_number" required />
    -
    <input name="cc_number" required />
    -
    <input name="cc_number" required />
    -
    <input name="cc_number" required />
</form>
```

```javascript
// should be adjusted
assert.strictEqual(
    vs.numericString({joinsArray: true}).applyTo(["1234", "5678"]),
    "12345678");

// should cause error
assert.throws(
    () => vs.numericString().applyTo(["1234", "5678"]),
    {name: "ValueSchemaError", rule: vs.RULE.TYPE});
```

### `minLength`

Limits minimum length of input string.

```javascript
// should be OK
assert.strictEqual(
    vs.numericString({minLength: 4}).applyTo("1234"),
    "1234");

// should cause error
assert.throws(
    () => vs.numericString({minLength: 5}).applyTo("1234"),
    {name: "ValueSchemaError", rule: vs.RULE.MIN_LENGTH});
```

### `maxLength`

Limits maximum length of an input string.

```javascript
// should be OK
assert.strictEqual(
    vs.numericString({maxLength: {length: 4, trims: false}}).applyTo("1234"),
    "1234");

// should be adjusted
assert.strictEqual(
    vs.numericString({maxLength: {length: 5, trims: true}, separatedBy: "-"}).applyTo("1234-5678"),
    "12345");

// should cause error
assert.throws(
    () => vs.numericString({maxLength: {length: 5, trims: false}}).applyTo("123456"),
    {name: "ValueSchemaError", rule: vs.RULE.MAX_LENGTH});
assert.throws(
    () => vs.numericString({maxLength: 5}).applyTo("123456"), // shorthand of {length: 5, trims: false}
    {name: "ValueSchemaError", rule: vs.RULE.MAX_LENGTH});
```

### `checksum`

Checks input value by specified algorithm.

|algorithm name|explanation|used by|constant|aliases|
|--------------|-----------|-------|--------|-------|
|`"luhn"`|[Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm)|credit card|`NUMERIC_STRING.CHECKSUM_ALGORITHM.LUHN`|`NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD`|
|`"modulus10/weight3:1"`|[Modulus 10 / Weight 3:1](https://en.wikipedia.org/wiki/International_Standard_Book_Number#ISBN-13_check_digit_calculation)|ISBN-13, EAN, JAN|`NUMERIC_STRING.CHECKSUM_ALGORITHM.MODULUS10_WEIGHT3_1`|`NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13` / `NUMERIC_STRING.CHECKSUM_ALGORITHM.EAN` / `NUMERIC_STRING.CHECKSUM_ALGORITHM.JAN`|

```javascript
// should be OK
assert.strictEqual(
    vs.numericString({checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.LUHN}).applyTo("4111111111111111"),
    "4111111111111111");
assert.strictEqual(
    vs.numericString({checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD}).applyTo("4111111111111111"), // alias of LUHN
    "4111111111111111");
assert.strictEqual(
    vs.numericString({checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.MODULUS10_WEIGHT3_1}).applyTo("9784101092058"),
    "9784101092058");
assert.strictEqual(
    vs.numericString({checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13}).applyTo("9784101092058"), // alias of MODULUS10_WEIGHT3_1
    "9784101092058");
assert.strictEqual(
    vs.numericString({checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.EAN}).applyTo("9784101092058"), // alias of MODULUS10_WEIGHT3_1
    "9784101092058");
assert.strictEqual(
    vs.numericString({checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.JAN}).applyTo("9784101092058"), // alias of MODULUS10_WEIGHT3_1
    "9784101092058");

// should cause error
assert.throws(
    () => vs.numericString({checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.LUHN}).applyTo("4111111111111112"),
    {name: "ValueSchemaError", rule: vs.RULE.CHECKSUM});
```

### `converter`

Converts input value to another.

`fail()` causes `ValueSchemaError`.

```javascript
// should be adjusted
assert.strictEqual(
    vs.numericString({converter: value => value.padStart(8, "0")}).applyTo("1234"),
    "00001234");

// should cause errors
assert.throws(
    () => vs.numericString({converter: (value, fail) => fail()}).applyTo("1234"),
    {name: "ValueSchemaError", rule: vs.RULE.CONVERTER});
```
