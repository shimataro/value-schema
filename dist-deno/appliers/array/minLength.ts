import { Key, Values, isArray } from "../../libs/types.ts";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.ts";
export interface Rules {
    /** minimum size of array */
    minLength?: number;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo<T>(values: Values, rules: Rules, keyStack: Key[]): values is Values<T> {
    const normalizedRules: Required<Rules> = {
        minLength: 0,
        ...rules
    };
    // istanbul ignore next
    if (!isArray(values.output)) {
        return false;
    }
    if (values.output.length >= normalizedRules.minLength) {
        return false;
    }
    return ValueSchemaError.raise(RULE.MIN_LENGTH, values, keyStack);
}
