import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";
import NumberAdjuster from "../../NumberAdjuster";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		ignoreEachErrors: _featureIgnoreEachErrors,
		eachDefault: _featureEachDefault,
		eachAllowEmpty: _featureEachAllowEmpty,
		eachIn: _featureEachIn,
		eachMinValue: _featureEachMinValue,
		eachMaxValue: _featureEachMaxValue,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 */
function _init(params)
{
	params.objAdjuster = new NumberAdjuster();
}

/**
 * ignore each elements error
 * @param {Object} params parameters
 */
function _featureIgnoreEachErrors(params)
{
	params.ignoreEachErrors = true;
}

/**
 * set a default value for each elements
 * @param {Object} params parameters
 * @param {?number} value default value
 */
function _featureEachDefault(params, value)
{
	params.objAdjuster.default(value);
}

/**
 * allow empty string for each elements
 * @param {Object} params parameters
 * @param {?number} [value=null] value on empty
 */
function _featureEachAllowEmpty(params, value = null)
{
	params.objAdjuster.allowEmpty(value);
}

/**
 * accept only specified values for each elements
 * @param {Object} params parameters
 * @param {...number} values values to be accepted
 */
function _featureEachIn(params, ...values)
{
	params.objAdjuster.in(...values);
}

/**
 * set min-value for each elements
 * @param {Object} params parameters
 * @param {number} value min-value
 * @param {boolean} [adjust=false] adjust to min-value if value < min-value; default is ERROR
 */
function _featureEachMinValue(params, value, adjust = false)
{
	params.objAdjuster.minValue(value, adjust);
}

/**
 * set max-value for each elements
 * @param {Object} params parameters
 * @param {number} value min-value
 * @param {boolean} [adjust=false] adjust to min-value if value < min-value; default is ERROR
 */
function _featureEachMaxValue(params, value, adjust = false)
{
	params.objAdjuster.maxValue(value, adjust);
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
	const adjusted = [];
	for(const element of values.adjusted)
	{
		const adjustedElement = params.objAdjuster.adjust(element, (err) =>
		{
			if(params.ignoreEachErrors)
			{
				return;
			}

			const causeMap = {
				[CAUSE.TYPE]: CAUSE.EACH_TYPE,
				[CAUSE.EMPTY]: CAUSE.EACH_EMPTY,
				[CAUSE.REQUIRED]: CAUSE.EACH_REQUIRED,
				[CAUSE.IN]: CAUSE.EACH_IN,
				[CAUSE.MIN_VALUE]: CAUSE.EACH_MIN_VALUE,
				[CAUSE.MAX_VALUE]: CAUSE.EACH_MAX_VALUE,
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
