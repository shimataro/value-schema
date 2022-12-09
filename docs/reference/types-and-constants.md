# types and constants

## `ValueSchemaError`

The `ValueSchemaError` object represents an error.

### ambient declaration

```typescript
export interface ValueSchemaError extends Error
{
    name: string
    message: string
    rule: string
    value: any
    keyStack: (string | number)[]

    /**
     * check whether error is instance of ValueSchemaError or not
     * @param err error to check
     * @returns Yes/No
     */
    static is(err: unknown): err is ValueSchemaError;
}
```

### properties

|name|description|
|----|-----------|
|`name`|`"ValueSchemaError"`|
|`message`|human-readable description of the error, including a string `rule`|
|`rule`|the rule that input value didn't satisfy; see [`RULE`](#rule)|
|`value`|value to apply|
|`keyStack`|array consists of path to key name(for object) or index(for array) that caused error; for nested object or array|

See below example.
For detail about schema / `value-schema`, see [basic usage](./basic-usage.md)

```javascript
import vs from "value-schema";
import assert from "assert";

// {foo: Array<{bar: {baz: number}}>}
const schemaObject = {
    foo: vs.array({
        each: vs.object({
            schemaObject: {
                bar: vs.object({
                    schemaObject: {
                        baz: vs.number(),
                    },
                }),
            },
        }),
    }),
};
const input = {
    foo: [
        {
            bar: {
                baz: 1,
            },
        },
        {
            bar: {
                baz: 2,
            },
        },
        { // index 2
            bar: {
                baz: "three", // ERROR!
            },
        },
        {
            bar: {
                baz: 4,
            },
        },
    ],
};
assert.throws(
    () => {
        vs.applySchemaObject(schemaObject, input);
    },
    {
        name: "ValueSchemaError",
        rule: vs.RULE.TYPE,
        keyStack: ["foo", 2, "bar", "baz"], // route to error key/index: object(key="foo") -> array(index=2) -> object(key="bar") -> object(key="baz")
    });
```

## `RULE`

The rule that input value didn't satisfy.

For more information, see below examples.

## `NUMBER.INTEGER`

Rounding mode.

For more information, see [number](./number.md).

## `NUMERIC_STRING.CHECKSUM_ALGORITHM`

Checksum algorithms for numeric string.

For more information, see [numeric string](./numeric-string.md).

## `STRING.PATTERN`

Regular expressions for string.

For more information, see [string](./string.md).

## `DATE.UNIXTIME.PRECISION`

Precisions for unixtime.

For more information, see [date](./date.md).
