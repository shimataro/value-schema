import { isString, Key, Values } from "../../libs/types.ts";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.ts";
export interface Rules {
    /** minimum length of string */
    minLength?: number;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<string> {
    const normalizedRules: Required<Rules> = {
        minLength: 0,
        ...rules
    };
    // istanbul ignore next
    if (!isString(values.output)) {
        return false;
    }
    if (values.output.length >= normalizedRules.minLength) {
        return false;
    }
    return ValueSchemaError.raise(RULE.MIN_LENGTH, values, keyStack);
}
