import {CAUSE} from "../../libs/constants";
import {isObject} from "../../libs/types";
import BaseSchema from "../../libs/BaseSchema";
import ValueSchemaError from "../../libs/ValueSchemaError";

export default BaseSchema.decoratorBuilder(_fit)
	.build();

/**
 * fitting function
 * @param {{}} params parameters
 * @param {Decorator-Values} values original / fitted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} ends fitting
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	if(isObject(values.fitted))
	{
		return false;
	}

	ValueSchemaError.raise(CAUSE.TYPE, values.original, keyStack);
}
