import {CAUSE} from "./constants";
import AdjusterInterface from "./AdjusterInterface";

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
	 * specify acceptable pattern by regular expression
	 * @param {RegExp} pattern acceptable pattern
	 * @return {StringAdjuster}
	 */
	pattern(pattern)
	{
		this._pattern = pattern;
		return this;
	}

	/**
	 * do adjust
	 * @param {*} value value to be checked
	 * @param {?_OnError} onError callback function on error
	 * @return {string} adjusted value
	 */
	adjust(value, onError = null)
	{
		// omitted
		if(value === undefined)
		{
			if(this._default === null)
			{
				const cause = CAUSE.REQUIRED;
				return AdjusterInterface._handleError(onError, cause, value);
			}
			return this._default;
		}

		let adjustedValue = String(value);

		if(this._in !== null)
		{
			if(!this._in.includes(adjustedValue))
			{
				const cause = CAUSE.IN;
				return AdjusterInterface._handleError(onError, cause, value);
			}
			return adjustedValue;
		}

		// empty string
		if(adjustedValue.length === 0)
		{
			if(!this._allowEmpty)
			{
				const cause = CAUSE.EMPTY;
				return AdjusterInterface._handleError(onError, cause, value);
			}
			return this._valueOnEmpty;
		}

		if(this._minLength !== null && adjustedValue.length < this._minLength)
		{
			const cause = CAUSE.MIN_LENGTH;
			return AdjusterInterface._handleError(onError, cause, value);
		}
		if(this._maxLength !== null && adjustedValue.length > this._maxLength)
		{
			if(!this._adjustMaxLength)
			{
				const cause = CAUSE.MAX_LENGTH;
				return AdjusterInterface._handleError(onError, cause, value);
			}
			adjustedValue = adjustedValue.substr(0, this._maxLength);
		}

		if(this._pattern !== null && !this._pattern.test(adjustedValue))
		{
			const cause = CAUSE.PATTERN;
			return AdjusterInterface._handleError(onError, cause, value);
		}

		return adjustedValue;
	}
}
