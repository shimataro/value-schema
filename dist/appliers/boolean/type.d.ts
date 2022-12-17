import { Key, Values } from "../../libs/types";
export interface Rules {
    /** does not convert type; causes error if type does not match */
    strictType?: boolean;
    /** accepts all number value not only 0 and 1 (0 means false, others true) */
    acceptsAllNumbers?: boolean;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export declare function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<boolean>;
