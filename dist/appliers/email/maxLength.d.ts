import { Key, Values } from "../../libs/types";
export interface Rules {
}
/**
 * apply schema
 * @param values input/output values
 * @param _rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export declare function applyTo(values: Values, _rules: Rules, keyStack: Key[]): values is Values<string>;
