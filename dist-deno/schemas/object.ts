import { NullableOptions } from "../libs/publicTypes.ts";
import { SchemaObject } from "../libs/types.ts";
import { ObjectSchema, OptionsForObject } from "../schemaClasses/ObjectSchema.ts";
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
export function object<S extends SchemaObject>(options: OptionsForObject<S> = {}): ObjectSchema<S> {
    return new ObjectSchema(options);
}
