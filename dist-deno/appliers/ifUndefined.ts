import { Key, Values } from "../libs/types.ts";
import { RULE, ValueSchemaError } from "../libs/ValueSchemaError.ts";
export interface Rules<T> {
    /** value if undefined (defaults: error) */
    ifUndefined?: T | null;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo<T>(values: Values, rules: Rules<T>, keyStack: Key[]): values is Values<T> {
    if (values.output !== undefined) {
        return false;
    }
    if (rules.ifUndefined !== undefined) {
        values.output = rules.ifUndefined;
        return true;
    }
    return ValueSchemaError.raise(RULE.UNDEFINED, values, keyStack);
}
