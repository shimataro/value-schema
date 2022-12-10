import {EnumerationSchema, RulesForEnumeration} from "../schemaClasses/EnumerationSchema";

import {NullableRules, UndefinableRules} from "../libs/publicTypes";

/** schema for enum-like (enum / union) or null or undefined */
export function enumeration<E = unknown>(options: RulesForEnumeration<E> & NullableRules & UndefinableRules): EnumerationSchema<E, null | undefined>;
/** schema for enum-like (enum / union) or undefined */
export function enumeration<E = unknown>(options: RulesForEnumeration<E> & UndefinableRules): EnumerationSchema<E, undefined>;
/** schema for enum-like (enum / union) or null */
export function enumeration<E = unknown>(rules: RulesForEnumeration<E> & NullableRules): EnumerationSchema<E, null>;
/** schema for enum-like (enum / union) */
export function enumeration<E = unknown>(rules: RulesForEnumeration<E>): EnumerationSchema<E>;

/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function enumeration<E = unknown>(rules: RulesForEnumeration<E>): EnumerationSchema<E>
{
	return new EnumerationSchema<E>(rules);
}
