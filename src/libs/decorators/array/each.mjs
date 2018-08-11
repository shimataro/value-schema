import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		each: _featureEach,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 * @return {void}
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
 * @return {void}
 */
function _featureEach(params, objAdjuster, ignoreEachErrors = false)
{
	params.objAdjuster = objAdjuster;
	params.ignoreEachErrors = ignoreEachErrors;
}

/**
 * adjuster
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @return {boolean} end adjustment
 * @throws {AdjusterError}
 */
function _adjust(params, values)
{
	const {objAdjuster, ignoreEachErrors} = params;
	if(objAdjuster === null)
	{
		return false;
	}

	const adjusted = [];
	for(const element of values.adjusted)
	{
		const adjustedElement = objAdjuster.adjust(element, (err) =>
		{
			if(ignoreEachErrors)
			{
				return;
			}

			const causeMap = {
				[CAUSE.TYPE]: CAUSE.EACH_TYPE,
				[CAUSE.NULL]: CAUSE.EACH_NULL,
				[CAUSE.EMPTY]: CAUSE.EACH_EMPTY,
				[CAUSE.REQUIRED]: CAUSE.EACH_REQUIRED,
				[CAUSE.ONLY]: CAUSE.EACH_ONLY,
				[CAUSE.MIN_VALUE]: CAUSE.EACH_MIN_VALUE,
				[CAUSE.MAX_VALUE]: CAUSE.EACH_MAX_VALUE,
				[CAUSE.MIN_LENGTH]: CAUSE.EACH_MIN_LENGTH,
				[CAUSE.MAX_LENGTH]: CAUSE.EACH_MAX_LENGTH,
				[CAUSE.PATTERN]: CAUSE.EACH_PATTERN,
				[CAUSE.CHECKSUM]: CAUSE.EACH_CHECKSUM,
			};
			if(causeMap.hasOwnProperty(err.cause))
			{
				err.cause = causeMap[err.cause];
			}
			throw new AdjusterError(err.cause, values.original);

		});

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

