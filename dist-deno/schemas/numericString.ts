import { NullableOptions } from "../schemaClasses/BaseSchema.ts";
import { NumericStringSchema, OptionsForNumericString } from "../schemaClasses/NumericStringSchema.ts";
export { NUMERIC_STRING } from "../schemaClasses/NumericStringSchema.ts";
export function numericString(options: OptionsForNumericString & NullableOptions): NumericStringSchema<null>;
export function numericString(options: OptionsForNumericString): NumericStringSchema;
export function numericString(): NumericStringSchema;
/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function numericString(options: OptionsForNumericString = {}): NumericStringSchema {
    return new NumericStringSchema(options);
}
