import { Key, Values } from "../libs/types";
export interface Rules<T> {
    /** transformer function */
    transform?: (value: T, fail: () => never) => T;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export declare function applyTo<T>(values: Values, rules: Rules<T>, keyStack: Key[]): values is Values<T>;
