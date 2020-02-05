import * as ifUndefined from "../appliers/ifUndefined";
import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as schema from "../appliers/object/schema";
import * as type from "../appliers/object/type";

import {BaseSchema} from "../libs/BaseSchema";

type OptionsForObject<T> =
	ifUndefined.Options<T> |
	ifEmptyString.Options<T> |
	ifNull.Options<T> |
	schema.Options |
	type.Options;

class ObjectSchema<T> extends BaseSchema<T>
{
	constructor(options: OptionsForObject<T>)
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
export function object<T>(options: OptionsForObject<T> = {}): ObjectSchema<T>
{
	return new ObjectSchema<T>(options);
}
