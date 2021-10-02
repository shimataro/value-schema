import * as converter from "../appliers/converter";
import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as only from "../appliers/only";
import * as maxLength from "../appliers/string/maxLength";
import * as minLength from "../appliers/string/minLength";
import * as pattern from "../appliers/string/pattern";
import * as trims from "../appliers/string/trims";
import * as type from "../appliers/string/type";

import {BaseSchema} from "./BaseSchema";

export const STRING = {
	PATTERN: pattern.PATTERN,
} as const;

export type OptionsForString =
	converter.Options<string> &
	ifEmptyString.Options<string> &
	ifNull.Options<string> &
	ifUndefined.Options<string> &
	only.Options<string> &
	type.Options &
	trims.Options &
	minLength.Options &
	maxLength.Options &
	pattern.Options;

export class StringSchema<Tx = never> extends BaseSchema<string | Tx>
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
			pattern.applyTo,
			converter.applyTo,
		]);
	}
}
