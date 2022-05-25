import {NullableOptions, UndefinableOptions} from "../libs/publicTypes";
import {EmailSchema, OptionsForEmail} from "../schemaClasses/EmailSchema";

/** schema for email or null or undefined */
export function email(options: OptionsForEmail & NullableOptions & UndefinableOptions): EmailSchema<null | undefined>;
/** schema for email or undefined */
export function email(options: OptionsForEmail & UndefinableOptions): EmailSchema<undefined>;
/** schema for email or null */
export function email(options: OptionsForEmail & NullableOptions): EmailSchema<null>;
/** schema for email */
export function email(options: OptionsForEmail): EmailSchema;
/** schema for email */
export function email(): EmailSchema;

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function email(options: OptionsForEmail = {}): EmailSchema
{
	return new EmailSchema(options);
}
