import { BaseSchema } from "../schemaClasses/BaseSchema";
import { ArraySchema } from "../schemaClasses/ArraySchema";
import { ObjectSchema } from "../schemaClasses/ObjectSchema";
export type ObjectTypeOf<S extends SchemaObject> = {
    [K in keyof S]: S[K] extends ArraySchema<infer T> ? T[] : S[K] extends ArraySchema<infer T, null> ? T[] | null : S[K] extends ObjectSchema<infer S2> ? ObjectTypeOf<S2> : S[K] extends ObjectSchema<infer S2, null> ? ObjectTypeOf<S2> | null : S[K] extends BaseSchema<infer T> ? T : never;
};
type Scalar = boolean | number | string;
export type AnyObject = Record<string, unknown>;
export type SchemaObject = Record<string, BaseSchema>;
export type Key = string | number;
export interface Values<T = unknown> {
    readonly input: unknown;
    output: T;
}
/**
 * make input/output values pair
 * @param value input value
 * @returns pairs
 */
export declare function makeValues(value: unknown): Values;
/**
 * check whether given value is a scalar or not
 * @param value value to check
 * @returns Yes/No
 */
export declare function isScalar(value: unknown): value is Scalar;
/**
 * check whether given value is a boolean or not
 * @param value value to check
 * @returns Yes/No
 */
export declare function isBoolean(value: unknown): value is boolean;
/**
 * check whether given value is a number or not
 * @param value value to check
 * @returns Yes/No
 */
export declare function isNumber(value: unknown): value is number;
/**
 * check whether given value is an integer or not
 * @param value value to check
 * @returns Yes/No
 */
export declare function isInteger(value: number): value is number;
/**
 * check whether given value is a string or not
 * @param value value to check
 * @returns Yes/No
 */
export declare function isString(value: unknown): value is string;
/**
 * check whether given value is a numeric string or not
 * @param value value to check
 * @returns Yes/No
 */
export declare function isNumericString(value: unknown): value is string;
/**
 * check whether given value is an array or not
 * @param value value to check
 * @returns yes/no
 */
export declare function isArray(value: unknown): value is unknown[];
/**
 * check whether given value is an object or not
 * @param value value to check
 * @returns Yes/No
 */
export declare function isObject(value: unknown): value is AnyObject;
/**
 * check whether given value is an instance of Date or not
 * @param value value to check
 * @returns Yes/No
 */
export declare function isDate(value: unknown): value is Date;
/**
 * check whether given value is a valid Date or not
 * @param value value to check
 * @returns Yes/No
 */
export declare function isValidDate(value: Date): boolean;
export {};
