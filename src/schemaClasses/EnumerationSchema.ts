import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as map from "../appliers/map";
import * as only from "../appliers/only";

import {BaseSchema} from "./BaseSchema";

export type RulesForEnumeration<E> =
	map.Rules &
	ifUndefined.Rules<E> &
	ifEmptyString.Rules<E> &
	ifNull.Rules<E> &
	Required<only.Rules<E>>;

export class EnumerationSchema<E, Tx = never> extends BaseSchema<E | Tx>
{
	constructor(rules: RulesForEnumeration<E>)
	{
		super(rules, [
			ifUndefined.applyTo,
			ifEmptyString.applyTo,
			ifNull.applyTo,
			only.applyTo,
		]);
	}
}
