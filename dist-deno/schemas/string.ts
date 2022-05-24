import { NullableRules } from "../libs/publicTypes.ts";
import { RulesForString, StringSchema } from "../schemaClasses/StringSchema.ts";
export { STRING } from "../schemaClasses/StringSchema.ts";
/** schema for string or null */
export function string(rules: RulesForString & NullableRules): StringSchema<null>;
/** schema for string */
export function string(rules: RulesForString): StringSchema;
/** schema for string */
export function string(): StringSchema;
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function string(rules: RulesForString = {}): StringSchema {
    return new StringSchema(rules);
}
