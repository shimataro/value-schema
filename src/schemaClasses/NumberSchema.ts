import * as converter from "../appliers/converter";
import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as only from "../appliers/only";
import * as acceptsFullWidth from "../appliers/number/acceptsFullWidth";
import * as maxValue from "../appliers/number/maxValue";
import * as minValue from "../appliers/number/minValue";
import * as type from "../appliers/number/type";

import {BaseSchema} from "./BaseSchema";

export const NUMBER = {
	INTEGER: type.INTEGER,
} as const;

export type RulesForNumber =
	converter.Rules<number> &
	ifUndefined.Rules<number> &
	ifEmptyString.Rules<number> &
	ifNull.Rules<number> &
	only.Rules<number> &
	acceptsFullWidth.Rules &
	type.Rules &
	minValue.Rules &
	maxValue.Rules;

export class NumberSchema<Tx = never> extends BaseSchema<number | Tx>
{
	constructor(rules: RulesForNumber)
	{
		super(rules, [
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
