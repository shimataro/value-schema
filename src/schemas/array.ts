import {NullableOptions, UndefinableOptions} from "../libs/publicTypes";
import {ArraySchema, OptionsForArray} from "../schemaClasses/ArraySchema";

/** schema for array or null or undefined */
export function array<T>(options: OptionsForArray<T> & NullableOptions & UndefinableOptions): ArraySchema<T, null | undefined>;
/** schema for array or undefined */
export function array<T>(options: OptionsForArray<T> & UndefinableOptions): ArraySchema<T, undefined>;
/** schema for array or null */
export function array<T>(options: OptionsForArray<T> & NullableOptions): ArraySchema<T, null>;
/** schema for array */
export function array<T>(options: OptionsForArray<T>): ArraySchema<T>;
/** schema for array */
export function array<T>(): ArraySchema<T>;

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function array<T>(options: OptionsForArray<T> = {}): ArraySchema<T>
{
	return new ArraySchema<T>(options);
}
