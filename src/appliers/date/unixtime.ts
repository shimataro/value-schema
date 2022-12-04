import {Key, Values, isNumber} from "../../libs/types";

export const UNIXTIME_PRECISION =
{
	MILLISECONDS: 0,
	SECONDS: 1,
} as const;
type UNIXTIME_PRECISION = typeof UNIXTIME_PRECISION[keyof typeof UNIXTIME_PRECISION];

export interface Rules
{
	unixtime?: {
		precision: UNIXTIME_PRECISION,
	},
}

/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
export function applyTo(values: Values, rules: Rules, keyStack: Key[]): values is Values<Date> // eslint-disable-line @typescript-eslint/no-unused-vars
{
	// skip if "unixtime-mode" is disabled
	if(rules.unixtime === undefined)
	{
		return false;
	}

	if(!isNumber(values.output))
	{
		return false;
	}

	switch(rules.unixtime.precision)
	{
	case UNIXTIME_PRECISION.MILLISECONDS:
		values.output = new Date(values.output);
		return false;

	case UNIXTIME_PRECISION.SECONDS:
		values.output = new Date(values.output * 1000);
		return false;
	}

	return false;
}
