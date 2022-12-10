import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as only from "../appliers/only";
import * as transform from "../appliers/transform";

import * as checksum from "../appliers/numericString/checksum";
import * as fullWidthToHalf from "../appliers/numericString/fullWidthToHalf";
import * as joinsArray from "../appliers/numericString/joinsArray";
import * as pattern from "../appliers/numericString/pattern";
import * as separatedBy from "../appliers/numericString/separatedBy";

import * as maxLength from "../appliers/string/maxLength";
import * as minLength from "../appliers/string/minLength";
import * as type from "../appliers/string/type";

import {BaseSchema} from "../schemaClasses/BaseSchema";

export const NUMERIC_STRING = {
	CHECKSUM_ALGORITHM: checksum.CHECKSUM_ALGORITHM,
};

export type RulesForNumericString =
	transform.Rules<string> &
	ifEmptyString.Rules<string> &
	ifNull.Rules<string> &
	ifUndefined.Rules<string> &
	only.Rules<string> &
	checksum.Rules &
	fullWidthToHalf.Rules &
	joinsArray.Rules &
	pattern.Rules &
	separatedBy.Rules &
	type.Rules &
	minLength.Rules &
	maxLength.Rules;

export class NumericStringSchema<Tx = never> extends BaseSchema<string | Tx>
{
	constructor(rules: RulesForNumericString)
	{
		super(rules, [
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
			transform.applyTo,
		]);
	}
}
