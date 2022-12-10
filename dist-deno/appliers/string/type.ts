import { isScalar, isString, Key, Values } from "../../libs/types.ts";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.ts";
export interface Rules {
    /** does not convert type; causes error if type does not match */
    strictType?: boolean;
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
        strictType: false,
        ...rules
    };
    if (isString(values.output)) {
        return false;
    }
    // strict type check
    if (normalizedRules.strictType) {
        ValueSchemaError.raise(RULE.TYPE, values, keyStack);
    }
    // non-scalar value cannot be converted to string
    if (!isScalar(values.output)) {
        ValueSchemaError.raise(RULE.TYPE, values, keyStack);
    }
    values.output = String(values.output);
    return false;
}
