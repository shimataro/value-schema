import AdjusterBase from "../../AdjusterBase";

const NAME = "type";

export default AdjusterBase.decoratorBuilder(NAME, _adjust)
	.build();

/**
 * adjust
 * @param {AdjusterBase.PARAMS} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @return {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values)
{
	if(typeof values.adjusted === "string")
	{
		return false;
	}

	values.adjusted = String(values.adjusted);
	return false;
}
