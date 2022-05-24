import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as maxLength from "../appliers/email/maxLength";
import * as pattern from "../appliers/email/pattern";
import * as trims from "../appliers/string/trims";
import * as type from "../appliers/string/type";

import {BaseSchema} from "./BaseSchema";

export type RulesForEmail =
	ifEmptyString.Rules<string> &
	ifNull.Rules<string> &
	ifUndefined.Rules<string> &
	pattern.Rules &
	maxLength.Rules &
	trims.Rules &
	type.Rules;

export class EmailSchema<Tx = never> extends BaseSchema<string | Tx>
{
	constructor(rules: RulesForEmail)
	{
		super(rules, [
			ifUndefined.applyTo,
			ifNull.applyTo,
			type.applyTo,
			trims.applyTo,
			ifEmptyString.applyTo,
			maxLength.applyTo,
			pattern.applyTo,
		]);
	}
}
