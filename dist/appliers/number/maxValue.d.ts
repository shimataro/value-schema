import { Key, Values } from "../../libs/types";
type MaxValue = {
    /** maximum value */
    value: number;
    /** true to adjust if input is greater than "value" / false to error */
    adjusts: boolean;
};
type MaxValueLike = number | MaxValue;
export interface Rules {
    /** maximum value (value or object) */
    maxValue?: MaxValueLike;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export declare function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<number>;
export {};
