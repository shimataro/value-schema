import { NullableOptions } from "../libs/publicTypes.ts";
import { NumberSchema, OptionsForNumber } from "../schemaClasses/NumberSchema.ts";
export { NUMBER } from "../schemaClasses/NumberSchema.ts";
/** schema for number or null */
export function number(options: OptionsForNumber & NullableOptions): NumberSchema<null>;
/** schema for number */
export function number(options: OptionsForNumber): NumberSchema;
/** schema for number */
export function number(): NumberSchema;
/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function number(options: OptionsForNumber = {}): NumberSchema<null> {
    return new NumberSchema(options);
}
