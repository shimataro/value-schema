import { Key, Values, isNumber, isString } from "../../libs/types.ts";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.ts";
type MaxLength = {
    /** maximum length of string */
    length: number;
    /** removes trailing characters if too long */
    trims: boolean;
};
type MaxLengthLike = number | MaxLength;
export interface Rules {
    /** maximum length of string */
    maxLength?: MaxLengthLike;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<string> {
    const maxLength = normalizeRules(rules.maxLength);
    // istanbul ignore next
    if (!isString(values.output)) {
        return false;
    }
    if (values.output.length <= maxLength.length) {
        return false;
    }
    if (maxLength.trims !== undefined && maxLength.trims) {
        values.output = values.output.substr(0, maxLength.length);
        return false;
    }
    return ValueSchemaError.raise(RULE.MAX_LENGTH, values, keyStack);
}
/**
 * normalize rules
 * @param maxLength maximum length
 * @returns normalized rules
 */
function normalizeRules(maxLength?: MaxLengthLike): MaxLength {
    const defaultRules: MaxLength = {
        length: Number.MAX_SAFE_INTEGER,
        trims: false
    };
    if (maxLength === undefined) {
        return defaultRules;
    }
    if (isNumber(maxLength)) {
        return {
            ...defaultRules,
            length: maxLength
        };
    }
    return {
        ...defaultRules,
        ...maxLength
    };
}
