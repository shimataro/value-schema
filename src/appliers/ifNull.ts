import {CAUSE} from "../libs/enums";
import {ValueSchemaError} from "../libs/ValueSchemaError";
import {Key, Values} from "../libs/types";

export interface Options<T>
{
	ifNull?: T | null;
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo<T>(values: Values, options: Options<T>, keyStack: Key[]): values is Values<T>
{
	if(values.output !== null)
	{
		return false;
	}

	if(options.ifNull !== undefined)
	{
		values.output = options.ifNull;
		return true;
	}

	ValueSchemaError.raise(CAUSE.NULL, values, keyStack);
}
