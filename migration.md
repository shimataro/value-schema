# Migration Guide

This document describes breaking changes due to version up.

## v3 to v4

### behavior of `{ifUndefined: undefined}`

In v3, `{ifUndefined: undefined}` is equivalent to `{}`.
Both of them cause error if input value is `undefined`.

In v4, the former accepts `undefined` (and keeps it as-is), the latter doesn't.

```typescript
import vs from "value-schema";

const input = {};

// The below code throws an error in v3, but outputs `{foo: undefined}` in v4.
{
    const output = vs.applySchemaObject({
        foo: vs.number({
            ifUndefined: undefined,
        }),
    }, input);
    console.log(output);
}

// The below code throws an error in both versions.
{
    const output = vs.applySchemaObject({
        foo: vs.number({}),
    }, input);
    console.log(output);
}
```

#### how to migrate

* Replace `{ifUndefined: undefined}` with `{}`.

### rename `ValueSchemaError.prototype.cause` to `ValueSchemaError.prototype.rule`

[`Error.prototype.cause`](https://tc39.es/proposal-error-cause/) has come in ES2022.
It conflicts `ValueSchemaError.prototype.cause`, therefore `ValueSchemaError.prototype.cause` has been renamed to `ValueSchemaError.prototype.rule`, that means "the rule that input value didn't satisfy".

In addition, `CAUSE.foo` has been renamed to `RULE.foo`.

```typescript
// v3
import vs from "value-schema";

try {
    const input = {};
    const output = vs.applySchemaObject({
        foo: vs.number(),
    }, input);
}
catch (err) { // ValueSchemaError
    if (err.cause === vs.CAUSE.UNDEFINED) {
        console.error("undefined!");
    }
}
```

```typescript
// v4
import vs from "value-schema";

try {
    const input = {};
    const output = vs.applySchemaObject({
        foo: vs.number(),
    }, input);
}
catch (err) { // ValueSchemaError
    if (err.rule === vs.RULE.UNDEFINED) { // cause -> rule
        console.error("undefined!");
    }
}
```

#### for migration

* Replace `err.cause` with `err.rule`.
* Replace `vs.CAUSE` with `vs.RULE`.
