import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as type from "../appliers/boolean/type";

import {BaseSchema} from "../libs/BaseSchema";

type OptionsForBoolean =
	ifUndefined.Options<boolean> |
	ifEmptyString.Options<boolean> |
	ifNull.Options<boolean> |
	type.Options;

class BooleanSchema extends BaseSchema<boolean>
{
	constructor(options: OptionsForBoolean)
	{
		super(options, [
			ifUndefined.applyTo,
			ifEmptyString.applyTo,
			ifNull.applyTo,
			type.applyTo,
		]);
	}
}

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function boolean(options: OptionsForBoolean = {}): BooleanSchema
{
	return new BooleanSchema(options);
}
