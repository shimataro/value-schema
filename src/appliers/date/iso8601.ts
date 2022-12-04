import {RULE, ValueSchemaError} from "../../exporter";
import {Key, Values, isString} from "../../libs/types";

const PATTERN_WITH_TZ = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;
const PATTERN_WITHOUT_TZ = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(.\d{1,3})?)?$/;

export interface Rules
{
	iso8601?: {
		defaultTimezone?: string,
	},
}

type NormalizedRules = Required<Rules>;

/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<Date> // eslint-disable-line @typescript-eslint/no-unused-vars
{
	const normalizedRules: NormalizedRules = {
		iso8601: {
			defaultTimezone: "",
		},
		...rules,
	};

	if(!isString(values.output))
	{
		return false;
	}

	const normalizedValue = normalize(values.output, normalizedRules);
	if(normalizedValue === null)
	{
		// failed to normalize
		return ValueSchemaError.raise(RULE.PATTERN, values, keyStack);
	}

	values.output = new Date(normalizedValue);
	return false;
}

/**
 * normalize date format
 * @param value value to normalize
 * @param rules rules
 * @returns normalized value
 */
function normalize(value: string, rules: NormalizedRules): string | null
{
	if(PATTERN_WITH_TZ.test(value))
	{
		return value;
	}

	// if default timezone is specified, timezone can be omitted.
	if(rules.iso8601.defaultTimezone !== "")
	{
		if(PATTERN_WITHOUT_TZ.test(value))
		{
			return `${value}${rules.iso8601.defaultTimezone}`;
		}
	}

	return null;
}
