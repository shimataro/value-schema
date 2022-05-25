import {Key, Values, isString} from "../../libs/types";

export interface Options
{
	/** assumes input value is separated by pattern and ignores it */
	separatedBy?: string | RegExp;
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, options: Options, keyStack: Key[]): values is Values<string> // eslint-disable-line @typescript-eslint/no-unused-vars
{
	if(options.separatedBy === undefined)
	{
		return false;
	}

	// istanbul ignore next
	if(!isString(values.output))
	{
		return false;
	}

	values.output = values.output.split(options.separatedBy).join("");
	return false;
}
