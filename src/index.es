import {CAUSE} from "./libs/constants";
import NumberAdjuster from "./libs/NumberAdjuster";
import StringAdjuster from "./libs/StringAdjuster";
import EmailAdjuster from "./libs/EmailAdjuster";

export default {
	/** @type {AdjusterErrorCause} */
	CAUSE: CAUSE,

	adjustData: adjustData,

	/** @return {NumberAdjuster} */
	number: () =>
	{
		return new NumberAdjuster();
	},
	/** @return {StringAdjuster} */
	string: () =>
	{
		return new StringAdjuster();
	},
	/** @return {EmailAdjuster} */
	email: () => {
		return new EmailAdjuster();
	},
};

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
