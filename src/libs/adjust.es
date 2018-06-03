export default adjust;

/**
 * adjust multiple variables (as object)
 * @param {Object<string, *>} data
 * @param {Object<string, AdjusterBase>} constraints
 * @param {?adjust~OnError} onError
 * @param {?adjust~OnErrorAll} onErrorAll
 */
function adjust(data, constraints, onError = null, onErrorAll = null)
{
	const result = {};
	const errs = {};
	for(const key of Object.keys(constraints))
	{
		const adjustedValue = constraints[key].adjust(data[key], (err) =>
		{
			if(onError === null && onErrorAll === null)
			{
				throw err;
			}

			errs[key] = err;
			if(onError !== null)
			{
				return onError(key, err);
			}
		});

		if(adjustedValue !== undefined)
		{
			result[key] = adjustedValue;
		}
	}

	if(Object.keys(errs).length > 0 && onErrorAll !== null)
	{
		onErrorAll(errs);
	}
	return result;
}

/**
 * @callback adjust~OnError
 * @param {string} key
 * @param {AdjusterError} err
 */
/**
 * @callback adjust~OnErrorAll
 * @param {Object<string, AdjusterError>} errs
 */
