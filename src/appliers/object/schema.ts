import {Key, ObjectTypeOf, SchemaObject, Values} from "../../libs/types";
import {applySchemaObjectCore} from "../../libs/applySchemaObjectCore";

import {onErrorDefault, onFinishDefault} from "../../schemaClasses/BaseSchema";

export interface Rules<S>
{
	/** schema object */
	schemaObject?: S;
}

/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack path to key that caused error
 * @returns ends applying
 * @throws {ValueSchemaError}
 */
export function applyTo<S extends SchemaObject>(values: Values, rules: Rules<S>, keyStack: Key[]): values is Values<ObjectTypeOf<S>>
{
	if(rules.schemaObject === undefined)
	{
		return false;
	}

	values.output = applySchemaObjectCore(rules.schemaObject, values.output, onErrorDefault, onFinishDefault, keyStack);
	return false;
}
