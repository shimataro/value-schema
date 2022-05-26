import * as converter from "../appliers/converter";
import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as each from "../appliers/array/each";
import * as maxLength from "../appliers/array/maxLength";
import * as minLength from "../appliers/array/minLength";
import * as type from "../appliers/array/type";

import {BaseSchema} from "./BaseSchema";

export type RulesForArray<T> =
	converter.Rules<T[]> &
	ifUndefined.Rules<T[]> &
	ifEmptyString.Rules<T[]> &
	ifNull.Rules<T[]> &
	each.Rules<T> &
	minLength.Rules &
	maxLength.Rules &
	type.Rules;

export class ArraySchema<T, Tx = never> extends BaseSchema<T[] | Tx>
{
	constructor(rules: RulesForArray<T>)
	{
		super(rules, [
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
