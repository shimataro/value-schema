import {CAUSE} from "./constants";
import {PATTERN as PATTERN_IPV4} from "./IPv4Adjuster";

import AdjusterInterface from "./AdjusterInterface";
import StringAdjuster from "./StringAdjuster";

const PATTERN_CHARSET = "[\\da-fA-F]";
const PATTERN_COMPONENT = `${PATTERN_CHARSET}{1,4}`;

const PATTERN_0 = `:(((:${PATTERN_COMPONENT}){1,7})|((:${PATTERN_COMPONENT}){0,5}:${PATTERN_IPV4})|:)`;
const PATTERN_1 = `(${PATTERN_COMPONENT}:){1}(((:${PATTERN_COMPONENT}){1,6})|((:${PATTERN_COMPONENT}){0,4}:${PATTERN_IPV4})|:)`;
const PATTERN_2 = `(${PATTERN_COMPONENT}:){2}(((:${PATTERN_COMPONENT}){1,5})|((:${PATTERN_COMPONENT}){0,3}:${PATTERN_IPV4})|:)`;
const PATTERN_3 = `(${PATTERN_COMPONENT}:){3}(((:${PATTERN_COMPONENT}){1,4})|((:${PATTERN_COMPONENT}){0,2}:${PATTERN_IPV4})|:)`;
const PATTERN_4 = `(${PATTERN_COMPONENT}:){4}(((:${PATTERN_COMPONENT}){1,3})|((:${PATTERN_COMPONENT}){0,1}:${PATTERN_IPV4})|:)`;
const PATTERN_5 = `(${PATTERN_COMPONENT}:){5}(((:${PATTERN_COMPONENT}){1,2})|:${PATTERN_IPV4}|:)`;
const PATTERN_6 = `(${PATTERN_COMPONENT}:){6}(:${PATTERN_COMPONENT}|${PATTERN_IPV4}|:)`;
const PATTERN_7 = `(${PATTERN_COMPONENT}:){7}(${PATTERN_COMPONENT}|:)`;

const PATTERN = `(${PATTERN_0}|${PATTERN_1}|${PATTERN_2}|${PATTERN_3}|${PATTERN_4}|${PATTERN_5}|${PATTERN_6}|${PATTERN_7})`;

const REGEXP = new RegExp(`^${PATTERN}$`);

export {PATTERN};

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
			.pattern(REGEXP);
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
