import AdjusterError from "./AdjusterError";

/**
 * Decorator Builder
 */
class DecoratorBuilder
{
	/**
	 * constructor
	 * @param {AdjusterBase.Adjust} adjust
	 */
	constructor(adjust)
	{
		this._adjust = adjust;
		this._init = null;
		this._features = null;
	}

	/**
	 * add init function
	 * @param {AdjusterBase.Init} init
	 * @return {DecoratorBuilder}
	 */
	init(init)
	{
		this._init = init;
		return this;
	}

	/**
	 * add feature functions
	 * @param {Object<string, AdjusterBase.Feature>} features feature functions
	 * @return {DecoratorBuilder}
	 */
	features(features)
	{
		this._features = features;
		return this;
	}

	/**
	 * build decorator
	 * @return {AdjusterBase.ClassDecorator}
	 */
	build()
	{
		return (TargetClass) =>
		{
			const key = Symbol("");
			const init = this._init;
			const features = this._features;
			const adjust = this._adjust;

			if(TargetClass._decorators === undefined)
			{
				TargetClass._decorators = [];
			}
			TargetClass._decorators.push({
				key: key,
				adjust: adjust,
				init: init,
			});

			// register feature functions
			if(features !== null)
			{
				for(const name of Object.keys(features))
				{
					TargetClass.prototype[name] = function(...args)
					{
						features[name](this._params[key], ...args);
						return this;
					};
				}
			}

			return TargetClass;
		};
	}
}

/**
 * Adjuster Base Class
 */
export default class AdjusterBase
{
	/**
	 * returns DecoratorBuilder
	 * @param {function} adjust
	 * @return {DecoratorBuilder}
	 */
	static decoratorBuilder(adjust)
	{
		return new DecoratorBuilder(adjust);
	}

	/**
	 * constructor
	 */
	constructor()
	{
		this._decorators = this.constructor._decorators;
		this._params = {};

		for(const decorator of this._decorators)
		{
			this._params[decorator.key] = {};
			if(decorator.init !== null)
			{
				decorator.init(this._params[decorator.key]);
			}
		}
	}

	/**
	 * do adjust
	 * @param {*} value value to be checked
	 * @param {?AdjusterBase.OnError} [onError=null] callback function on error
	 * @return {*}
	 */
	adjust(value, onError = null)
	{
		const values = {
			original: value,
			adjusted: value,
		};

		try
		{
			for(const decorator of this._decorators)
			{
				if(decorator.adjust(this._params[decorator.key], values))
				{
					return values.adjusted;
				}
			}

			return values.adjusted;
		}
		catch(err)
		{
			return AdjusterBase._handleError(onError, err.cause, err.value);
		}
	}

	/**
	 * error handler
	 * @param {?AdjusterBase.OnError} onError callback function on error
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
 * @typedef {Object} AdjusterBase.VALUES
 * @property {*} original
 * @property {*} adjusted
 */
/**
 * type of callback function on error
 * @callback AdjusterBase.OnError
 * @param {AdjusterError} err
 * @return {*}
 */

/**
 * init function
 * @callback AdjusterBase.Init
 * @param {Object} params parameters
 */
/**
 * feature function
 * @callback AdjusterBase.Feature
 * @param {Object} params parameters
 * @param {...*} args arguments
 */
/**
 * adjuster
 * @callback AdjusterBase.Adjust
 * @param {Object} params parameters
 * @param {AdjusterBase.VALUES} values original / adjusted values
 * @return {boolean} end adjustment
 * @throws {AdjusterError}
 */
/**
 * class decorator
 * @callback AdjusterBase.ClassDecorator
 * @param {class} TargetClass
 * @return {class}
 */
