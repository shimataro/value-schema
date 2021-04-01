import {NullableOptions} from "../libs/publicTypes";
import {OptionsForString, StringSchema} from "../schemaClasses/StringSchema";

export {STRING} from "../schemaClasses/StringSchema";

/** schema for string or null */
export function string(options: OptionsForString & NullableOptions): StringSchema<null>
/** schema for string */
export function string(options: OptionsForString): StringSchema
/** schema for string */
export function string(): StringSchema

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function string(options: OptionsForString = {}): StringSchema
{
	return new StringSchema(options);
}
