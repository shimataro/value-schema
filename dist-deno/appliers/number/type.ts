import { Key, Values, isInteger, isNumber, isScalar, isString } from "../../libs/types.ts";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.ts";
const REGEXP_NUMBER = /^\s*[+-]?(\d+(\.\d*)?|\.\d+)\s*$/;
const REGEXP_INTEGER = /^\s*[+-]?\d+\s*$/;
export const INTEGER = {
    /** does not care */
    NO: 0,
    /** must be integer; causes error if otherwise */
    YES: 1,
    /** rounds down (towards minus infinity) */
    FLOOR: 2,
    /** rounds towards 0 (away from infinity) */
    FLOOR_RZ: 3,
    /** rounds up (towards plus infinity) */
    CEIL: 4,
    /** rounds away from 0 (towards infinity) */
    CEIL_RI: 5,
    /** rounds half up (towards positive infinity) */
    HALF_UP: 6,
    /** rounds half towards zero (away from infinity) */
    HALF_UP_RZ: 7,
    /** rounds half down (towards negative infinity) */
    HALF_DOWN: 8,
    /** rounds half away from zero (towards infinity) */
    HALF_DOWN_RZ: 9
} as const;
type INTEGER = typeof INTEGER[keyof typeof INTEGER];
type IntegerLike = boolean | INTEGER;
export interface Rules {
    /** does not convert type; causes error if type does not match */
    strictType?: boolean;
    /** accepts string with special format; e.g., "1e+2", "0x100" */
    acceptsSpecialFormats?: boolean;
    /** needs integer */
    integer?: IntegerLike;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<number> {
    const normalizedRules: Required<Rules> = {
        strictType: false,
        acceptsSpecialFormats: false,
        integer: false,
        ...rules
    };
    if (isString(values.output)) {
        if (!checkNumberFormat(normalizedRules, values.output)) {
            ValueSchemaError.raise(RULE.TYPE, values, keyStack);
        }
    }
    const adjustedValue = toNumber(normalizedRules, values.output);
    if (adjustedValue === false) {
        ValueSchemaError.raise(RULE.TYPE, values, keyStack);
    }
    values.output = adjustedValue;
    return false;
}
/**
 * check the format of value
 * @param rules rules
 * @param value value to check
 * @returns OK/NG
 */
function checkNumberFormat(rules: Required<Rules>, value: string): boolean {
    const re = getRegExpForNumber(rules);
    if (re === null) {
        return true;
    }
    return re.test(value);
}
/**
 * get RegExp pattern for number
 * @param rules rules
 * @returns regular expression pattern
 */
function getRegExpForNumber(rules: Required<Rules>): RegExp | null {
    if (rules.acceptsSpecialFormats) {
        return null;
    }
    if (rules.integer === true || rules.integer === INTEGER.YES) {
        // integer
        return REGEXP_INTEGER;
    }
    // number
    return REGEXP_NUMBER;
}
/**
 * convert to number
 * @param rules rules
 * @param value value to convert
 * @returns converted value or false(if failed)
 */
function toNumber(rules: Required<Rules>, value: unknown): number | false {
    // strict type check
    if (!isNumber(value) && rules.strictType) {
        return false;
    }
    if (!isScalar(value)) {
        // not a scalar value
        return false;
    }
    const convertedValue = Number(value);
    if (!isNumber(convertedValue)) {
        // failed to cast
        return false;
    }
    if (rules.integer === false || rules.integer === INTEGER.NO) {
        return convertedValue;
    }
    // already integer
    if (isInteger(convertedValue)) {
        return convertedValue;
    }
    if (rules.integer === true || rules.integer === INTEGER.YES) {
        // not an integer and no round-off
        return false;
    }
    return round(convertedValue, rules.integer);
}
/**
 * round a value
 * @param value value to round
 * @param method round method
 * @returns rounded value
 */
function round(value: number, method: INTEGER): number | false {
    if (value >= 0) {
        switch (method) {
            case INTEGER.FLOOR:
            case INTEGER.FLOOR_RZ:
                return Math.floor(value);
            case INTEGER.CEIL:
            case INTEGER.CEIL_RI:
                return Math.ceil(value);
            case INTEGER.HALF_UP:
            case INTEGER.HALF_UP_RZ:
                return Math.floor(value + 0.5);
            case INTEGER.HALF_DOWN:
            case INTEGER.HALF_DOWN_RZ:
                return Math.ceil(value - 0.5);
        }
    }
    else {
        switch (method) {
            case INTEGER.FLOOR:
            case INTEGER.CEIL_RI:
                return Math.floor(value);
            case INTEGER.FLOOR_RZ:
            case INTEGER.CEIL:
                return Math.ceil(value);
            case INTEGER.HALF_UP:
            case INTEGER.HALF_DOWN_RZ:
                return Math.floor(value + 0.5);
            case INTEGER.HALF_UP_RZ:
            case INTEGER.HALF_DOWN:
                return Math.ceil(value - 0.5);
        }
    }
    return false;
}
