# enumeration

Return type of `applyTo()` can be limited to enum-like type; `enum` and union.
**This is useful for TypeScript**.

## ambient declarations

```typescript
export function enumeration<E = never>(rules: RulesForEnumeration): EnumerationSchema<E>;

type RulesForEnumeration = {
    ifUndefined?: string | null;
    ifEmptyString?: string | null;
    ifNull?: string | null;

    only: E[]; // this is NOT an optional.
}
type ErrorHandler = (err: ValueSchemaError) => E | null | never;
interface EnumerationSchema {
    applyTo(value: unknown, onError?: ErrorHandler): E | null
}
```

## `applyTo(value[, onError])`

Applies schema to `value`.

If an error occurs, this method calls `onError` (if specified) or throw `ValueSchemaError` (otherwise).

See example of `only`.

## rules

### `only`

Accepts only particular values.
This is NOT an optional.

```typescript
// enum version
enum NumberEnum
{
    zero,
    one,
}
enum StringEnum
{
    a = "a",
    b = "b",
}

// should be OK
{
    // pattern 1: enum that contains number elements
    const val: NumberEnum = vs.enumeration({only: [NumberEnum.zero, NumberEnum.one]}).applyTo(1);
    assert.strictEqual(val, 1);
}
{
    // pattern 2: enum that contains only string elements
    const val: StringEnum = vs.enumeration({only: Object.values(StringEnum)}).applyTo("a");
    assert.strictEqual(val, "a");
}

// should cause error
assert.throws(
    () => vs.enumeration({only: Object.values(StringEnum)}).applyTo("c"),
    {name: "ValueSchemaError", rule: vs.RULE.ONLY});
```

```typescript
// union version
type NumberUnion = 0 | 1;
type StringUnion = "a" | "b";

// should be OK
{
    // you can use "as const" for union type
    const val: NumberUnion = vs.enumeration({only: [0, 1] as const}).applyTo(1);
    assert.strictEqual(val, 1);
}
{
    // you can also use "<Type>"
    const val: StringEnum = vs.enumeration<StringUnion>({only: ["a", "b"]}).applyTo("a");
    assert.strictEqual(val, "a");
}

// should cause error
assert.throws(
    () => vs.enumeratino({only: ["a", "b"] as const}).applyTo("c"),
    {name: "ValueSchemaError", rule: vs.RULE.ONLY});
```

CAUTION: In union version, `only` must be "array of literal union types", "const-asserted array", or "array literal with generics".

```typescript
type NumberUnion = 0 | 1;

// OK
{
    // array of literal union types
    const val: NumberUnion = vs.enumeration({only: [0, 1] as NumberUnion[]}).applyTo(1);
}
{
    // const-asserted array
    const val: NumberUnion = vs.enumeration({only: [0, 1] as const}).applyTo(1);
}
{
    // array literal with generics
    const val: NumberUnion = vs.enumeration<NumberUnion>({only: [0, 1]}).applyTo(1);
}

// NG (compile error)
{
    // TS2322: Type 'number' is not assignable to type 'NumberUnion'.
    const val: NumberUnion = vs.enumeration({only: [0, 1]}).applyTo(1); // number
}
{
    const only = [0, 1]; // number[]
    const val: NumberUnion = vs.enumeration({only: only}).applyTo(1);
}
{
    const only = [0, 1]; // number[]
    const val: NumberUnion = vs.enumeration<NumberUnion>({only: only}).applyTo(1);
}
```

### `ifUndefined`

Specifies return value when input value is `undefined`.

**NOTE:** `{ifUndefined: undefined}` is NOT equivalent to `{}`. The former accepts `undefined` input value (and keeps it as-is), the latter doesn't.

```typescript
enum StringEnum
{
    a = "a",
    b = "b",
}

// should be adjusted
assert.strictEqual(
    vs.enumeration({ifUndefined: StringEnum.a, only: Object.values(StringEnum)}).applyTo(undefined),
    "a");

// should cause error
assert.throws(
    () => vs.enumeration({only: Object.values(StringEnum)}).applyTo(undefined),
    {name: "ValueSchemaError", rule: vs.RULE.UNDEFINED});

// should accept `undefined` value
assert.strictEqual(
    vs.enumeration({ifUndefined: undefined, only: Object.values(StringEnum)}).applyTo(undefined),
    undefined);
```

### `ifNull`

Specifies return value when input value is `null`.

```typescript
enum StringEnum
{
    a = "a",
    b = "b",
}

// should be adjusted
assert.strictEqual(
    vs.enumeration({ifNull: StringEnum.a, only: Object.values(StringEnum)}).applyTo(null),
    "a");

// should cause error
assert.throws(
    () => vs.enumeration({only: Object.values(StringEnum)}).applyTo(null),
    {name: "ValueSchemaError", rule: vs.RULE.NULL});
```

### `ifEmptyString`

Specifies return value when input value is `""`.

```typescript
enum StringEnum
{
    a = "a",
    b = "b",
}

// should be adjusted
assert.strictEqual(
    vs.enumeration({ifEmptyString: StringEnum.a, only: Object.values(StringEnum)}).applyTo(""),
    "a");

// should cause error
assert.throws(
    () => vs.enumeration({only: Object.values(StringEnum)}).applyTo(""),
    {name: "ValueSchemaError", rule: vs.RULE.EMPTY_STRING});
```
