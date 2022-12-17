import { Key, Values } from "../../libs/types";
import { BaseSchema } from "../../schemaClasses/BaseSchema";
type Each<T> = {
    /** specifies schema of each elements */
    schema: BaseSchema<T>;
    /** ignores even if some elements cause error */
    ignoresErrors: boolean;
};
type EachLike<T> = BaseSchema<T> | Each<T>;
export interface Rules<T> {
    /** specifies schema of each elements */
    each?: EachLike<T>;
}
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export declare function applyTo<T>(values: Values, rules: Rules<T>, keyStack: Key[]): values is Values<T[]>;
export {};
