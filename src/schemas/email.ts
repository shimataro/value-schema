import * as ifEmptyString from "../appliers/ifEmptyString";
import * as ifNull from "../appliers/ifNull";
import * as ifUndefined from "../appliers/ifUndefined";
import * as maxLength from "../appliers/email/maxLength";
import * as pattern from "../appliers/email/pattern";
import * as trims from "../appliers/string/trims";
import * as type from "../appliers/string/type";

import {BaseSchema} from "../schemaClasses/BaseSchema";

type OptionsForEmail =
	ifEmptyString.Options<string> |
	ifNull.Options<string> |
	ifUndefined.Options<string> |
	pattern.Options |
	maxLength.Options |
	trims.Options |
	type.Options;

class EmailSchema extends BaseSchema<string>
{
	constructor(options: OptionsForEmail)
	{
		super(options, [
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

/**
 * create schema
 * @param options Options
 * @returns schema
 */
export function email(options: OptionsForEmail = {}): EmailSchema
{
	return new EmailSchema(options);
}
