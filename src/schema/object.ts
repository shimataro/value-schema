import * as ifUndefined from "../appliers/ifUndefined";
import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as schema from "../appliers/object/schema";
import * as type from "../appliers/object/type";

import {BaseSchema} from "../libs/BaseSchema";

type OptionsForObject =
	ifUndefined.Options<object> |
	ifEmptyString.Options<object> |
	ifNull.Options<object> |
	schema.Options |
	type.Options;

class ObjectSchema extends BaseSchema<object>
{
	constructor(options: OptionsForObject)
	{
		super(options, [
			ifUndefined.applyTo,
			ifNull.applyTo,
			ifEmptyString.applyTo,
			schema.applyTo,
			type.applyTo,
		]);
	}
}

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function object(options: OptionsForObject = {}): ObjectSchema
{
	return new ObjectSchema(options);
}
