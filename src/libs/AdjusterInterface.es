import AdjusterError from "./AdjusterError";

/**
 * Adjuster Interface
 */
export default class AdjusterInterface
{
	/**
	 * create decorator
	 * @param {function} adjust
	 * @param {{name: string, init: function, function: function}} [options={}] options
	 */
	static createDecorator(adjust, options = {})
	{
		return (TargetClass) =>
		{
			// register init function
			if(options.init !== undefined)
			{
				if(TargetClass.prototype._initList === undefined)
				{
					TargetClass.prototype._initList = [];
				}
				TargetClass.prototype._initList.push(options.init);
			}

			// register chain function
			if(options.function !== undefined)
			{
				TargetClass.prototype[options.name] = function(...args)
				{
					options.function(this._params, ...args);
					return this;
				};
			}

			// register adjust function
			if(TargetClass.prototype._adjustList === undefined)
			{
				TargetClass.prototype._adjustList = [];
			}
			TargetClass.prototype._adjustList.push(adjust);
			return TargetClass;
		};
	}

	constructor()
	{
		this._params = {};
		if(this._initList !== undefined)
		{
			for(const init of this._initList)
			{
				init(this._params);
			}
		}
	}

	/**
	 * do adjust
	 * @param {*} value value to be checked
	 * @param {?_OnError} [onError=null] callback function on error
	 * @return {*}
	 */
	adjust(value, onError = null)
	{
		const values = {
			originalValue: value,
			adjustedValue: value,
		};

		try
		{
			for(const adjust of this._adjustList)
			{
				if(adjust(this._params, values))
				{
					return values.adjustedValue;
				}
			}
			return values.adjustedValue;
		}
		catch(err)
		{
			return AdjusterInterface._handleError(onError, err.cause, err.value);
		}
	}

	/**
	 * error handler
	 * @param {?_OnError} onError callback function on error
	 * @param {string} cause
	 * @param {*} value
	 * @return {*}
	 * @protected
	 */
	static _handleError(onError, cause, value)
	{
		const err = new AdjusterError(cause, value);
		if(onError === null)
		{
			throw err;
		}

		return onError(err);
	}
}

/**
 * type of callback function on error
 * @callback _OnError
 * @param {AdjusterError} err
 * @return {*}
 */
/**
 * type
 * @typedef {Object} _TypeValues
 * @property {*} originalValue
 * @property {*} adjustedValue
 */
