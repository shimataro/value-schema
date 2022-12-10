import {Key, Values} from "../../libs/types";

import {REGEXP_EMAIL} from "../../libs/regexp/email";

import * as pattern from "../string/pattern";

export interface Rules
{
	/** overwrites email pattern */
	pattern?: RegExp;
}

/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<string>
{
	const normalizedRules: Required<Rules> = {
		pattern: REGEXP_EMAIL,
		...rules,
	};

	return pattern.applyTo(values, normalizedRules, keyStack);
}
