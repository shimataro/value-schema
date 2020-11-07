import {NullableOptions} from "../schemaClasses/BaseSchema";
import {EmailSchema, OptionsForEmail} from "../schemaClasses/EmailSchema";

export function email(options: OptionsForEmail & NullableOptions): EmailSchema<null>
export function email(options: OptionsForEmail): EmailSchema
export function email(): EmailSchema

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function email(options: OptionsForEmail = {}): EmailSchema
{
	return new EmailSchema(options);
}
