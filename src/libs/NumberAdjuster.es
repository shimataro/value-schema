import {CAUSE} from "./constants";
import AdjusterInterface from "./AdjusterInterface";

/**
 * adjuster for number
 */
export default class NumberAdjuster extends AdjusterInterface
{
	/**
	 * constructor
	 */
	constructor()
	{
		super();

		/** @type {?number} */
		this._default = null;
		/** @type {boolean} */
		this._allowEmpty = false;
		/** @type {number[]} */
		this._in = null;
		/** @type {?number} */
		this._minValue = null;
		/** @type {boolean} */
		this._adjustMinValue = false;
		/** @type {?number} */
		this._maxValue = null;
		/** @type {boolean} */
		this._adjustMaxValue = false;
	}

	/**
	 * set default value; enable to omit
	 * @param {number} value default value
	 * @return {NumberAdjuster}
	 */
	default(value)
	{
		this._default = value;
		return this;
	}

	/**
	 * allow empty string; will be adjusted to 0
	 * @return {NumberAdjuster}
	 */
	allowEmpty()
	{
		this._allowEmpty = true;
		return this;
	}

	/**
	 * accept only specified values
	 * @param {...number} values values to be accepted
	 * @return {NumberAdjuster}
	 */
	in(...values)
	{
		this._in = values;
		return this;
	}

	/**
	 * set min-value
	 * @param {number} value min-value
	 * @param {boolean} [adjust=false] adjust to min-value if value < min-value; default is ERROR
	 * @return {NumberAdjuster}
	 */
	minValue(value, adjust = false)
	{
		this._minValue = value;
		this._adjustMinValue = adjust;
		return this;
	}

	/**
	 * set max-value
	 * @param {number} value max-value
	 * @param {boolean} [adjust=false] adjust to max-value if value > max-value; default is ERROR
	 * @return {NumberAdjuster}
	 */
	maxValue(value, adjust = false)
	{
		this._maxValue = value;
		this._adjustMaxValue = adjust;
		return this;
	}

	/**
	 * do adjust
	 * @param {*} value value to be checked
	 * @param {?_OnError} onError callback function on error
	 * @return {number} adjusted value
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

		// empty string
		if(value === "")
		{
			if(!this._allowEmpty)
			{
				const cause = CAUSE.EMPTY;
				return AdjusterInterface._handleError(onError, cause, value);
			}
		}

		let adjustedValue = Number(value);

		// failed to cast
		if(isNaN(adjustedValue))
		{
			const cause = CAUSE.TYPE;
			return AdjusterInterface._handleError(onError, cause, value);
		}

		if(this._in !== null)
		{
			if(!this._in.includes(adjustedValue))
			{
				const cause = CAUSE.IN;
				return AdjusterInterface._handleError(onError, cause, value);
			}
			return adjustedValue;
		}

		if(this._minValue !== null && adjustedValue < this._minValue)
		{
			if(!this._adjustMinValue)
			{
				const cause = CAUSE.MIN_VALUE;
				return AdjusterInterface._handleError(onError, cause, value);
			}
			return this._minValue;
		}
		if(this._maxValue !== null && adjustedValue > this._maxValue)
		{
			if(!this._adjustMaxValue)
			{
				const cause = CAUSE.MAX_VALUE;
				return AdjusterInterface._handleError(onError, cause, value);
			}
			return this._maxValue;
		}

		return adjustedValue;
	}
}
