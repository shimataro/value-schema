import AdjusterBase from "../../libs/AdjusterBase";
import AdjusterError from "../../libs/AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		each: _featureEach,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 * @returns {void}
 */
function _init(params)
{
	params.objAdjuster = null;
	params.ignoreEachErrors = false;
}

/**
 * apply constraints for each elements
 * @param {Object} params parameters
 * @param {AdjusterBase} objAdjuster adjuster to apply
 * @param {boolean} [ignoreEachErrors=false] ignore errors of each elements
 * @returns {void}
 */
function _featureEach(params, objAdjuster, ignoreEachErrors = false)
{
	params.objAdjuster = objAdjuster;
	params.ignoreEachErrors = ignoreEachErrors;
}

/**
 * adjuster
 * @param {Object} params parameters
 * @param {adjuster._.types.decorator.Values} values original / adjusted values
 * @param {adjuster._.types.Key[]} keyStack path to key that caused error
 * @returns {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values, keyStack)
{
	const {objAdjuster, ignoreEachErrors} = params;
	if(objAdjuster === null)
	{
		return false;
	}

	const adjusted = [];
	for(let idx = 0; idx < values.adjusted.length; idx += 1)
	{
		const element = values.adjusted[idx];
		const adjustedElement = objAdjuster._adjust(element, (err) =>
		{
			if(ignoreEachErrors)
			{
				return;
			}

			AdjusterError.raise(err.cause, values, err.keyStack);
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

