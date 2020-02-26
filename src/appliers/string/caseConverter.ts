import {Key, Values, isString} from "../../libs/types";
import {CAUSE, ValueSchemaError} from "../../libs/ValueSchemaError";

export enum CASE_CONVERTER
{
	LOWER = "lower",
	UPPER = "UPPER",
}

export interface Options
{
	caseConverter?: CASE_CONVERTER;
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
	if(options.caseConverter === undefined)
	{
		return false;
	}

	// istanbul ignore next
	if(!isString(values.output))
	{
		return false;
	}

	switch(options.caseConverter)
	{
	case CASE_CONVERTER.LOWER:
		values.output = values.output.toLowerCase();
		return false;

	case CASE_CONVERTER.UPPER:
		values.output = values.output.toUpperCase();
		return false;
	}

	ValueSchemaError.raise(CAUSE.CASE_CONVERTER, values, keyStack);
}
