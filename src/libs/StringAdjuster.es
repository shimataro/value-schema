import {CAUSE} from "./constants";
import {isString} from "./utilities";
import AdjusterInterface from "./AdjusterInterface";
import AdjusterError from "./AdjusterError";

/**
 * adjuster for string
 */
export default class StringAdjuster extends AdjusterInterface
{
	/**
	 * constructor
	 */
	constructor()
	{
		super();

		/** @type {?string} */
		this._default = null;
		/** @type {boolean} */
		this._allowEmpty = false;
		/** @type {?string} */
		this._valueOnEmpty = null;
		/** @type {string[]} */
		this._in = null;
		/** @type {?int} */
		this._minLength = null;
		/** @type {?int} */
		this._maxLength = null;
		/** @type {boolean} */
		this._adjustMaxLength = false;
		/** @type {?RegExp} */
		this._pattern = null;
	}

	/**
	 * adjust type
	 * @param {_TypeValues} values
	 * @return {boolean} finished adjustment or not
	 * @private
	 */
	__adjustType(values)
	{
		if(isString(values.adjustedValue))
		{
			return false;
		}

		values.adjustedValue = String(values.adjustedValue);
		return false;
	}

	/**
	 * set default value; enable to omit
	 * @param {string} value default value
	 * @return {StringAdjuster}
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
	 * allow empty string (NOT undefined)
	 * @param {?string} [value=null] value on empty
	 * @return {StringAdjuster}
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
	 * accept only specified values
	 * @param {...string} values values to be accepted
	 * @return {StringAdjuster}
	 */
	in(...values)
	{
		this._in = values;
		return this;
	}

	/**
	 * adjust
	 * @param {_TypeValues} values
	 * @return {boolean} finished adjustment or not
	 * @private
	 */
	__adjustIn(values)
	{
		if(this._in === null)
		{
			return false;
		}
		if(this._in.includes(values.adjustedValue))
		{
			return true;
		}

		const cause = CAUSE.IN;
		throw new AdjusterError(cause, values.originalValue);
	}

	/**
	 * set min-length
	 * @param {int} length min-length; error if shorter
	 * @return {StringAdjuster}
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
	 * set max-length
	 * @param {int} length max-length
	 * @param {boolean} [adjust=false] truncate if longer; default is ERROR
	 * @return {StringAdjuster}
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
			values.adjustedValue = values.adjustedValue.substr(0, this._maxLength);
			return false;
		}

		const cause = CAUSE.MAX_LENGTH;
		throw new AdjusterError(cause, values.originalValue);
	}

	/**
	 * specify acceptable pattern by regular expression
	 * @param {string|String|RegExp} pattern acceptable pattern(regular expression); string or RegExp
	 * @return {StringAdjuster}
	 */
	pattern(pattern)
	{
		if(isString(pattern))
		{
			pattern = new RegExp(pattern);
		}
		this._pattern = pattern;
		return this;
	}

	/**
	 * adjust
	 * @param {_TypeValues} values
	 * @return {boolean} finished adjustment or not
	 * @private
	 */
	__adjustPattern(values)
	{
		if(this._pattern === null)
		{
			return false;
		}
		if(this._pattern.test(values.adjustedValue))
		{
			return false;
		}

		const cause = CAUSE.PATTERN;
		throw new AdjusterError(cause, values.originalValue);
	}

	/**
	 * do adjust
	 * @param {*} value value to be checked
	 * @param {?_OnError} onError callback function on error
	 * @return {string} adjusted value
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
			if(this.__adjustType(values))
			{
				return values.adjustedValue;
			}
			if(this.__adjustIn(values))
			{
				return values.adjustedValue;
			}
			if(this.__adjustEmpty(values))
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
			if(this.__adjustPattern(values))
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
