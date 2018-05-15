import {CAUSE} from "../../constants";
import AdjusterBase from "../../AdjusterBase";
import AdjusterError from "../../AdjusterError";
import StringAdjuster from "../../StringAdjuster";

const NAME = "each";

export default AdjusterBase.decoratorBuilder(NAME, _adjust)
	.init(_init)
	.chain({
		ignoreEachErrors: _chainIgnoreEachErrors,
		eachDefault: _chainEachDefault,
		eachAllowEmpty: _chainEachAllowEmpty,
		eachIn: _chainEachIn,
		eachMinLength: _chainEachMinLength,
		eachMaxLength: _chainEachMaxLength,
		eachPattern: _chainEachPattern,
	})
	.build();

/**
 * init
 * @param {Object} params parameters
 */
function _init(params)
{
	params.objAdjuster = new StringAdjuster();
}

/**
 * ignore each elements error
 * @param {Object} params parameters
 */
function _chainIgnoreEachErrors(params)
{
	params.ignoreEachErrors = true;
}

/**
 * set a default value for each elements
 * @param {Object} params parameters
 * @param {?string} value default value
 */
function _chainEachDefault(params, value)
{
	params.objAdjuster.default(value);
}

/**
 * allow empty string for each elements
 * @param {Object} params parameters
 * @param {?string} [value=null] value on empty
 */
function _chainEachAllowEmpty(params, value = null)
{
	params.objAdjuster.allowEmpty(value);
}

/**
 * accept only specified values for each elements
 * @param {Object} params parameters
 * @param {...string} values values to be accepted
 */
function _chainEachIn(params, ...values)
{
	params.objAdjuster.in(...values);
}

/**
 * set min-length for each elements
 * @param {Object} params parameters
 * @param {int} length min-length; error if shorter
 */
function _chainEachMinLength(params, value)
{
	params.objAdjuster.minLength(value);
}

/**
 * set max-length for each elements
 * @param {Object} params parameters
 * @param {int} length max-length
 * @param {boolean} [adjust=false] truncate if longer; default is ERROR
 */
function _chainEachMaxLength(params, value, adjust = false)
{
	params.objAdjuster.maxLength(value, adjust);
}

/**
 * specify acceptable pattern by regular expression for each elements
 * @param {Object} params parameters
 * @param {string|String|RegExp} pattern acceptable pattern(regular expression); string or RegExp
 */
function _chainEachPattern(params, pattern)
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
