import * as converter from "../appliers/converter";
import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as iso8601 from "../appliers/date/iso8601";
import * as unixtime from "../appliers/date/unixtime";
import * as type from "../appliers/date/type";

import {BaseSchema} from "./BaseSchema";

export const DATE = {
	UNIXTIME_PRECISION: unixtime.UNIXTIME_PRECISION,
} as const;

export type RulesForDate =
	converter.Rules<Date> &
	ifUndefined.Rules<Date> &
	ifEmptyString.Rules<Date> &
	ifNull.Rules<Date> &
	iso8601.Rules &
	unixtime.Rules;

export class DateSchema<Tx = never> extends BaseSchema<Date | Tx>
{
	constructor(rules: RulesForDate)
	{
		super(rules, [
			ifUndefined.applyTo,
			ifNull.applyTo,
			ifEmptyString.applyTo,
			unixtime.applyTo,
			iso8601.applyTo,
			type.applyTo,
		]);
	}
}
