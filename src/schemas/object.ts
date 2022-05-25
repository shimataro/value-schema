import {NullableRules, UndefinableRules} from "../libs/publicTypes";
import {SchemaObject} from "../libs/types";
import {ObjectSchema, RulesForObject} from "../schemaClasses/ObjectSchema";

/** schema for object or null or undefined */
export function object<S extends SchemaObject>(options: RulesForObject<S> & NullableRules & UndefinableRules): ObjectSchema<S, null | undefined>;
/** schema for object or undefined */
export function object<S extends SchemaObject>(options: RulesForObject<S> & UndefinableRules): ObjectSchema<S, undefined>;
/** schema for object or null */
export function object<S extends SchemaObject>(rules: RulesForObject<S> & NullableRules): ObjectSchema<S, null>;
/** schema for object */
export function object<S extends SchemaObject>(rules: RulesForObject<S>): ObjectSchema<S>;
/** schema for object */
export function object(): ObjectSchema<SchemaObject>;

/**
 * create schema
 * @param rules rules
 * @returns schema
 */
export function object<S extends SchemaObject>(rules: RulesForObject<S> = {}): ObjectSchema<S>
{
	return new ObjectSchema(rules);
}
