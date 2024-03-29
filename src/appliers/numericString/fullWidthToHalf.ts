import * as string from "../../libs/string";
import {isString, Key, Values} from "../../libs/types";

export interface Rules
{
	/** converts full width digit to half width */
	fullWidthToHalf?: boolean;
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
		fullWidthToHalf: false,
		...rules,
	};

	if(!normalizedRules.fullWidthToHalf)
	{
		return false;
	}

	// istanbul ignore next
	if(!isString(values.output))
	{
		return false;
	}

	values.output = string.toHalfWidth(values.output, /[０-９]+/g);
	return false;
}
