import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";
import factoryNumber from "../../../adjusters/number";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		ignoreEachErrors: _featureIgnoreEachErrors,
		eachDefault: _featureEachDefault,
		eachAllowNull: _featureEachAllowNull,
		eachAllowEmptyString: _featureEachAllowEmptyString,
		eachOnly: _featureEachOnly,
		eachMinValue: _featureEachMinValue,
		eachMaxValue: _featureEachMaxValue,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 * @return {void}
 */
function _init(params)
{
	params.objAdjuster = factoryNumber();
}

/**
 * ignore each elements error
 * @param {Object} params parameters
 * @return {void}
 */
function _featureIgnoreEachErrors(params)
{
	params.ignoreEachErrors = true;
}

/**
 * set a default value for each elements
 * @param {Object} params parameters
 * @param {?number} value default value
 * @return {void}
 */
function _featureEachDefault(params, value)
{
	params.objAdjuster.default(value);
}

/**
 * allow null for each elements
 * @param {Object} params parameters
 * @param {?number} [value=null] value on null
 * @return {void}
 */
function _featureEachAllowNull(params, value = null)
{
	params.objAdjuster.allowNull(value);
}

/**
 * allow empty string for each elements
 * @param {Object} params parameters
 * @param {?number} [value=null] value on empty
 * @return {void}
 */
function _featureEachAllowEmptyString(params, value = null)
{
	params.objAdjuster.allowEmptyString(value);
}

/**
 * accept only specified values for each elements
 * @param {Object} params parameters
 * @param {...number} values values to be accepted
 * @return {void}
 */
function _featureEachOnly(params, ...values)
{
	params.objAdjuster.only(...values);
}

/**
 * set min-value for each elements
 * @param {Object} params parameters
 * @param {number} value min-value
 * @param {boolean} [adjust=false] adjust to min-value if value < min-value; default is ERROR
 * @return {void}
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
 * @return {void}
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
				[CAUSE.NULL]: CAUSE.EACH_NULL,
				[CAUSE.EMPTY]: CAUSE.EACH_EMPTY,
				[CAUSE.REQUIRED]: CAUSE.EACH_REQUIRED,
				[CAUSE.ONLY]: CAUSE.EACH_ONLY,
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
