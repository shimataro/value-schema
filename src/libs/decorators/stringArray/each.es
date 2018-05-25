import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";
import factoryString from "../../../adjusters/string";

export default AdjusterBase.decoratorBuilder(_adjust)
	.init(_init)
	.features({
		ignoreEachErrors: _featureIgnoreEachErrors,
		eachDefault: _featureEachDefault,
		eachAllowEmptyString: _featureEachAllowEmptyString,
		eachTrim: _featureEachTrim,
		eachIn: _featureEachIn,
		eachMinLength: _featureEachMinLength,
		eachMaxLength: _featureEachMaxLength,
		eachPattern: _featureEachPattern,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 */
function _init(params)
{
	params.objAdjuster = factoryString();
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
 * @param {?string} value default value
 */
function _featureEachDefault(params, value)
{
	params.objAdjuster.default(value);
}

/**
 * allow empty string for each elements
 * @param {Object} params parameters
 * @param {?string} [value=null] value on empty
 */
function _featureEachAllowEmptyString(params, value = null)
{
	params.objAdjuster.allowEmptyString(value);
}

/**
 * remove whitespace from both ends for each elements
 * @param {Object} params parameters
 */
function _featureEachTrim(params)
{
	params.objAdjuster.trim();
}

/**
 * accept only specified values for each elements
 * @param {Object} params parameters
 * @param {...string} values values to be accepted
 */
function _featureEachIn(params, ...values)
{
	params.objAdjuster.in(...values);
}

/**
 * set min-length for each elements
 * @param {Object} params parameters
 * @param {int} length min-length; error if shorter
 */
function _featureEachMinLength(params, value)
{
	params.objAdjuster.minLength(value);
}

/**
 * set max-length for each elements
 * @param {Object} params parameters
 * @param {int} length max-length
 * @param {boolean} [adjust=false] truncate if longer; default is ERROR
 */
function _featureEachMaxLength(params, value, adjust = false)
{
	params.objAdjuster.maxLength(value, adjust);
}

/**
 * specify acceptable pattern by regular expression for each elements
 * @param {Object} params parameters
 * @param {string|String|RegExp} pattern acceptable pattern(regular expression); string or RegExp
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
				[CAUSE.EMPTY]: CAUSE.EACH_EMPTY,
				[CAUSE.REQUIRED]: CAUSE.EACH_REQUIRED,
				[CAUSE.IN]: CAUSE.EACH_IN,
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
