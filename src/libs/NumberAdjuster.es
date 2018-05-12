import {CAUSE} from "./constants";
import AdjusterInterface from "./AdjusterInterface";
import AdjusterError from "./AdjusterError";

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
		/** @type {?number} */
		this._valueOnEmpty = null;
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
	 * adjust type
	 * @param {_TypeValues} values
	 * @return {boolean} finished adjustment or not
	 * @private
	 */
	__adjustType(values)
	{
		if(typeof values.adjustedValue === "number")
		{
			return false;
		}

		const adjustedValue = Number(values.adjustedValue);

		if(!isNaN(adjustedValue))
		{
			values.adjustedValue = adjustedValue;
			return false;
		}

		// failed to cast
		const cause = CAUSE.TYPE;
		throw new AdjusterError(cause, values.originalValue);
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
	 * @param {?number} [value=null] value on empty
	 * @return {NumberAdjuster}
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
	 * @param {...number} values values to be accepted
	 * @return {NumberAdjuster}
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
	 * adjust
	 * @param {_TypeValues} values
	 * @return {boolean} finished adjustment or not
	 * @private
	 */
	__adjustMinValue(values)
	{
		if(this._minValue === null)
		{
			return false;
		}
		if(values.adjustedValue >= this._minValue)
		{
			return false;
		}
		if(this._adjustMinValue)
		{
			values.adjustedValue = this._minValue;
			return false;
		}

		const cause = CAUSE.MIN_VALUE;
		throw new AdjusterError(cause, values.originalValue);
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
	 * adjust
	 * @param {_TypeValues} values
	 * @return {boolean} finished adjustment or not
	 * @private
	 */
	__adjustMaxValue(values)
	{
		if(this._maxValue === null)
		{
			return false;
		}
		if(values.adjustedValue <= this._maxValue)
		{
			return false;
		}
		if(this._adjustMaxValue)
		{
			values.adjustedValue = this._maxValue;
			return false;
		}

		const cause = CAUSE.MAX_VALUE;
		throw new AdjusterError(cause, values.originalValue);
	}

	/**
	 * do adjust
	 * @param {*} value value to be checked
	 * @param {?_OnError} onError callback function on error
	 * @return {number} adjusted value
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
			if(this.__adjustType(values))
			{
				return values.adjustedValue;
			}
			if(this.__adjustIn(values))
			{
				return values.adjustedValue;
			}
			if(this.__adjustMinValue(values))
			{
				return values.adjustedValue;
			}
			if(this.__adjustMaxValue(values))
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
