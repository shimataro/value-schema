import { Key, Values, isArray, isString } from "../../libs/types.ts";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.ts";
export interface Rules {
    /** assumes entire values are in one string separated by pattern */
    separatedBy?: string | RegExp;
    /** makes array that has 1 element if input value is not an array */
    toArray?: boolean;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo<T>(values: Values, rules: Rules, keyStack: Key[]): values is Values<T> {
    if (isArray(values.output)) {
        // already array
        return false;
    }
    if (isString(values.output) && rules.separatedBy !== undefined) {
        values.output = values.output.split(rules.separatedBy);
        return false;
    }
    if (rules.toArray !== undefined && rules.toArray) {
        values.output = [values.output];
        return false;
    }
    return ValueSchemaError.raise(RULE.TYPE, values, keyStack);
}
