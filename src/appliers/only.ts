import {CAUSE} from "../libs/enums";
import {ValueSchemaError} from "../libs/ValueSchemaError";
import {Key, Values} from "../libs/types";

export interface Options<T>
{
	only?: T[];
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo<T>(values: Values, options: Options<T>, keyStack: Key[]): values is Values<T>
{
	const normalizedOptions: Required<Options<T>> = {
		only: [],
		...options,
	};

	if(normalizedOptions.only.length === 0)
	{
		return false;
	}
	if(normalizedOptions.only.includes(values.output as T))
	{
		return true;
	}

	ValueSchemaError.raise(CAUSE.ONLY, values, keyStack);
}
