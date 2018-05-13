import AdjusterError from "./AdjusterError";

/**
 * Adjuster Interface
 */
export default class AdjusterInterface
{
	/**
	 * create decorator
	 * @param {string} name
	 * @param {function} adjust
	 * @param {{init: function, function: function}} [options={}] options
	 */
	static createDecorator(name, adjust, options = {})
	{
		return (TargetClass) =>
		{
			if(options.init !== undefined)
			{
				TargetClass.prototype._initializers.push({
					name: name,
					init: options.init,
				});
			}
			if(options.function !== undefined)
			{
				TargetClass.prototype[name] = function(...args)
				{
					options.function(this._params[name], ...args);
					return this;
				};
			}

			TargetClass.prototype._adjusters.push({
				name: name,
				adjust: adjust,
			});
			return TargetClass;
		};
	}

	constructor()
	{
		this._params = {};
		if(this._initializers !== undefined)
		{
			for(const initializer of this._initializers)
			{
				this._params[initializer.name] = {};
				initializer.init(this._params[initializer.name]);
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
			for(const adjuster of this._adjusters)
			{
				if(adjuster.adjust(this._params[adjuster.name], values))
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
