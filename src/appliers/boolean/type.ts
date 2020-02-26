import {Key, Values, isBoolean, isNumber, isString} from "../../libs/types";
import {CAUSE, ValueSchemaError} from "../../libs/ValueSchemaError";

const REGEXP_TRUE = /^\s*(true|yes|on)\s*$/i;
const REGEXP_FALSE = /^\s*(false|no|off)\s*$/i;

export interface Options
{
	strictType?: boolean;
	acceptsAllNumbers?: boolean;
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo(values: Values, options: Options, keyStack: Key[]): values is Values<boolean>
{
	const normalizedOptions: Required<Options> = {
		strictType: false,
		acceptsAllNumbers: false,
		...options,
	};

	if(isBoolean(values.output))
	{
		// already boolean
		return true;
	}

	// not boolean
	if(normalizedOptions.strictType)
	{
		// strict type check
		ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
	}

	if(isString(values.output))
	{
		// "true" is true, "false" is false
		if(REGEXP_TRUE.test(values.output))
		{
			values.output = true;
			return true;
		}
		if(REGEXP_FALSE.test(values.output))
		{
			values.output = false;
			return true;
		}

		// convert to number
		values.output = Number(values.output);
	}

	if(isNumber(values.output))
	{
		if(values.output === 0 || values.output === 1 || normalizedOptions.acceptsAllNumbers)
		{
			values.output = Boolean(values.output);
			return true;
		}
	}

	ValueSchemaError.raise(CAUSE.TYPE, values, keyStack);
}
