import * as converter from "../appliers/converter";
import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as only from "../appliers/only";
import * as acceptsFullWidth from "../appliers/number/acceptsFullWidth";
import * as maxValue from "../appliers/number/maxValue";
import * as minValue from "../appliers/number/minValue";
import * as type from "../appliers/number/type";

import {BaseSchema} from "../libs/BaseSchema";

export const NUMBER = {
	INTEGER: type.INTEGER,
};

type OptionsForNumber =
	converter.Options<number> |
	ifUndefined.Options<number> |
	ifEmptyString.Options<number> |
	ifNull.Options<number> |
	only.Options<number> |
	acceptsFullWidth.Options |
	type.Options |
	minValue.Options |
	maxValue.Options;

class NumberSchema extends BaseSchema<number>
{
	constructor(options: OptionsForNumber)
	{
		super(options, [
			ifUndefined.applyTo,
			ifEmptyString.applyTo,
			ifNull.applyTo,
			acceptsFullWidth.applyTo,
			type.applyTo,
			only.applyTo,
			minValue.applyTo,
			maxValue.applyTo,
			converter.applyTo,
		]);
	}
}

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function number(options: OptionsForNumber = {}): NumberSchema
{
	return new NumberSchema(options);
}
