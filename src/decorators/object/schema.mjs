import fitToObject from "../../libs/fitToObject";
import BaseSchema from "../../libs/BaseSchema";

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		schema: _featureSchema,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-Object-Schema
 * @property {SchemaObject} schema
 */

/**
 * init
 * @param {Params-Object-Schema} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.schema = null;
}

/**
 * apply schema
 * @param {Params-Object-Schema} params parameters
 * @param {SchemaObject} schema schema to apply
 * @returns {void}
 */
function _featureSchema(params, schema)
{
	params.schema = schema;
}

/**
 * fitting function
 * @param {Params-Object-Schema} params parameters
 * @param {Decorator-Values} values original / adjusted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} ends fitting
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	if(params.schema === null)
	{
		return false;
	}

	values.adjusted = fitToObject(values.adjusted, params.schema, BaseSchema.onErrorDefault, keyStack);
	return false;
}
