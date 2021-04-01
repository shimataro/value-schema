import { NullableOptions } from "../libs/publicTypes.ts";
import { BooleanSchema, OptionsForBoolean } from "../schemaClasses/BooleanSchema.ts";
/** schema for boolean or null */
export function boolean(options: OptionsForBoolean & NullableOptions): BooleanSchema<null>;
/** schema for boolean */
export function boolean(options: OptionsForBoolean): BooleanSchema;
/** schema for boolean */
export function boolean(): BooleanSchema;
/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function boolean(options: OptionsForBoolean = {}): BooleanSchema {
    return new BooleanSchema(options);
}
