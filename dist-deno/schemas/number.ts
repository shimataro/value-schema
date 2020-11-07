import { NullableOptions } from "../libs/publicTypes.ts";
import { NumberSchema, OptionsForNumber } from "../schemaClasses/NumberSchema.ts";
export { NUMBER } from "../schemaClasses/NumberSchema.ts";
export function number(options: OptionsForNumber & NullableOptions): NumberSchema<null>;
export function number(options: OptionsForNumber): NumberSchema;
export function number(): NumberSchema;
/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function number(options: OptionsForNumber = {}): NumberSchema<null> {
    return new NumberSchema(options);
}
