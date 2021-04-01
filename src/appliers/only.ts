import {Key, Values} from "../libs/types";
import {CAUSE, ValueSchemaError} from "../libs/ValueSchemaError";

export interface Options<T>
{
	/** accepts only specified values */
	only?: T[];
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
	const normalizedOptions: Required<Options<T>> = {
		only: [],
		...options,
	};

	if(normalizedOptions.only.length === 0)
	{
		return false;
	}

	// Array.prototype.include() might not exist in old version
	for(const value of normalizedOptions.only)
	{
		if(values.output === value)
		{
			return true;
		}
	}

	return ValueSchemaError.raise(CAUSE.ONLY, values, keyStack);
}
