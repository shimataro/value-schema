import { Key, Values } from "../libs/types.ts";
import { RULE, ValueSchemaError } from "../libs/ValueSchemaError.ts";
export interface Options<T> {
    /** converter function */
    converter?: (value: T, fail: () => never) => T;
}
/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo<T>(values: Values, options: Options<T>, keyStack: Key[]): values is Values<T> {
    if (options.converter === undefined) {
        return false;
    }
    values.output = options.converter(values.output as T, () => {
        return ValueSchemaError.raise(RULE.CONVERTER, values, keyStack);
    });
    return true;
}
