import { NullableRules, UndefinableRules } from "../libs/publicTypes.ts";
import { EmailSchema, RulesForEmail } from "../schemaClasses/EmailSchema.ts";
/** schema for email or null or undefined */
export function email(options: RulesForEmail & NullableRules & UndefinableRules): EmailSchema<null | undefined>;
/** schema for email or undefined */
export function email(options: RulesForEmail & UndefinableRules): EmailSchema<undefined>;
/** schema for email or null */
export function email(rules: RulesForEmail & NullableRules): EmailSchema<null>;
/** schema for email */
export function email(rules: RulesForEmail): EmailSchema;
/** schema for email */
export function email(): EmailSchema;
/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function email(rules: RulesForEmail = {}): EmailSchema {
    return new EmailSchema(rules);
}
