import {Key, Values} from "../../libs/types";
import {SchemaObject, applySchemaObjectCore} from "../../libs/applySchemaObjectCore";
import {onErrorDefault, onFinishedDefault} from "../../libs/BaseSchema";

export interface Options
{
	schemaObject?: SchemaObject;
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
	if(options.schemaObject === undefined)
	{
		return false;
	}

	values.output = applySchemaObjectCore(values.output, options.schemaObject, onErrorDefault, onFinishedDefault, keyStack);
	return false;
}
