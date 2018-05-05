import {CAUSE} from "./constants";
import {REGEXP as REGEXP_IPV4} from "./IPv4Adjuster";

import AdjusterInterface from "./AdjusterInterface";
import StringAdjuster from "./StringAdjuster";

const REGEXP_CHARSET = "[\\da-fA-F]";
const REGEXP_COMPONENT = `${REGEXP_CHARSET}{1,4}`;

const REGEXP_0 = `:(((:${REGEXP_COMPONENT}){1,7})|((:${REGEXP_COMPONENT}){0,5}:${REGEXP_IPV4})|:)`;
const REGEXP_1 = `(${REGEXP_COMPONENT}:){1}(((:${REGEXP_COMPONENT}){1,6})|((:${REGEXP_COMPONENT}){0,4}:${REGEXP_IPV4})|:)`;
const REGEXP_2 = `(${REGEXP_COMPONENT}:){2}(((:${REGEXP_COMPONENT}){1,5})|((:${REGEXP_COMPONENT}){0,3}:${REGEXP_IPV4})|:)`;
const REGEXP_3 = `(${REGEXP_COMPONENT}:){3}(((:${REGEXP_COMPONENT}){1,4})|((:${REGEXP_COMPONENT}){0,2}:${REGEXP_IPV4})|:)`;
const REGEXP_4 = `(${REGEXP_COMPONENT}:){4}(((:${REGEXP_COMPONENT}){1,3})|((:${REGEXP_COMPONENT}){0,1}:${REGEXP_IPV4})|:)`;
const REGEXP_5 = `(${REGEXP_COMPONENT}:){5}(((:${REGEXP_COMPONENT}){1,2})|:${REGEXP_IPV4}|:)`;
const REGEXP_6 = `(${REGEXP_COMPONENT}:){6}(:${REGEXP_COMPONENT}|${REGEXP_IPV4}|:)`;
const REGEXP_7 = `(${REGEXP_COMPONENT}:){7}(${REGEXP_COMPONENT}|:)`;

const REGEXP = `(${REGEXP_0}|${REGEXP_1}|${REGEXP_2}|${REGEXP_3}|${REGEXP_4}|${REGEXP_5}|${REGEXP_6}|${REGEXP_7})`;

const PATTERN = new RegExp(`^${REGEXP}$`);

export {REGEXP};

/**
 * adjuster for IPv6
 */
export default class IPv6Adjuster extends AdjusterInterface
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
	 * @return {IPv6Adjuster}
	 */
	default(value)
	{
		this._objAdjuster.default(value);
		return this;
	}

	/**
	 * allow empty string (NOT undefined)
	 * @param {?string} [value=null] value on empty
	 * @return {IPv6Adjuster}
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
				err.cause = CAUSE.IPV6;
			}
			return AdjusterInterface._handleError(onError, err.cause, value);
		}
	}
}
