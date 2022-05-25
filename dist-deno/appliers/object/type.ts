import { Key, Values, isObject } from "../../libs/types.ts";
import { CAUSE, ValueSchemaError } from "../../libs/ValueSchemaError.ts";
export interface Options {
}
/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo<T>(values: Values, options: Options, keyStack: Key[]): values is Values<T> // eslint-disable-line @typescript-eslint/no-unused-vars
 {
    if (isObject(values.output)) {
        // already object
        return false;
    }
    return ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
}
