import { Key, Values } from "../../libs/types";
type MaxLength = {
    /** maximum size of array */
    length: number;
    /** removes trailing elements if too long */
    trims: boolean;
};
type MaxLengthLike = number | MaxLength;
export interface Rules {
    /** maximum size of array */
    maxLength?: MaxLengthLike;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export declare function applyTo<T>(values: Values, rules: Rules, keyStack: Key[]): values is Values<T>;
export {};
