/**
 * get class decorators
 * @function
 * @param {AdjusterBase} TargetClass a target class
 * @returns {Decorator-Info[]}
 */
const getDecorators = (() =>
{
	/** @type {Map<AdjusterBase, Decorator-Info[]>} */
	const decoratorsMap = new Map();

	return (/** @type {AdjusterBase} */ TargetClass) =>
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
	 * @param {Decorator-Adjust} adjust adjuster function
	 */
	constructor(adjust)
	{
		this._adjust = adjust;
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
	 * @returns {function(AdjusterBase): AdjusterBase} decorator function
	 */
	build()
	{
		return (/** @type {AdjusterBase} */ TargetClass) =>
		{
			const key = Symbol("");
			const init = this._init;
			const features = this._features;
			const adjust = this._adjust;

			const decorators = getDecorators(TargetClass);
			decorators.push({
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
 * Adjuster Base Class
 */
export default class AdjusterBase
{
	/**
	 * returns DecoratorBuilder
	 * @param {function} adjust adjuster function
	 * @returns {DecoratorBuilder} builder object (to be chained)
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
	 * do adjust
	 * @param {*} value value to be checked
	 * @param {ErrorHandler} [onError] callback function on error
	 * @returns {*} adjusted value
	 */
	adjust(value, onError = AdjusterBase.onErrorDefault)
	{
		return this._adjust(value, onError, []);
	}

	/**
	 * do adjust (core)
	 * @param {*} value value to be checked
	 * @param {ErrorHandler} onError callback function on error
	 * @param {Key[]} keyStack path to key that caused error
	 * @returns {*} adjusted value
	 * @protected
	 */
	_adjust(value, onError, keyStack)
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
				if(decorator.adjust(params, values, keyStack))
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
	 * @param {AdjusterError} err error object
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
 * @property {Decorator-Adjust} [adjust]
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
 * @typedef {function} Decorator-Adjust
 * @param {Params} params
 * @param {Decorator-Values} value
 * @param {ErrorHandler} [onError]
 * @returns {boolean} end adjustment or not
 */
