import * as converter from "../appliers/converter";
import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as only from "../appliers/only";
import * as checksum from "../appliers/numericString/checksum";
import * as fullWidthToHalf from "../appliers/numericString/fullWidthToHalf";
import * as joinsArray from "../appliers/numericString/joinsArray";
import * as pattern from "../appliers/numericString/pattern";
import * as separatedBy from "../appliers/numericString/separatedBy";
import * as maxLength from "../appliers/string/maxLength";
import * as minLength from "../appliers/string/minLength";
import * as type from "../appliers/string/type";

import {BaseSchema} from "../libs/BaseSchema";

export const NUMERIC_STRING = {
	CHECKSUM_ALGORITHM: checksum.CHECKSUM_ALGORITHM,
};

type OptionsForNumericString =
	converter.Options<string> |
	ifEmptyString.Options<string> |
	ifNull.Options<string> |
	ifUndefined.Options<string> |
	only.Options<string> |
	checksum.Options |
	fullWidthToHalf.Options |
	joinsArray.Options |
	pattern.Options |
	separatedBy.Options |
	type.Options |
	minLength.Options |
	maxLength.Options;

class NumericStringSchema extends BaseSchema<string>
{
	constructor(options: OptionsForNumericString)
	{
		super(options, [
			ifUndefined.applyTo,
			ifNull.applyTo,
			ifEmptyString.applyTo,
			fullWidthToHalf.applyTo,
			joinsArray.applyTo,
			type.applyTo,
			separatedBy.applyTo,
			pattern.applyTo,
			minLength.applyTo,
			maxLength.applyTo,
			checksum.applyTo,
			converter.applyTo,
		]);
	}
}

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function numericString(options: OptionsForNumericString = {}): NumericStringSchema
{
	return new NumericStringSchema(options);
}
