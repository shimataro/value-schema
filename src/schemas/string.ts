import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as only from "../appliers/only";
import * as caseConverter from "../appliers/string/caseConverter";
import * as converter from "../appliers/converter";
import * as maxLength from "../appliers/string/maxLength";
import * as minLength from "../appliers/string/minLength";
import * as pattern from "../appliers/string/pattern";
import * as trims from "../appliers/string/trims";
import * as type from "../appliers/string/type";

import {BaseSchema} from "../libs/BaseSchema";

export const STRING = {
	CASE_CONVERTER: caseConverter.CASE_CONVERTER,
	PATTERN: pattern.PATTERN,
};

type OptionsForString =
	ifEmptyString.Options<string> |
	ifNull.Options<string> |
	ifUndefined.Options<string> |
	converter.Options<string> |
	only.Options<string> |
	type.Options |
	trims.Options |
	caseConverter.Options |
	minLength.Options |
	maxLength.Options |
	pattern.Options;

class StringSchema extends BaseSchema<string>
{
	constructor(options: OptionsForString)
	{
		super(options, [
			ifUndefined.applyTo,
			ifNull.applyTo,
			type.applyTo,
			trims.applyTo,
			only.applyTo,
			ifEmptyString.applyTo,
			minLength.applyTo,
			maxLength.applyTo,
			caseConverter.applyTo,
			pattern.applyTo,
			converter.applyTo,
		]);
	}
}

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function string(options: OptionsForString = {}): StringSchema
{
	return new StringSchema(options);
}
