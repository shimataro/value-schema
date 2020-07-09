import {Key, Values, isString} from "../../libs/types";
import {CAUSE, ValueSchemaError} from "../../libs/ValueSchemaError";

import {REGEXP_EMAIL} from "../../libs/regexp/email";
import {REGEXP_IPV4} from "../../libs/regexp/ipv4";
import {REGEXP_IPV6} from "../../libs/regexp/ipv6";
import {REGEXP_HTTP, REGEXP_URI} from "../../libs/regexp/uri";

export const PATTERN = {
	EMAIL: REGEXP_EMAIL,
	HTTP: REGEXP_HTTP,
	IPV4: REGEXP_IPV4,
	IPV6: REGEXP_IPV6,
	URI: REGEXP_URI,
};

export interface Options
{
	pattern?: RegExp;
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo(values: Values, options: Options, keyStack: Key[]): values is Values<string>
{
	if(options.pattern === undefined)
	{
		return false;
	}

	// istanbul ignore next
	if(!isString(values.output))
	{
		return false;
	}

	if(options.pattern.test(values.output))
	{
		return false;
	}

	return ValueSchemaError.raise(CAUSE.PATTERN, values, keyStack);
}
