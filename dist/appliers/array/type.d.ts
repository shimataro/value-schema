import { Key, Values } from "../../libs/types";
export interface Rules {
    /** assumes entire values are in one string separated by pattern */
    separatedBy?: string | RegExp;
    /** makes array that has 1 element if input value is not an array */
    toArray?: boolean;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export declare function applyTo<T>(values: Values, rules: Rules, keyStack: Key[]): values is Values<T>;
