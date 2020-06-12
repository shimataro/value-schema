import {Key, ObjectTypeOf, SchemaObject, Values} from "../../libs/types";
import {applySchemaObjectCore} from "../../libs/applySchemaObjectCore";
import {onErrorDefault, onFinishedDefault} from "../../libs/BaseSchema";

export interface Options<S>
{
	schemaObject?: S;
}

/**
 * apply schema
 * @param values input/output values
 * @param options options
 * @param keyStack path to key that caused error
 * @returns ends applying
 * @throws {ValueSchemaError}
 */
export function applyTo<S extends SchemaObject>(values: Values, options: Options<S>, keyStack: Key[]): values is Values<ObjectTypeOf<S>>
{
	if(options.schemaObject === undefined)
	{
		return false;
	}

	values.output = applySchemaObjectCore(options.schemaObject, values.output, onErrorDefault, onFinishedDefault, keyStack);
	return false;
}
