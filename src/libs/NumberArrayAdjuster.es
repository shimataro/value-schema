import {CAUSE} from "./constants";
import {isString} from "./utilities";
import AdjusterInterface from "./AdjusterInterface";
import NumberAdjuster from "./NumberAdjuster";
import AdjusterError from "./AdjusterError";

/**
 * adjuster for array of number
 */
export default class NumberArrayAdjuster extends AdjusterInterface
{
	/**
	 * constructor
	 */
	constructor()
	{
		super();

		this._objAdjuster = new NumberAdjuster();
		/** @type {?number[]} */
		this._default = null;
		/** @type {boolean} */
		this._allowEmpty = false;
		/** @type {?number[]} */
		this._valueOnEmpty = null;
		/** @type {?string|String|RegExp} */
		this._separator = null;
		/** @type {boolean} */
		this._toArray = false;
		/** @type {?int} */
		this._minLength = null;
		/** @type {?int} */
		this._maxLength = null;
		/** @type {boolean} */
		this._adjustMaxLength = false;
		/** @type {boolean} */
		this._ignoreEachErrors = false;
	}

	/**
	 * set default value; enable to omit
	 * @param {number[]} value default value
	 * @return {NumberArrayAdjuster}
	 */
	default(value)
	{
		this._default = value;
		return this;
	}

	/**
	 * adjust
	 * @param {_TypeValues} values
	 * @return {boolean} finished adjustment or not
	 * @private
	 */
	__adjustDefault(values)
	{
		if(values.adjustedValue !== undefined)
		{
			return false;
		}

		if(this._default !== null)
		{
			values.adjustedValue = this._default;
			return true;
		}

		const cause = CAUSE.REQUIRED;
		throw new AdjusterError(cause, values.originalValue);
	}

	/**
	 * allow empty string; will be adjusted to 0
	 * @param {?number[]} [value=null] value on empty
	 * @return {NumberArrayAdjuster}
	 */
	allowEmpty(value = null)
	{
		this._allowEmpty = true;
		this._valueOnEmpty = value;
		return this;
	}

	/**
	 * adjust
	 * @param {_TypeValues} values
	 * @return {boolean} finished adjustment or not
	 * @private
	 */
	__adjustEmpty(values)
	{
		if(values.adjustedValue !== "")
		{
			return false;
		}

		if(this._allowEmpty)
		{
			values.adjustedValue = this._valueOnEmpty;
			return true;
		}

		const cause = CAUSE.EMPTY;
		throw new AdjusterError(cause, values.originalValue);
	}

	/**
	 * allow string and set separator
	 * @param {string|String|RegExp} separator separator
	 * @return {NumberArrayAdjuster}
	 */
	separatedBy(separator)
	{
		this._separator = separator;
		return this;
	}

	/**
	 * convert to array, if not
	 * @return {NumberArrayAdjuster}
	 */
	toArray()
	{
		this._toArray = true;
		return this;
	}

	/**
	 * adjust
	 * @param {_TypeValues} values
	 * @return {boolean} finished adjustment or not
	 * @private
	 */
	__adjustToArray(values)
	{
		if(Array.isArray(values.adjustedValue))
		{
			return false;
		}
		if(isString(values.adjustedValue) && this._separator !== null)
		{
			values.adjustedValue = values.adjustedValue.split(this._separator);
			return false;
		}
		if(this._toArray)
		{
			values.adjustedValue = [values.adjustedValue];
			return false;
		}

		const cause = CAUSE.TYPE;
		throw new AdjusterError(cause, values.originalValue);
	}

	/**
	 * set min-length of array elements
	 * @param {int} length min-length; error if shorter
	 * @return {NumberArrayAdjuster}
	 */
	minLength(length)
	{
		this._minLength = length;
		return this;
	}

	/**
	 * adjust
	 * @param {_TypeValues} values
	 * @return {boolean} finished adjustment or not
	 * @private
	 */
	__adjustMinLength(values)
	{
		if(this._minLength === null)
		{
			return false;
		}
		if(values.adjustedValue.length >= this._minLength)
		{
			return false;
		}

		const cause = CAUSE.MIN_LENGTH;
		throw new AdjusterError(cause, values.originalValue);
	}

	/**
	 * set max-length of array elements
	 * @param {int} length max-length
	 * @param {boolean} [adjust=false] truncate if longer; default is ERROR
	 * @return {NumberArrayAdjuster}
	 */
	maxLength(length, adjust = false)
	{
		this._maxLength = length;
		this._adjustMaxLength = adjust;
		return this;
	}

	/**
	 * adjust
	 * @param {_TypeValues} values
	 * @return {boolean} finished adjustment or not
	 * @private
	 */
	__adjustMaxLength(values)
	{
		if(this._maxLength === null)
		{
			return false;
		}
		if(values.adjustedValue.length <= this._maxLength)
		{
			return false;
		}
		if(this._adjustMaxLength)
		{
			values.adjustedValue.splice(this._maxLength);
			return false;
		}

		const cause = CAUSE.MAX_LENGTH;
		throw new AdjusterError(cause, values.originalValue);
	}

	/**
	 * ignore each elements error
	 * @return {NumberArrayAdjuster}
	 */
	ignoreEachErrors()
	{
		this._ignoreEachErrors = true;
		return this;
	}

	/**
	 * set a default value for each elements
	 * @param {?number} value default value
	 * @return {NumberArrayAdjuster}
	 */
	eachDefault(value)
	{
		this._objAdjuster.default(value);
		return this;
	}

	/**
	 * allow empty string for each elements
	 * @param {?number} [value=null] value on empty
	 * @return {NumberArrayAdjuster}
	 */
	eachAllowEmpty(value = null)
	{
		this._objAdjuster.allowEmpty(value);
		return this;
	}

	/**
	 * accept only specified values for each elements
	 * @param {...number} values values to be accepted
	 * @return {NumberArrayAdjuster}
	 */
	eachIn(...values)
	{
		this._objAdjuster.in(...values);
		return this;
	}

	/**
	 * set min-value for each elements
	 * @param {number} value min-value
	 * @param {boolean} [adjust=false] adjust to min-value if value < min-value; default is ERROR
	 * @return {NumberArrayAdjuster}
	 */
	eachMinValue(value, adjust = false)
	{
		this._objAdjuster.minValue(value, adjust);
		return this;
	}

	/**
	 * set max-value for each elements
	 * @param {number} value min-value
	 * @param {boolean} [adjust=false] adjust to min-value if value < min-value; default is ERROR
	 * @return {NumberArrayAdjuster}
	 */
	eachMaxValue(value, adjust = false)
	{
		this._objAdjuster.maxValue(value, adjust);
		return this;
	}

	/**
	 * adjust
	 * @param {_TypeValues} values
	 * @return {boolean} finished adjustment or not
	 * @private
	 */
	__adjustEach(values)
	{
		const result = [];
		for(const element of values.adjustedValue)
		{
			const adjustedElement = this._objAdjuster.adjust(element, (err) =>
			{
				if(this._ignoreEachErrors)
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
				throw new AdjusterError(err.cause, values.originalValue);

			});

			if(adjustedElement === undefined)
			{
				continue;
			}
			result.push(adjustedElement);
		}

		// replace adjustedValue
		values.adjustedValue = result;
		return false;
	}

	/**
	 * do adjust
	 * @param {*} value value to be checked
	 * @param {?_OnError} onError callback function on error
	 * @return {number[]} adjusted value
	 */
	adjust(value, onError = null)
	{
		const values = {
			originalValue: value,
			adjustedValue: value,
		};

		try
		{
			if(this.__adjustDefault(values))
			{
				return values.adjustedValue;
			}
			if(this.__adjustEmpty(values))
			{
				return values.adjustedValue;
			}
			if(this.__adjustToArray(values))
			{
				return values.adjustedValue;
			}
			if(this.__adjustEach(values))
			{
				return values.adjustedValue;
			}
			if(this.__adjustMinLength(values))
			{
				return values.adjustedValue;
			}
			if(this.__adjustMaxLength(values))
			{
				return values.adjustedValue;
			}

			return values.adjustedValue;
		}
		catch(err)
		{
			return AdjusterInterface._handleError(onError, err.cause, err.value);
		}
	}
}
