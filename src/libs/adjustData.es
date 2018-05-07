export default adjustData;

/**
 * adjust multiple variables (as object)
 * @param {Object<string, *>} data
 * @param {Object<string, AdjusterInterface>} adjusters
 * @param {?_OnDataError} onError
 * @param {?_OnDataErrorAll} onErrorAll
 */
function adjustData(data, adjusters, onError = null, onErrorAll = null)
{
	const result = {};
	const errs = {};
	for(const key of Object.keys(adjusters))
	{
		const adjustedValue = adjusters[key].adjust(data[key], (err) =>
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
 * @callback _OnDataError
 * @param {string} key
 * @param {AdjusterError} err
 */
/**
 * @callback _OnDataErrorAll
 * @param {Object<string, AdjusterError>} errs
 */
