import {NullableRules} from "../libs/publicTypes";
import {BooleanSchema, RulesForBoolean} from "../schemaClasses/BooleanSchema";

/** schema for boolean or null */
export function boolean(rules: RulesForBoolean & NullableRules): BooleanSchema<null>
/** schema for boolean */
export function boolean(rules: RulesForBoolean): BooleanSchema
/** schema for boolean */
export function boolean(): BooleanSchema

/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function boolean(rules: RulesForBoolean = {}): BooleanSchema
{
	return new BooleanSchema(rules);
}
