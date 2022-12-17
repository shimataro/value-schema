import { Key, Values } from "../../libs/types";
type MinValue = {
    /** minimum value */
    value: Date;
    /** true to adjust if input is less than "value" / false to error */
    adjusts: boolean;
};
type MinValueLike = Date | MinValue;
export interface Rules {
    /** minimum value (value or object) */
    minValue?: MinValueLike;
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
