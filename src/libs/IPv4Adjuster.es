import {CAUSE} from "./constants";

import AdjusterInterface from "./AdjusterInterface";
import StringAdjuster from "./StringAdjuster";

const REGEXP_COMPONENT = `(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})`;
const REGEXP = `${REGEXP_COMPONENT}(\\.${REGEXP_COMPONENT}){3}`;

const PATTERN = new RegExp(`^${REGEXP}$`);

export {REGEXP};

/**
 * adjuster for IPv4
 */
export default class IPv4Adjuster extends AdjusterInterface
{
	/**
	 * constructor
	 */
	constructor()
	{
		super();

		this._objAdjuster = new StringAdjuster()
			.pattern(PATTERN);
	}

	/**
	 * set default value; enable to omit
	 * @param {string} value default value
	 * @return {IPv4Adjuster}
	 */
	default(value)
	{
		this._objAdjuster.default(value);
		return this;
	}

	/**
	 * allow empty string (NOT undefined)
	 * @param {?string} [value=null] value on empty
	 * @return {IPv4Adjuster}
	 */
	allowEmpty(value = null)
	{
		this._objAdjuster.allowEmpty(value);
		return this;
	}

	/**
	 * do adjust
	 * @param {*} value value to be checked
	 * @param {?_OnError} onError callback function on error
	 * @return {string} adjusted value
	 */
	adjust(value, onError = null)
	{
		try
		{
			return this._objAdjuster.adjust(value);
		}
		catch(err)
		{
			if(err.cause === CAUSE.PATTERN)
			{
				err.cause = CAUSE.IPV4;
			}
			return AdjusterInterface._handleError(onError, err.cause, value);
		}
	}
}
