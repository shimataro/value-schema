import * as converter from "../appliers/converter";
import * as ifUndefined from "../appliers/ifUndefined";
import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as schema from "../appliers/object/schema";
import * as type from "../appliers/object/type";

import {BaseSchema} from "../libs/BaseSchema";
import {AnyObject, ObjectTypeOf, SchemaObject} from "../libs/types";

type OptionsForObject<S> =
	converter.Options<AnyObject> |
	ifUndefined.Options<AnyObject> |
	ifEmptyString.Options<AnyObject> |
	ifNull.Options<AnyObject> |
	schema.Options<S> |
	type.Options;

class ObjectSchema<S extends SchemaObject> extends BaseSchema<ObjectTypeOf<S>>
{
	constructor(options: OptionsForObject<S>)
	{
		super(options, [
			ifUndefined.applyTo,
			ifNull.applyTo,
			ifEmptyString.applyTo,
			schema.applyTo,
			type.applyTo,
			converter.applyTo,
		]);
	}
}

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function object<S extends SchemaObject>(options: OptionsForObject<S> = {}): ObjectSchema<S>
{
	return new ObjectSchema(options);
}
