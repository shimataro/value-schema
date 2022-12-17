import { Key, Values } from "../../libs/types";
type MaxLength = {
    /** maximum length of string */
    length: number;
    /** removes trailing characters if too long */
    trims: boolean;
};
type MaxLengthLike = number | MaxLength;
export interface Rules {
    /** maximum length of string */
    maxLength?: MaxLengthLike;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export declare function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<string>;
export {};
