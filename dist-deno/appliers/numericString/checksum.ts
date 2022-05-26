import { Key, Values, isString } from "../../libs/types.ts";
import { RULE, ValueSchemaError } from "../../libs/ValueSchemaError.ts";
export const CHECKSUM_ALGORITHM = {
    /** Luhn algorithm; used in credit card and IMEI (also known as MOD-10 algorithm) */
    LUHN: 0,
    /** checksum as credit card; equivalent to LUHN */
    CREDIT_CARD: 0,
    /** modulus10/weight3:1 algorithm; used in ISBN13, EAN and JAN */
    MODULUS10_WEIGHT3_1: 1,
    /** ISBN-13; equivalent to MODULUS10_WEIGHT3_1 */
    ISBN13: 1,
    /** EAN code; equivalent to MODULUS10_WEIGHT3_1 */
    EAN: 1,
    /** JAN code; equivalent to MODULUS10_WEIGHT3_1 */
    JAN: 1
} as const;
type CHECKSUM_ALGORITHM = typeof CHECKSUM_ALGORITHM[keyof typeof CHECKSUM_ALGORITHM];
export interface Rules {
    /** uses checksum */
    checksum?: CHECKSUM_ALGORITHM;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<string> {
    if (rules.checksum === undefined) {
        return false;
    }
    // istanbul ignore next
    if (!isString(values.output)) {
        return false;
    }
    if (check(values.output, rules.checksum)) {
        return false;
    }
    return ValueSchemaError.raise(RULE.CHECKSUM, values, keyStack);
}
/**
 * check string
 * @param value value to check
 * @param algorithm check algorithm
 * @returns OK/NG
 */
function check(value: string, algorithm: CHECKSUM_ALGORITHM): boolean {
    switch (algorithm) {
        case CHECKSUM_ALGORITHM.LUHN:
            return checkLuhn(value);
        case CHECKSUM_ALGORITHM.MODULUS10_WEIGHT3_1:
            return checkModulus10Weight31(value);
        default:
            return false;
    }
}
/**
 * check by Luhn algorithm (used by credit card)
 * @param value value to check
 * @returns OK/NG
 */
function checkLuhn(value: string): boolean {
    const { length } = value;
    let sum = 0;
    for (let index = length - 1; index >= 0; index -= 2) {
        // odd columns
        sum += Number(value[index]);
    }
    for (let index = length - 2; index >= 0; index -= 2) {
        // even columns
        const num = Number(value[index]) * 2;
        sum += num % 10;
        sum += Math.floor(num / 10);
    }
    return sum % 10 === 0;
}
/**
 * check by Modulus 10 / Weight 3:1 algorithm (used by ISBN/EAN/JAN)
 * @param value value to check
 * @returns OK/NG
 */
function checkModulus10Weight31(value: string): boolean {
    const { length } = value;
    let sum = 0;
    for (let index = 0; index < length - 1; index += 2) {
        sum += Number(value[index]);
    }
    for (let index = 1; index < length - 1; index += 2) {
        sum += Number(value[index]) * 3;
    }
    const mod = sum % 10;
    return (10 - mod) % 10 === Number(value[length - 1]);
}
