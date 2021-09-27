import { Key, Values, isArray, isString } from "../../libs/types.ts";
import { CAUSE, ValueSchemaError } from "../../libs/ValueSchemaError.ts";
export interface Options {
    /** assumes entire values are in one string separated by pattern */
    separatedBy?: string | RegExp;
    /** makes array that has 1 element if input value is not an array */
    toArray?: boolean;
}
/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo<T>(values: Values, options: Options, keyStack: Key[]): values is Values<T> {
    if (isArray(values.output)) {
        // already array
        return false;
    }
    if (isString(values.output) && options.separatedBy !== undefined) {
        values.output = values.output.split(options.separatedBy);
        return false;
    }
    if (options.toArray !== undefined && options.toArray) {
        values.output = [values.output];
        return false;
    }
    return ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
}
