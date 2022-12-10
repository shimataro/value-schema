import {Key, Values, isArray} from "../../libs/types";

export interface Rules
{
	/** joins array and makes string */
	joinsArray?: boolean;
}

/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param _keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, rules: Rules, _keyStack: Key[]): values is Values<string>
{
	const normalizedRules: Required<Rules> = {
		joinsArray: false,
		...rules,
	};

	if(!normalizedRules.joinsArray)
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
