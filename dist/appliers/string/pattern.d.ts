import { Key, Values } from "../../libs/types";
export declare const PATTERN: {
    /** email address; compliant with RFC-5321/5322 */
    readonly EMAIL: RegExp;
    /** HTTP URI; compliant with RFC-3986 */
    readonly HTTP: RegExp;
    /** IPv4 format */
    readonly IPV4: RegExp;
    /** IPv6 format */
    readonly IPV6: RegExp;
    /** URI; compliant with RFC-3986 */
    readonly URI: RegExp;
    /** UUID format */
    readonly UUID: RegExp;
};
export interface Rules {
    /** acceptable pattern (regular expression) */
    pattern?: RegExp;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export declare function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<string>;
