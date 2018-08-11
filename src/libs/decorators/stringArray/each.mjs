import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";
import factoryString from "../../../adjusters/string";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		ignoreEachErrors: _featureIgnoreEachErrors,
		eachStrict: _featureEachStrict,
		eachDefault: _featureEachDefault,
		eachAcceptNull: _featureEachAcceptNull,
		eachAcceptEmptyString: _featureEachAcceptEmptyString,
		eachTrim: _featureEachTrim,
		eachOnly: _featureEachOnly,
		eachMinLength: _featureEachMinLength,
		eachMaxLength: _featureEachMaxLength,
		eachPattern: _featureEachPattern,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 * @return {void}
 */
function _init(params)
{
	params.objAdjuster = factoryString();
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
 * enable strict type check for each elements
 * @param {Object} params parameters
 * @return {void}
 */
function _featureEachStrict(params)
{
	params.objAdjuster.strict();
}

/**
 * set a default value for each elements
 * @param {Object} params parameters
 * @param {?string} value default value
 * @return {void}
 */
function _featureEachDefault(params, value)
{
	params.objAdjuster.default(value);
}

/**
 * accept null for each elements
 * @param {Object} params parameters
 * @param {?number} [value=null] value on null
 * @return {void}
 */
function _featureEachAcceptNull(params, value = null)
{
	params.objAdjuster.acceptNull(value);
}

/**
 * accept empty string for each elements
 * @param {Object} params parameters
 * @param {?string} [value=null] value on empty
 * @return {void}
 */
function _featureEachAcceptEmptyString(params, value = null)
{
	params.objAdjuster.acceptEmptyString(value);
}

/**
 * remove whitespace from both ends for each elements
 * @param {Object} params parameters
 * @return {void}
 */
function _featureEachTrim(params)
{
	params.objAdjuster.trim();
}

/**
 * accept only specified values for each elements
 * @param {Object} params parameters
 * @param {...string} values values to be accepted
 * @return {void}
 */
function _featureEachOnly(params, ...values)
{
	params.objAdjuster.only(...values);
}

/**
 * set min-length for each elements
 * @param {Object} params parameters
 * @param {number} value min-length; error if shorter
 * @return {void}
 */
function _featureEachMinLength(params, value)
{
	params.objAdjuster.minLength(value);
}

/**
 * set max-length for each elements
 * @param {Object} params parameters
 * @param {number} value max-length
 * @param {boolean} [adjust=false] truncate if longer; default is ERROR
 * @return {void}
 */
function _featureEachMaxLength(params, value, adjust = false)
{
	params.objAdjuster.maxLength(value, adjust);
}

/**
 * specify acceptable pattern by regular expression for each elements
 * @param {Object} params parameters
 * @param {string|String|RegExp} pattern acceptable pattern(regular expression); string or RegExp
 * @return {void}
 */
function _featureEachPattern(params, pattern)
{
	params.objAdjuster.pattern(pattern);
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
				[CAUSE.MIN_LENGTH]: CAUSE.EACH_MIN_LENGTH,
				[CAUSE.MAX_LENGTH]: CAUSE.EACH_MAX_LENGTH,
				[CAUSE.PATTERN]: CAUSE.EACH_PATTERN,
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
