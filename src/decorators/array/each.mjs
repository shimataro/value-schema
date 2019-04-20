import BaseSchema from "../../libs/BaseSchema";
import ValueSchemaError from "../../libs/ValueSchemaError";

export default BaseSchema.decoratorBuilder(_fit)
	.init(_init)
	.features({
		each: _featureEach,
	})
	.build();

/**
 * @package
 * @typedef {Params} Params-Array-Each
 * @property {BaseSchema} schema
 * @property {boolean} ignoreEachErrors
 */

/**
 * init
 * @param {Params-Array-Each} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.schema = null;
	params.ignoreEachErrors = false;
}

/**
 * apply schema to each elements
 * @param {Params-Array-Each} params parameters
 * @param {BaseSchema} schema valueSchema to apply
 * @param {boolean} [ignoreEachErrors=false] ignore errors of each elements
 * @returns {void}
 */
function _featureEach(params, schema, ignoreEachErrors = false)
{
	params.schema = schema;
	params.ignoreEachErrors = ignoreEachErrors;
}

/**
 * valueSchema
 * @param {Params-Array-Each} params parameters
 * @param {Decorator-Values} values original / adjusted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	const {schema, ignoreEachErrors} = params;
	if(schema === null)
	{
		return false;
	}

	const adjusted = [];
	for(let idx = 0; idx < values.adjusted.length; idx += 1)
	{
		const element = values.adjusted[idx];
		const adjustedElement = schema._fit(element, (err) =>
		{
			if(ignoreEachErrors)
			{
				return;
			}

			ValueSchemaError.raise(err.cause, values, err.keyStack);
		}, [...keyStack, idx]);

		if(adjustedElement === undefined)
		{
			continue;
		}
		adjusted.push(adjustedElement);
	}

	// replace adjusted value
	values.adjusted = adjusted;
	return false;
}
