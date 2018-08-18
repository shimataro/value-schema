/**
 * get class decorators
 * @function
 * @param {Function} TargetClass a target class
 * @returns {adjuster.Types._decorator.Info[]}
 */
const getDecorators = (() =>
{
	/** @type {Map<adjuster.Types._decorator.Class, adjuster.Types._decorator.Info[]>} */
	const decoratorsMap = new Map();

	return (/** @type {adjuster.Types._decorator.Class} */ TargetClass) =>
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
	 * @param {adjuster.Types._decorator.Adjust} adjust adjuster function
	 */
	constructor(adjust)
	{
		this._adjust = adjust;
		this._init = null;
		this._features = null;
	}

	/**
	 * add init function
	 * @param {adjuster.Types._decorator.Init} init initializer
	 * @returns {DecoratorBuilder} builder object (to be chained)
	 */
	init(init)
	{
		this._init = init;
		return this;
	}

	/**
	 * add feature functions
	 * @param {Object<string, adjuster.Types._decorator.Feature>} features feature functions
	 * @returns {DecoratorBuilder} builder object (to be chained)
	 */
	features(features)
	{
		this._features = features;
		return this;
	}

	/**
	 * build decorator
	 * @returns {adjuster.Types._decorator.ClassDecorator} decorator function
	 */
	build()
	{
		return (/** @type {adjuster.Types._decorator.Class} */ TargetClass) =>
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
	 * @param {adjuster.Types.ErrorHandler} [onError] callback function on error
	 * @returns {*} adjusted value
	 */
	adjust(value, onError = AdjusterBase.onErrorDefault)
	{
		return this._adjust(value, onError, []);
	}

	/**
	 * do adjust (core)
	 * @param {*} value value to be checked
	 * @param {adjuster.Types.ErrorHandler} [onError] callback function on error
	 * @param {adjuster.Types.Key[]} keyStack path to key that caused error
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
