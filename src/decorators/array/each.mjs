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
 * @param {BaseSchema} schema schema object to apply
 * @param {boolean} [ignoreEachErrors=false] ignore errors of each elements
 * @returns {void}
 */
function _featureEach(params, schema, ignoreEachErrors = false)
{
	params.schema = schema;
	params.ignoreEachErrors = ignoreEachErrors;
}

/**
 * fitting function
 * @param {Params-Array-Each} params parameters
 * @param {Decorator-Values} values original / fitted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} ends fitting
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	const {schema, ignoreEachErrors} = params;
	if(schema === null)
	{
		return false;
	}

	const fitted = [];
	for(let idx = 0; idx < values.fitted.length; idx += 1)
	{
		const element = values.fitted[idx];
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
		fitted.push(adjustedElement);
	}

	// replace fitted value
	values.fitted = fitted;
	return false;
}
