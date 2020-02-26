import {Key, Values, isString} from "../../libs/types";
import {CAUSE, ValueSchemaError} from "../../libs/ValueSchemaError";

export enum CONVERT_CASE
{
	LOWER = "lower",
	UPPER = "UPPER",
}

export interface Options
{
	convertCase?: CONVERT_CASE;
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
	if(options.convertCase === undefined)
	{
		return false;
	}

	// istanbul ignore next
	if(!isString(values.output))
	{
		return false;
	}

	switch(options.convertCase)
	{
	case CONVERT_CASE.LOWER:
		values.output = values.output.toLowerCase();
		return false;

	case CONVERT_CASE.UPPER:
		values.output = values.output.toUpperCase();
		return false;
	}

	ValueSchemaError.raise(CAUSE.CONVERT_CASE, values, keyStack);
}
