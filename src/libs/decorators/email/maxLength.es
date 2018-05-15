import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

const MAX_LENGTH_LOCAL = 64;
const MAX_LENGTH_DOMAIN = 255;
const MAX_LENGTH = MAX_LENGTH_LOCAL + 1 + MAX_LENGTH_DOMAIN; // local-part + "@" + domain-part

export default AdjusterBase.decoratorBuilder(_adjust)
	.build();

/**
 * adjust
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values
 * @return {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values)
{
	const cause = CAUSE.MAX_LENGTH;
	const err = new AdjusterError(cause, values.original);

	if(values.adjusted.length > MAX_LENGTH)
	{
		throw err;
	}

	const atPosition = values.adjusted.lastIndexOf("@");
	if(atPosition > MAX_LENGTH_LOCAL)
	{
		// local-part length error
		throw err;
	}
	if(values.adjusted.length - atPosition - 1 > MAX_LENGTH_DOMAIN)
	{
		// domain-part length error
		throw err;
	}

	return false;
}
