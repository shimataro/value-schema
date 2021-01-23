import {Key, Values, isArray} from "../../libs/types";
import {ValueSchemaError} from "../../libs/ValueSchemaError";
import {BaseSchema} from "../../schemaClasses/BaseSchema";

type Each<T> = {
	/** specifies schema of each elements */
	schema: BaseSchema<T>;
	/** ignores even if some elements cause error */
	ignoresErrors: boolean;
}
type EachLike<T> = BaseSchema<T> | Each<T>;

export interface Options<T>
{
	/** specifies schema of each elements */
	each?: EachLike<T>;
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack key stack for error handling
 * @returns applied value
 */
export function applyTo<T>(values: Values, options: Options<T>, keyStack: Key[]): values is Values<T[]>
{
	const each = normalizeOptions(options.each);
	if(each === undefined)
	{
		return false;
	}

	// istanbul ignore next
	if(!isArray(values.output))
	{
		return false;
	}

	const adjustedValues: T[] = [];
	for(let idx = 0; idx < values.output.length; idx++)
	{
		const element = values.output[idx];

		// A trick in order to call _applyTo() private method from the outside (like "friend")
		try
		{
			const adjustedValue = each.schema["_applyTo"](element, (err) =>
			{
				if(each.ignoresErrors)
				{
					throw Error("!IGNORE!");
				}

				return ValueSchemaError.raise(err.cause, values, err.keyStack);
			}, [...keyStack, idx]);
			adjustedValues.push(adjustedValue);
		}
		catch(err)
		{
			if(err.message === "!IGNORE!")
			{
				// ignore
				continue;
			}
			throw err;
		}
	}

	// replace with adjusted values
	values.output = adjustedValues;
	return false;
}

/**
 * normalize options
 * @param each each
 * @returns normalized options
 */
function normalizeOptions<T>(each?: EachLike<T>): Each<T> | void
{
	if(each === undefined)
	{
		return;
	}
	if(each instanceof BaseSchema)
	{
		return {
			schema: each as BaseSchema<T>,
			ignoresErrors: false,
		};
	}
	return each;
}
