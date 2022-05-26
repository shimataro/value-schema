import { Key, Values, isObject } from "../../libs/types.ts";
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
export function applyTo<T>(values: Values, rules: Rules, keyStack: Key[]): values is Values<T> // eslint-disable-line @typescript-eslint/no-unused-vars
 {
    if (isObject(values.output)) {
        // already object
        return false;
    }
    return ValueSchemaError.raise(RULE.TYPE, values, keyStack);
}
