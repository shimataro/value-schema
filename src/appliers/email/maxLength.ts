import {isString, Key, Values} from "../../libs/types";
import {RULE, ValueSchemaError} from "../../libs/ValueSchemaError";

const MAX_LENGTH_LOCAL = 64;
const MAX_LENGTH_DOMAIN = 255;
const MAX_LENGTH = MAX_LENGTH_LOCAL + 1 + MAX_LENGTH_DOMAIN; // local-part + "@" + domain-part

export interface Rules
{
}

/**
 * apply schema
 * @param values input/output values
 * @param _rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, _rules: Rules, keyStack: Key[]): values is Values<string>
{
	// istanbul ignore next
	if(!isString(values.output))
	{
		return false;
	}

	if(values.output.length > MAX_LENGTH)
	{
		ValueSchemaError.raise(RULE.MAX_LENGTH, values, keyStack);
	}

	const atPosition = values.output.lastIndexOf("@");
	if(atPosition > MAX_LENGTH_LOCAL)
	{
		// local-part length error
		ValueSchemaError.raise(RULE.MAX_LENGTH, values, keyStack);
	}
	if(values.output.length - atPosition - 1 > MAX_LENGTH_DOMAIN)
	{
		// domain-part length error
		ValueSchemaError.raise(RULE.MAX_LENGTH, values, keyStack);
	}

	return false;
}
