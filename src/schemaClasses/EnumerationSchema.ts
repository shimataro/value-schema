import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as only from "../appliers/only";

import {BaseSchema} from "./BaseSchema";

export type OptionsForEnumeration<E> =
	ifUndefined.Options<E> &
	ifEmptyString.Options<E> &
	ifNull.Options<E> &
	Required<only.OptionsReadonly<E>>;

export class EnumerationSchema<E, Tx = never> extends BaseSchema<E | Tx>
{
	constructor(options: OptionsForEnumeration<E>)
	{
		super(options, [
			ifUndefined.applyTo,
			ifEmptyString.applyTo,
			ifNull.applyTo,
			only.applyTo,
		]);
	}
}
