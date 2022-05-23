import { Key, Values, isBoolean, isNumber, isString } from "../../libs/types.ts";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.ts";
const REGEXP_TRUE = /^\s*(true|yes|on)\s*$/i;
const REGEXP_FALSE = /^\s*(false|no|off)\s*$/i;
export interface Options {
    /** does not convert type; causes error if type does not match */
    strictType?: boolean;
    /** accepts all number value not only 0 and 1 (0 means false, others true) */
    acceptsAllNumbers?: boolean;
}
/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo(values: Values, options: Options, keyStack: Key[]): values is Values<boolean> {
    const normalizedOptions: Required<Options> = {
        strictType: false,
        acceptsAllNumbers: false,
        ...options
    };
    if (isBoolean(values.output)) {
        // already boolean
        return true;
    }
    // not boolean
    if (normalizedOptions.strictType) {
        // strict type check
        ValueSchemaError.raise(RULE.TYPE, values, keyStack);
    }
    if (isString(values.output)) {
        // "true" is true, "false" is false
        if (REGEXP_TRUE.test(values.output)) {
            values.output = true;
            return true;
        }
        if (REGEXP_FALSE.test(values.output)) {
            values.output = false;
            return true;
        }
        // convert to number
        values.output = Number(values.output);
    }
    if (isNumber(values.output)) {
        if (values.output === 0 || values.output === 1 || normalizedOptions.acceptsAllNumbers) {
            values.output = Boolean(values.output);
            return true;
        }
    }
    return ValueSchemaError.raise(RULE.TYPE, values, keyStack);
}
