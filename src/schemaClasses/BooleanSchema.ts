import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as type from "../appliers/boolean/type";

import {BaseSchema} from "./BaseSchema";

export type OptionsForBoolean =
	ifUndefined.Options<boolean> &
	ifEmptyString.Options<boolean> &
	ifNull.Options<boolean> &
	type.Options;

export class BooleanSchema<Tx = never> extends BaseSchema<boolean | Tx>
{
	constructor(options: OptionsForBoolean)
	{
		super(options, [
			ifUndefined.applyTo,
			ifEmptyString.applyTo,
			ifNull.applyTo,
			type.applyTo,
		]);
	}
}
