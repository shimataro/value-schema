import {BaseSchema} from "../schemaClasses/BaseSchema";

import {ArraySchema} from "../schemaClasses/ArraySchema";
import {ObjectSchema} from "../schemaClasses/ObjectSchema";

export type ObjectTypeOf<S extends SchemaObject> = {
	[K in keyof S]:
		S[K] extends ArraySchema<infer T> ? T[] :
		S[K] extends ArraySchema<infer T, null> ? T[] | null :
		S[K] extends ObjectSchema<infer S2> ? ObjectTypeOf<S2> :
		S[K] extends ObjectSchema<infer S2, null> ? ObjectTypeOf<S2> | null :
		S[K] extends BaseSchema<boolean> ? boolean :
		S[K] extends BaseSchema<boolean | null> ? boolean | null :
		S[K] extends BaseSchema<number> ? number :
		S[K] extends BaseSchema<number | null> ? number | null :
		S[K] extends BaseSchema<string> ? string :
		S[K] extends BaseSchema<string | null> ? string | null :
		never
}

type Scalar = boolean | number | string;

export type AnyObject = Record<string, unknown>;
export type SchemaObject = Record<string, BaseSchema>

export type Key = string | number;

export interface Values<T = unknown>
{
	input: unknown;
	output: T;
}

/**
 * make input/output values pair
 * @param value input value
 * @returns pairs
 */
export function makeValues(value: unknown): Values
{
	return {
		input: value,
		output: value,
	};
}

/**
 * check whether given value is a scalar or not
 * @param value value to check
 * @returns Yes/No
 */
export function isScalar(value: unknown): value is Scalar
{
	return value === null || typeof value !== "object";
}

/**
 * check whether given value is a boolean or not
 * @param value value to check
 * @returns Yes/No
 */
export function isBoolean(value: unknown): value is boolean
{
	return typeof value === "boolean";
}

/**
 * check whether given value is a number or not
 * @param value value to check
 * @returns Yes/No
 */
export function isNumber(value: unknown): value is number
{
	if(typeof value !== "number")
	{
		return false;
	}
	if(Number.isNaN(value))
	{
		return false;
	}

	// true otherwise
	return true;
}

/**
 * check whether given value is an integer or not
 * @param value value to check
 * @returns Yes/No
 */
export function isInteger(value: number): value is number
{
	return Number.isSafeInteger(value);
}

/**
 * check whether given value is a string or not
 * @param value value to check
 * @returns Yes/No
 */
export function isString(value: unknown): value is string
{
	return typeof value === "string";
}

/**
 * check whether given value is an array or not
 * @param value value to check
 * @returns yes/no
 */
export function isArray(value: unknown): value is unknown[]
{
	return Array.isArray(value);
}

/**
 * check whether given value is an object or not
 * @param value value to check
 * @returns Yes/No
 */
export function isObject(value: unknown): value is AnyObject
{
	if(value === null)
	{
		return false;
	}
	if(isArray(value))
	{
		return false;
	}

	return typeof value === "object";
}
