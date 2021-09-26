import {NullableOptions} from "../libs/publicTypes";
import {EnumerationSchema, OptionsForEnumeration} from "../schemaClasses/EnumerationSchema";

/** schema for enum-like (enum / union) or null */
export function enumeration<E = unknown>(options: OptionsForEnumeration<E> & NullableOptions): EnumerationSchema<E, null>
/** schema for enum-like (enum / union) */
export function enumeration<E = unknown>(options: OptionsForEnumeration<E>): EnumerationSchema<E>

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function enumeration<E = unknown>(options: OptionsForEnumeration<E>): EnumerationSchema<E, null>
{
	return new EnumerationSchema<E>(options);
}
