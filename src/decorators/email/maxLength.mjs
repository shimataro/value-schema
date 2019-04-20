import {CAUSE} from "../../libs/constants";
import BaseSchema from "../../libs/BaseSchema";
import ValueSchemaError from "../../libs/ValueSchemaError";

const MAX_LENGTH_LOCAL = 64;
const MAX_LENGTH_DOMAIN = 255;
const MAX_LENGTH = MAX_LENGTH_LOCAL + 1 + MAX_LENGTH_DOMAIN; // local-part + "@" + domain-part

export default BaseSchema.decoratorBuilder(_fit)
	.build();

/**
 * fit
 * @param {{}} params parameters
 * @param {Decorator-Values} values original / adjusted values
 * @param {Key[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {ValueSchemaError}
 */
function _fit(params, values, keyStack)
{
	if(values.adjusted.length > MAX_LENGTH)
	{
		ValueSchemaError.raise(CAUSE.MAX_LENGTH, values, keyStack);
	}

	const atPosition = values.adjusted.lastIndexOf("@");
	if(atPosition > MAX_LENGTH_LOCAL)
	{
		// local-part length error
		ValueSchemaError.raise(CAUSE.MAX_LENGTH, values, keyStack);
	}
	if(values.adjusted.length - atPosition - 1 > MAX_LENGTH_DOMAIN)
	{
		// domain-part length error
		ValueSchemaError.raise(CAUSE.MAX_LENGTH, values, keyStack);
	}

	return false;
}
