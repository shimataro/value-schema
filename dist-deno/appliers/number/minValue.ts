import { Key, Values, isNumber } from "../../libs/types.ts";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.ts";
type MinValue = {
    /** minimum value */
    value: number;
    /** true to adjust if input is less than "value" / false to error */
    adjusts: boolean;
};
type MinValueLike = number | MinValue;
export interface Rules {
    /** minimum value (value or object) */
    minValue?: MinValueLike;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<number> {
    const minValue = normalizeRules(rules.minValue);
    // istanbul ignore next
    if (!isNumber(values.output)) {
        return false;
    }
    if (values.output >= minValue.value) {
        return false;
    }
    if (minValue.adjusts) {
        values.output = minValue.value;
        return false;
    }
    return ValueSchemaError.raise(RULE.MIN_VALUE, values, keyStack);
}
/**
 * normalize rules
 * @param minValue minimum value
 * @returns normalized rules
 */
function normalizeRules(minValue?: MinValueLike): MinValue {
    const defaultRules: MinValue = {
        value: Number.MIN_SAFE_INTEGER,
        adjusts: false
    };
    if (minValue === undefined) {
        return defaultRules;
    }
    if (isNumber(minValue)) {
        return {
            ...defaultRules,
            value: minValue
        };
    }
    return {
        ...defaultRules,
        ...minValue
    };
}
