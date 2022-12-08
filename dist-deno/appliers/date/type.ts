import { Key, Values, isDate, isValidDate } from "../../libs/types.ts";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.ts";
export interface Rules {
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<Date> {
    if (!isDate(values.output)) {
        // could not convert to Date
        return ValueSchemaError.raise(RULE.TYPE, values, keyStack);
    }
    if (!isValidDate(values.output)) {
        // could convert to Date, but invalid.
        // mostly, the format is wrong.
        return ValueSchemaError.raise(RULE.PATTERN, values, keyStack);
    }
    // copy value
    values.output = new Date(values.output);
    return false;
}
