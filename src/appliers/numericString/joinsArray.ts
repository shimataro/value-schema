import {Key, Values, isArray} from "../../libs/types";

export interface Options
{
	/** joins array and makes string */
	joinsArray?: boolean;
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo(values: Values, options: Options, keyStack: Key[]): values is Values<string> // eslint-disable-line @typescript-eslint/no-unused-vars
{
	const normalizedOptions: Required<Options> = {
		joinsArray: false,
		...options,
	};

	if(!normalizedOptions.joinsArray)
	{
		return false;
	}

	// istanbul ignore next
	if(!isArray(values.output))
	{
		return false;
	}

	values.output = values.output.join("");
	return false;
}
