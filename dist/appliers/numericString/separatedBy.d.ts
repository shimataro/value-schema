import { Key, Values } from "../../libs/types";
export interface Rules {
    /** assumes input value is separated by pattern and ignores it */
    separatedBy?: string | RegExp;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param _keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export declare function applyTo(values: Values, rules: Rules, _keyStack: Key[]): values is Values<string>;
