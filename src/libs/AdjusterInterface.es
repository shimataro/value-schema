import AdjusterError from "./AdjusterError";

/**
 * Adjuster Interface
 */
export default class AdjusterInterface
{
	/**
	 * do adjust
	 * @param {*} value value to be checked
	 * @param {?_OnError} [onError=null] callback function on error
	 * @return {*}
	 */
	adjust(value, onError = null) // eslint-disable-line
	{
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
