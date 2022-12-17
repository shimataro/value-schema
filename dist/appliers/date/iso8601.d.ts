import { Key, Values } from "../../libs/types";
interface Iso8601 {
    /** default timezone when timezone is omitted from input value */
    defaultTimezone?: string;
}
export interface Rules {
    /** ISO8601 parameters */
    iso8601?: Iso8601;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export declare function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<Date>;
export {};
