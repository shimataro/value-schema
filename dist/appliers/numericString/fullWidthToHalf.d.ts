import { Key, Values } from "../../libs/types";
export interface Rules {
    /** converts full width digit to half width */
    fullWidthToHalf?: boolean;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param _keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export declare function applyTo(values: Values, rules: Rules, _keyStack: Key[]): values is Values<string>;
