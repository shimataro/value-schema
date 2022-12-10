import {isArray, isNumber, Key, Values} from "../../libs/types";
import {RULE, ValueSchemaError} from "../../libs/ValueSchemaError";

type MaxLength = {
	/** maximum size of array */
	length: number;
	/** removes trailing elements if too long */
	trims: boolean;
};
type MaxLengthLike = number | MaxLength;

export interface Rules
{
	/** maximum size of array */
	maxLength?: MaxLengthLike;
}

/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo<T>(values: Values, rules: Rules, keyStack: Key[]): values is Values<T>
{
	const maxLength = normalizeRules(rules.maxLength);

	// istanbul ignore next
	if(!isArray(values.output))
	{
		return false;
	}

	if(values.output.length <= maxLength.length)
	{
		return false;
	}
	if(maxLength.trims)
	{
		values.output.splice(maxLength.length);
		return false;
	}

	return ValueSchemaError.raise(RULE.MAX_LENGTH, values, keyStack);
}

/**
 * normalize rules
 * @param maxLength maximum length
 * @returns normalized rules
 */
function normalizeRules(maxLength?: MaxLengthLike): MaxLength
{
	const defaultRules: MaxLength = {
		length: Number.MAX_SAFE_INTEGER,
		trims: false,
	};

	if(maxLength === undefined)
	{
		return defaultRules;
	}
	if(isNumber(maxLength))
	{
		return {
			...defaultRules,
			length: maxLength,
		};
	}
	return {
		...defaultRules,
		...maxLength,
	};
}
