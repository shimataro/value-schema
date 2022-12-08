import { NullableRules, UndefinableRules } from "../libs/publicTypes.ts";
import { DateSchema, RulesForDate } from "../schemaClasses/DateSchema.ts";
export { DATE } from "../schemaClasses/DateSchema.ts";
/** schema for number or null or undefined */
export function date(options: RulesForDate & NullableRules & UndefinableRules): DateSchema<null | undefined>;
/** schema for number or undefined */
export function date(options: RulesForDate & UndefinableRules): DateSchema<undefined>;
/** schema for number or null */
export function date(rules: RulesForDate & NullableRules): DateSchema<null>;
/** schema for number */
export function date(rules: RulesForDate): DateSchema;
/** schema for number */
export function date(): DateSchema;
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function date(rules: RulesForDate = {}): DateSchema {
    return new DateSchema(rules);
}
