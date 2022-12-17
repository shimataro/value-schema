import { Key, Values } from "../../libs/types";
export interface Rules {
    /** minimum length of string */
    minLength?: number;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export declare function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<string>;
