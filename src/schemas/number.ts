import {NullableOptions} from "../libs/publicTypes";
import {NumberSchema, OptionsForNumber} from "../schemaClasses/NumberSchema";

export {NUMBER} from "../schemaClasses/NumberSchema";

/** schema for number or null */
export function number(options: OptionsForNumber & NullableOptions): NumberSchema<null>
/** schema for number */
export function number(options: OptionsForNumber): NumberSchema
/** schema for number */
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
