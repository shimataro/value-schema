import { NullableOptions, UndefinableOptions } from "../libs/publicTypes.ts";
import { EnumerationSchema, OptionsForEnumeration } from "../schemaClasses/EnumerationSchema.ts";
/** schema for enum-like (enum / union) or null or undefined */
export function enumeration<E = unknown>(options: OptionsForEnumeration<E> & NullableOptions & UndefinableOptions): EnumerationSchema<E, null | undefined>;
/** schema for enum-like (enum / union) or undefined */
export function enumeration<E = unknown>(options: OptionsForEnumeration<E> & UndefinableOptions): EnumerationSchema<E, undefined>;
/** schema for enum-like (enum / union) or null */
export function enumeration<E = unknown>(options: OptionsForEnumeration<E> & NullableOptions): EnumerationSchema<E, null>;
/** schema for enum-like (enum / union) */
export function enumeration<E = unknown>(options: OptionsForEnumeration<E>): EnumerationSchema<E>;
/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function enumeration<E = unknown>(options: OptionsForEnumeration<E>): EnumerationSchema<E> {
    return new EnumerationSchema<E>(options);
}
