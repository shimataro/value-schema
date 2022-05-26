import {Key, Values, isString} from "../../libs/types";

export interface Rules
{
	/** removes whitespace from both ends of a string */
	trims?: boolean;
}

/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<string> // eslint-disable-line @typescript-eslint/no-unused-vars
{
	const normalizedRules: Required<Rules> = {
		trims: false,
		...rules,
	};

	if(!normalizedRules.trims)
	{
		return false;
	}

	// istanbul ignore next
	if(!isString(values.output))
	{
		return false;
	}

	values.output = values.output.trim();
	return false;
}
