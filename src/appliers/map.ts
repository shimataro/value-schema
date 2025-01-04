import {isObject} from "../libs/types";

export interface Rules
{
	/** map to input property (only available in object) */
	map?: string;
}

/**
 * check the input has rules of map or not
 * @param rules unknown rules
 * @returns Yes/No
 */
export function hasMapRules(rules: unknown): rules is Required<Rules>
{
	if(!isObject(rules))
	{
		return false;
	}

	return typeof rules.map === "string";
}
