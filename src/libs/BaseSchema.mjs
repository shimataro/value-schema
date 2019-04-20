/**
 * get class decorators
 * @function
 * @param {BaseSchema} TargetClass a target class
 * @returns {Decorator-Info[]}
 */
const getDecorators = (() =>
{
	/** @type {Map<BaseSchema, Decorator-Info[]>} */
	const decoratorsMap = new Map();

	return (/** @type {BaseSchema} */ TargetClass) =>
	{
		if(!decoratorsMap.has(TargetClass))
		{
			decoratorsMap.set(TargetClass, []);
		}
		return decoratorsMap.get(TargetClass);
	};
})();

/**
 * Decorator Builder
 */
class DecoratorBuilder
{
	/**
	 * constructor
	 * @param {Decorator-Fit} fit value-schema function
	 */
	constructor(fit)
	{
		this._fit = fit;
		this._init = null;
		this._features = null;
	}

	/**
	 * add init function
	 * @param {Decorator-Init} init initializer
	 * @returns {DecoratorBuilder} builder object (to be chained)
	 */
	init(init)
	{
		this._init = init;
		return this;
	}

	/**
	 * add feature functions
	 * @param {Object<string, Decorator-Feature>} features feature functions
	 * @returns {DecoratorBuilder} builder object (to be chained)
	 */
	features(features)
	{
		this._features = features;
		return this;
	}

	/**
	 * build decorator
	 * @returns {function(BaseSchema): BaseSchema} decorator function
	 */
	build()
	{
		return (/** @type {BaseSchema} */ TargetClass) =>
		{
			const key = Symbol("");
			const init = this._init;
			const features = this._features;
			const fit = this._fit;

			const decorators = getDecorators(TargetClass);
			decorators.push({
				key: key,
				fit: fit,
				init: init,
			});

			// register feature functions
			if(features !== null)
			{
				for(const name of Object.keys(features))
				{
					TargetClass.prototype[name] = function(...args)
					{
						const params = this._params.get(key);
						features[name](params, ...args);
						return this;
					};
				}
			}

			return TargetClass;
		};
	}
}

/**
 * Base Schema Class
 */
export default class BaseSchema
{
	/**
	 * returns DecoratorBuilder
	 * @param {function} fit value-schema function
	 * @returns {DecoratorBuilder} builder object (to be chained)
	 */
	static decoratorBuilder(fit)
	{
		return new DecoratorBuilder(fit);
	}

	/**
	 * constructor
	 */
	constructor()
	{
		/** @type {Map<Symbol, Object>} */
		this._params = new Map();

		const decorators = getDecorators(this.constructor);
		for(const decorator of decorators)
		{
			this._params.set(decorator.key, {});
			if(decorator.init !== null)
			{
				const params = this._params.get(decorator.key);
				decorator.init(params);
			}
		}
	}

	/**
	 * fit value to schema
	 * @param {*} value value to be checked
	 * @param {ErrorHandler} [onError] callback function on error
	 * @returns {*} checked value
	 */
	fit(value, onError = BaseSchema.onErrorDefault)
	{
		return this._fit(value, onError, []);
	}

	/**
	 * fit value to schema (core)
	 * @param {*} value value to be checked
	 * @param {ErrorHandler} onError callback function on error
	 * @param {Key[]} keyStack path to key that caused error
	 * @returns {*} checked value
	 * @protected
	 */
	_fit(value, onError, keyStack)
	{
		const values = {
			original: value,
			adjusted: value,
		};

		try
		{
			const decorators = getDecorators(this.constructor);
			for(const decorator of decorators)
			{
				const params = this._params.get(decorator.key);
				if(decorator.fit(params, values, keyStack))
				{
					return values.adjusted;
				}
			}

			return values.adjusted;
		}
		catch(err)
		{
			return onError(err);
		}
	}

	/**
	 * default error handler
	 * @param {ValueSchemaError} err error object
	 * @returns {void}
	 */
	static onErrorDefault(err)
	{
		throw err;
	}
}

/**
 * @package
 * @typedef {Object} Params
 */
/**
 * @package
 * @typedef {Object} Decorator-Values
 * @property {Input} original
 * @property {Input} adjusted
 */
/**
 * @package
 * @typedef {Object} Decorator-Info
 * @property {Symbol} key
 * @property {Decorator-Init} init
 * @property {Decorator-Fit} [fit]
 */
/**
 * @package
 * @typedef {function} Decorator-Init
 * @param {Params} params
 */
/**
 * @package
 * @typedef {function} Decorator-Feature
 * @param {Params} params
 * @param {...*} args
 */
/**
 * @typedef {function} Decorator-Fit
 * @param {Params} params
 * @param {Decorator-Values} value
 * @param {ErrorHandler} [onError]
 * @returns {boolean} end processing or not
 */
