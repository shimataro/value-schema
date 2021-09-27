import { Key, Values, isString } from "../../libs/types.ts";
import { CAUSE, ValueSchemaError } from "../../libs/ValueSchemaError.ts";
export interface Options {
    /** minimum length of string */
    minLength?: number;
}
/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo(values: Values, options: Options, keyStack: Key[]): values is Values<string> {
    const normalizedOptions: Required<Options> = {
        minLength: 0,
        ...options
    };
    // istanbul ignore next
    if (!isString(values.output)) {
        return false;
    }
    if (values.output.length >= normalizedOptions.minLength) {
        return false;
    }
    return ValueSchemaError.raise(CAUSE.MIN_LENGTH, values, keyStack);
}
