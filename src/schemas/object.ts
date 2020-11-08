import {NullableOptions} from "../libs/publicTypes";
import {SchemaObject} from "../libs/types";
import {ObjectSchema, OptionsForObject} from "../schemaClasses/ObjectSchema";

export function object<S extends SchemaObject>(options: OptionsForObject<S> & NullableOptions): ObjectSchema<S, null>
export function object<S extends SchemaObject>(options: OptionsForObject<S>): ObjectSchema<S>
export function object(): ObjectSchema<SchemaObject>

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function object<S extends SchemaObject>(options: OptionsForObject<S> = {}): ObjectSchema<S>
{
	return new ObjectSchema(options);
}
