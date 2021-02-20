import { NullableOptions } from "../libs/publicTypes.ts";
import { OptionsForString, StringSchema } from "../schemaClasses/StringSchema.ts";
export { STRING } from "../schemaClasses/StringSchema.ts";
/** schema for string or null */
export function string(options: OptionsForString & NullableOptions): StringSchema<null>;
/** schema for string */
export function string(options: OptionsForString): StringSchema;
/** schema for string */
export function string(): StringSchema;
/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function string(options: OptionsForString = {}): StringSchema {
    return new StringSchema(options);
}
