import {Key, Values} from "../../libs/types";
import {BaseSchema} from "../../libs/BaseSchema";
import {CAUSE, ValueSchemaError} from "../../libs/ValueSchemaError";

export interface Options<T>
{
	schemas?: BaseSchema<T>[];
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
		schemas: [],
		...options,
	};

	const err = new ValueSchemaError(CAUSE.UNION, values.input, keyStack);
	for(const schema of normalizedOptions.schemas)
	{
		try
		{
			values.output = schema.applyTo(values.output);
			return true;
		}
		catch(unionError)
		{
			// istanbul ignore next
			if(ValueSchemaError.is(unionError))
			{
				err.unionErrors.push(unionError);
			}
		}
	}

	throw err;
}
