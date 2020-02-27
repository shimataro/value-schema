import * as converter from "../appliers/converter";
import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as each from "../appliers/array/each";
import * as maxLength from "../appliers/array/maxLength";
import * as minLength from "../appliers/array/minLength";
import * as type from "../appliers/array/type";

import {BaseSchema} from "../libs/BaseSchema";

type OptionsForArray<T> =
	converter.Options<T[]> |
	ifUndefined.Options<T[]> |
	ifEmptyString.Options<T[]> |
	ifNull.Options<T[]> |
	each.Options<T> |
	minLength.Options |
	maxLength.Options |
	type.Options;

class ArraySchema<T> extends BaseSchema<T[]>
{
	constructor(options: OptionsForArray<T>)
	{
		super(options, [
			ifUndefined.applyTo,
			ifNull.applyTo,
			ifEmptyString.applyTo,
			type.applyTo,
			each.applyTo,
			minLength.applyTo,
			maxLength.applyTo,
			converter.applyTo,
		]);
	}
}

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function array<T>(options: OptionsForArray<T> = {}): ArraySchema<T>
{
	return new ArraySchema<T>(options);
}
