import { Key, Values, isString } from "../../libs/types.ts";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.ts";
const REGEXP = /^\d+$/;
export interface Rules {
}
/**
 * apply schema
 * @param values input/output values
 * @param _rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, _rules: Rules, keyStack: Key[]): values is Values<string> {
    // istanbul ignore next
    if (!isString(values.output)) {
        return false;
    }
    if (REGEXP.test(values.output)) {
        return false;
    }
    return ValueSchemaError.raise(RULE.PATTERN, values, keyStack);
}
