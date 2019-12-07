import {CAUSE} from "./../../libs/constants";
import BaseSchema from "./../../libs/BaseSchema";
import ValueSchemaError from "./../../libs/ValueSchemaError";

const REGEXP = /^\d+$/;

export default BaseSchema.decoratorBuilder(_fit)
	.build();

/**
 * fit
 * @param {{}} params parameters
 * @param {Decorator-Values} values original / fitted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} ends fitting
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	if(REGEXP.test(values.fitted))
	{
		return false;
	}

	ValueSchemaError.raise(CAUSE.PATTERN, values, keyStack);
}
