import {NullableOptions} from "../libs/publicTypes";
import {EnumerateSchema, OptionsForEnumerate} from "../schemaClasses/EnumerateSchema";

/** schema for "enumerate" or null */
export function enumerate<E = never>(options: OptionsForEnumerate<E> & NullableOptions): EnumerateSchema<E, null>
/** schema for "enumerate" */
export function enumerate<E = never>(options: OptionsForEnumerate<E>): EnumerateSchema<E>

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function enumerate<E = never>(options: OptionsForEnumerate<E>): EnumerateSchema<E, null>
{
	return new EnumerateSchema<E>(options);
}
