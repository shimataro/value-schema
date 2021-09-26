import { NullableOptions } from "../libs/publicTypes.ts";
import { EnumerationSchema, OptionsForEnumeration } from "../schemaClasses/EnumerationSchema.ts";
/** schema for "enumeration" or null */
export function enumeration<E = unknown>(options: OptionsForEnumeration<E> & NullableOptions): EnumerationSchema<E, null>;
/** schema for "enumeration" */
export function enumeration<E = unknown>(options: OptionsForEnumeration<E>): EnumerationSchema<E>;
/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function enumeration<E = unknown>(options: OptionsForEnumeration<E>): EnumerationSchema<E, null> {
    return new EnumerationSchema<E>(options);
}
