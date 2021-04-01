import { Key, Values } from "../libs/types.ts";
import { CAUSE, ValueSchemaError } from "../libs/ValueSchemaError.ts";
export interface Options<T> {
    /** value if empty string (defaults: error) */
    ifEmptyString?: T | null;
}
/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo<T>(values: Values, options: Options<T>, keyStack: Key[]): values is Values<T> {
    if (values.output !== "") {
        return false;
    }
    if (options.ifEmptyString !== undefined) {
        values.output = options.ifEmptyString;
        return true;
    }
    return ValueSchemaError.raise(CAUSE.EMPTY_STRING, values, keyStack);
}
