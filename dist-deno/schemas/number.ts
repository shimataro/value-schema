import { NullableRules, UndefinableRules } from "../libs/publicTypes.ts";
import { NumberSchema, RulesForNumber } from "../schemaClasses/NumberSchema.ts";
export { NUMBER } from "../schemaClasses/NumberSchema.ts";
/** schema for number or null or undefined */
export function number(options: RulesForNumber & NullableRules & UndefinableRules): NumberSchema<null | undefined>;
/** schema for number or undefined */
export function number(options: RulesForNumber & UndefinableRules): NumberSchema<undefined>;
/** schema for number or null */
export function number(rules: RulesForNumber & NullableRules): NumberSchema<null>;
/** schema for number */
export function number(rules: RulesForNumber): NumberSchema;
/** schema for number */
export function number(): NumberSchema;
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function number(rules: RulesForNumber = {}): NumberSchema {
    return new NumberSchema(rules);
}
