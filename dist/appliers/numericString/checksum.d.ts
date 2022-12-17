import { Key, Values } from "../../libs/types";
export declare const CHECKSUM_ALGORITHM: {
    /** Luhn algorithm; used in credit card and IMEI (also known as MOD-10 algorithm) */
    readonly LUHN: 0;
    /** checksum as credit card; equivalent to LUHN */
    readonly CREDIT_CARD: 0;
    /** modulus10/weight3:1 algorithm; used in ISBN13, EAN and JAN */
    readonly MODULUS10_WEIGHT3_1: 1;
    /** ISBN-13; equivalent to MODULUS10_WEIGHT3_1 */
    readonly ISBN13: 1;
    /** EAN code; equivalent to MODULUS10_WEIGHT3_1 */
    readonly EAN: 1;
    /** JAN code; equivalent to MODULUS10_WEIGHT3_1 */
    readonly JAN: 1;
};
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
export declare function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<string>;
export {};
