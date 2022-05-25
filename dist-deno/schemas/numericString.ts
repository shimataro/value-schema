import { NullableOptions, UndefinableOptions } from "../libs/publicTypes.ts";
import { NumericStringSchema, OptionsForNumericString } from "../schemaClasses/NumericStringSchema.ts";
export { NUMERIC_STRING } from "../schemaClasses/NumericStringSchema.ts";
/** schema for numeric string or null or undefined */
export function numericString(options: OptionsForNumericString & NullableOptions & UndefinableOptions): NumericStringSchema<null | undefined>;
/** schema for numeric string or undefined */
export function numericString(options: OptionsForNumericString & UndefinableOptions): NumericStringSchema<undefined>;
/** schema for numeric string or null */
export function numericString(options: OptionsForNumericString & NullableOptions): NumericStringSchema<null>;
/** schema for numeric string */
export function numericString(options: OptionsForNumericString): NumericStringSchema;
/** schema for numeric string */
export function numericString(): NumericStringSchema;
/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function numericString(options: OptionsForNumericString = {}): NumericStringSchema {
    return new NumericStringSchema(options);
}
