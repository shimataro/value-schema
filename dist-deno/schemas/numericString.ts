import { NullableRules, UndefinableRules } from "../libs/publicTypes.ts";
import { NumericStringSchema, RulesForNumericString } from "../schemaClasses/NumericStringSchema.ts";
export { NUMERIC_STRING } from "../schemaClasses/NumericStringSchema.ts";
/** schema for numeric string or null or undefined */
export function numericString(options: RulesForNumericString & NullableRules & UndefinableRules): NumericStringSchema<null | undefined>;
/** schema for numeric string or undefined */
export function numericString(options: RulesForNumericString & UndefinableRules): NumericStringSchema<undefined>;
/** schema for numeric string or null */
export function numericString(rules: RulesForNumericString & NullableRules): NumericStringSchema<null>;
/** schema for numeric string */
export function numericString(rules: RulesForNumericString): NumericStringSchema;
/** schema for numeric string */
export function numericString(): NumericStringSchema;
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function numericString(rules: RulesForNumericString = {}): NumericStringSchema {
    return new NumericStringSchema(rules);
}
