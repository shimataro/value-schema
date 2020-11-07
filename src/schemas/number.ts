import {NullableOptions} from "../schemaClasses/BaseSchema";
import {NumberSchema, OptionsForNumber} from "../schemaClasses/NumberSchema";

export {NUMBER} from "../schemaClasses/NumberSchema";

export function number(options: OptionsForNumber & NullableOptions): NumberSchema<null>
export function number(options: OptionsForNumber): NumberSchema
export function number(): NumberSchema

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function number(options: OptionsForNumber = {}): NumberSchema<null>
{
	return new NumberSchema(options);
}
