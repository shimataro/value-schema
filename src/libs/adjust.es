export default adjust;

/**
 * adjust multiple variables (as object)
 * @param {Object<string, *>} data
 * @param {Object<string, AdjusterBase>} constraints
 * @param {?AdjusterBase.OnError} [onError=null]
 */
function adjust(data, constraints, onError = null)
{
	if(onError === null)
	{
		// just throw if onError is omitted
		onError = (err) =>
		{
			throw err;
		};
	}

	const result = {};
	let hasError = false;
	for(const key of Object.keys(constraints))
	{
		const adjustedValue = constraints[key].adjust(data[key], generateErrorHandler(key));
		if(adjustedValue !== undefined)
		{
			result[key] = adjustedValue;
		}
	}

	if(hasError)
	{
		onError(null);
	}
	return result;

	/**
	 * error handler generator (to avoid "no-loop-fun" error on eslint)
	 * @param {string} key key
	 */
	function generateErrorHandler(key)
	{
		return (err) =>
		{
			hasError = true;

			err.key = key;
			return onError(err);
		};
	}
}
