import { NullableRules } from "../libs/publicTypes.ts";
import { BooleanSchema, RulesForBoolean } from "../schemaClasses/BooleanSchema.ts";
/** schema for boolean or null */
export function boolean(rules: RulesForBoolean & NullableRules): BooleanSchema<null>;
/** schema for boolean */
export function boolean(rules: RulesForBoolean): BooleanSchema;
/** schema for boolean */
export function boolean(): BooleanSchema;
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function boolean(rules: RulesForBoolean = {}): BooleanSchema {
    return new BooleanSchema(rules);
}
