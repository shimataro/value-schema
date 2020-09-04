import {ArraySchema, NullableOptions, OptionsForArray} from "../schemaClasses/ArraySchema";

export function array<T>(options: OptionsForArray<T> & NullableOptions): ArraySchema<T, null>
export function array<T>(options: OptionsForArray<T>): ArraySchema<T>
export function array<T>(): ArraySchema<T>

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function array<T>(options: OptionsForArray<T> = {}): ArraySchema<T>
{
	return new ArraySchema<T>(options);
}
