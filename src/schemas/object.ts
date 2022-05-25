import {NullableOptions, UndefinableOptions} from "../libs/publicTypes";
import {SchemaObject} from "../libs/types";
import {ObjectSchema, OptionsForObject} from "../schemaClasses/ObjectSchema";

/** schema for object or null or undefined */
export function object<S extends SchemaObject>(options: OptionsForObject<S> & NullableOptions & UndefinableOptions): ObjectSchema<S, null | undefined>;
/** schema for object or undefined */
export function object<S extends SchemaObject>(options: OptionsForObject<S> & UndefinableOptions): ObjectSchema<S, undefined>;
/** schema for object or null */
export function object<S extends SchemaObject>(options: OptionsForObject<S> & NullableOptions): ObjectSchema<S, null>;
/** schema for object */
export function object<S extends SchemaObject>(options: OptionsForObject<S>): ObjectSchema<S>;
/** schema for object */
export function object(): ObjectSchema<SchemaObject>;

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function object<S extends SchemaObject>(options: OptionsForObject<S> = {}): ObjectSchema<S>
{
	return new ObjectSchema(options);
}
