import {NullableRules} from "../libs/publicTypes";
import {NumberSchema, RulesForNumber} from "../schemaClasses/NumberSchema";

export {NUMBER} from "../schemaClasses/NumberSchema";

/** schema for number or null */
export function number(rules: RulesForNumber & NullableRules): NumberSchema<null>
/** schema for number */
export function number(rules: RulesForNumber): NumberSchema
/** schema for number */
export function number(): NumberSchema

/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function number(rules: RulesForNumber = {}): NumberSchema<null>
{
	return new NumberSchema(rules);
}
