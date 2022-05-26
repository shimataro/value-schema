import {NullableRules, UndefinableRules} from "../libs/publicTypes";
import {BooleanSchema, RulesForBoolean} from "../schemaClasses/BooleanSchema";

/** schema for boolean or null or undefined */
export function boolean(options: RulesForBoolean & NullableRules & UndefinableRules): BooleanSchema<null | undefined>;
/** schema for boolean or undefined */
export function boolean(options: RulesForBoolean & UndefinableRules): BooleanSchema<undefined>;
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
export function boolean(rules: RulesForBoolean = {}): BooleanSchema
{
	return new BooleanSchema(rules);
}
