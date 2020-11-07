import {NullableOptions} from "../schemaClasses/BaseSchema";
import {BooleanSchema, OptionsForBoolean} from "../schemaClasses/BooleanSchema";

export function boolean(options: OptionsForBoolean & NullableOptions): BooleanSchema<null>
export function boolean(options: OptionsForBoolean): BooleanSchema
export function boolean(): BooleanSchema

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function boolean(options: OptionsForBoolean = {}): BooleanSchema
{
	return new BooleanSchema(options);
}
