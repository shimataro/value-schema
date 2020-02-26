import {Key, Values} from "../libs/types";

export interface Options<T>
{
	converter?: (value: T) => T | null;
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo<T>(values: Values, options: Options<T>, keyStack: Key[]): values is Values<T> // eslint-disable-line @typescript-eslint/no-unused-vars
{
	if(options.converter === undefined)
	{
		return false;
	}

	values.output = options.converter(values.output as T);
	return true;
}
