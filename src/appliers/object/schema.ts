import {Key, Values} from "../../libs/types";
import {SchemaObject, applySchemaCore} from "../../libs/applySchemaCore";
import {onErrorDefault, onFinishedDefault} from "../../libs/BaseSchema";

export interface Options
{
	schema?: SchemaObject;
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack path to key that caused error
 * @returns ends applying
 * @throws {ValueSchemaError}
 */
export function applyTo<T>(values: Values, options: Options, keyStack: Key[]): values is Values<T>
{
	if(options.schema === undefined)
	{
		return false;
	}

	values.output = applySchemaCore(values.output, options.schema, onErrorDefault, onFinishedDefault, keyStack);
	return false;
}
