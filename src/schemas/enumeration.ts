import {NullableRules} from "../libs/publicTypes";
import {EnumerationSchema, RulesForEnumeration} from "../schemaClasses/EnumerationSchema";

/** schema for enum-like (enum / union) or null */
export function enumeration<E = unknown>(rules: RulesForEnumeration<E> & NullableRules): EnumerationSchema<E, null>;
/** schema for enum-like (enum / union) */
export function enumeration<E = unknown>(rules: RulesForEnumeration<E>): EnumerationSchema<E>;

/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function enumeration<E = unknown>(rules: RulesForEnumeration<E>): EnumerationSchema<E, null>
{
	return new EnumerationSchema<E>(rules);
}
