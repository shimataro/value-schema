import { NullableOptions, UndefinableOptions } from "../libs/publicTypes.ts";
import { NumberSchema, OptionsForNumber } from "../schemaClasses/NumberSchema.ts";
export { NUMBER } from "../schemaClasses/NumberSchema.ts";
/** schema for number or null or undefined */
export function number(options: OptionsForNumber & NullableOptions & UndefinableOptions): NumberSchema<null | undefined>;
/** schema for number or undefined */
export function number(options: OptionsForNumber & UndefinableOptions): NumberSchema<undefined>;
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
export function number(options: OptionsForNumber = {}): NumberSchema {
    return new NumberSchema(options);
}
