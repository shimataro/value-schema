import { NullableOptions } from "../libs/publicTypes.ts";
import { EmailSchema, OptionsForEmail } from "../schemaClasses/EmailSchema.ts";
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
export function email(options: OptionsForEmail = {}): EmailSchema {
    return new EmailSchema(options);
}
