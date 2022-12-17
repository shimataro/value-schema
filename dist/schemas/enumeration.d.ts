import { EnumerationSchema, RulesForEnumeration } from "../schemaClasses/EnumerationSchema";
import { NullableRules, UndefinableRules } from "../libs/publicTypes";
/** schema for enum-like (enum / union) or null or undefined */
export declare function enumeration<E = unknown>(options: RulesForEnumeration<E> & NullableRules & UndefinableRules): EnumerationSchema<E, null | undefined>;
/** schema for enum-like (enum / union) or undefined */
export declare function enumeration<E = unknown>(options: RulesForEnumeration<E> & UndefinableRules): EnumerationSchema<E, undefined>;
/** schema for enum-like (enum / union) or null */
export declare function enumeration<E = unknown>(rules: RulesForEnumeration<E> & NullableRules): EnumerationSchema<E, null>;
/** schema for enum-like (enum / union) */
export declare function enumeration<E = unknown>(rules: RulesForEnumeration<E>): EnumerationSchema<E>;
