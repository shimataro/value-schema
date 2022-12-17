import { Key, Values } from "../libs/types";
export interface Rules<T> {
    /** accepts only specified values */
    only?: readonly T[];
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export declare function applyTo<T>(values: Values, rules: Rules<T>, keyStack: Key[]): values is Values<T>;