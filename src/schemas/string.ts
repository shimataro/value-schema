import {NullableOptions, OptionsForString, StringSchema} from "../schemaClasses/StringSchema";

export {STRING} from "../schemaClasses/StringSchema";

export function string(options: OptionsForString & NullableOptions): StringSchema<null>
export function string(options: OptionsForString): StringSchema
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
