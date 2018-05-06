import {CAUSE} from "./constants";
import {PATTERN as PATTERN_IPV4} from "./IPv4Adjuster";
import {PATTERN as PATTERN_IPV6} from "./IPv6Adjuster";

import AdjusterInterface from "./AdjusterInterface";
import AdjusterError from "./AdjusterError";
import StringAdjuster from "./StringAdjuster";

const MAX_LENGTH_LOCAL = 64;
const MAX_LENGTH_DOMAIN = 255;
const MAX_LENGTH = MAX_LENGTH_LOCAL + 1 + MAX_LENGTH_DOMAIN; // local-part + "@" + domain-part

// https://tools.ietf.org/html/rfc5321
// https://tools.ietf.org/html/rfc5322
const PATTERN_CHARSET_DOT = "[\\w!#$%&'*+\\-\\/=?^`{|}~]";
const PATTERN_CHARSET_QUOTED = "[\\w!#$%&'*+\\-\\/=?^`{|}~. ()<>\\[\\]:;@,]";
const PATTERN_CHARSET_TLD = "[a-zA-Z]";
const PATTERN_CHARSET_SLD = "[a-zA-Z\\d\\-]";

const PATTERN_COMPONENT_DOT = `${PATTERN_CHARSET_DOT}+`;
const PATTERN_COMPONENT_QUOTED = `(${PATTERN_CHARSET_QUOTED}|\\\\[\\\\"])+`;
const PATTERN_COMPONENT_TLD = `${PATTERN_CHARSET_TLD}+`;
const PATTERN_COMPONENT_SLD = `${PATTERN_CHARSET_SLD}+`;

const PATTERN_LOCAL_DOT = `${PATTERN_COMPONENT_DOT}(\\.${PATTERN_COMPONENT_DOT})*`;
const PATTERN_LOCAL_QUOTED = `"${PATTERN_COMPONENT_QUOTED}"`;
const PATTERN_LOCAL = `(${PATTERN_LOCAL_DOT}|${PATTERN_LOCAL_QUOTED})`;

const PATTERN_DOMAIN_GENERAL = `(${PATTERN_COMPONENT_SLD}\\.)+${PATTERN_COMPONENT_TLD}`;
const PATTERN_DOMAIN_IP = `\\[(${PATTERN_IPV4}|IPv6:${PATTERN_IPV6})\\]`;
const PATTERN_DOMAIN = `(${PATTERN_DOMAIN_GENERAL}|${PATTERN_DOMAIN_IP})`;

const PATTERN = `${PATTERN_LOCAL}@${PATTERN_DOMAIN}`;

const REGEXP = new RegExp(`^${PATTERN}$`);

/**
 * adjuster for e-mail
 */
export default class EmailAdjuster extends AdjusterInterface
{
	/**
	 * constructor
	 */
	constructor()
	{
		super();

		this._objAdjuster = new StringAdjuster()
			.maxLength(MAX_LENGTH)
			.pattern(REGEXP);
	}

	/**
	 * set default value; enable to omit
	 * @param {string} value default value
	 * @return {EmailAdjuster}
	 */
	default(value)
	{
		this._objAdjuster.default(value);
		return this;
	}

	/**
	 * allow empty string (NOT undefined)
	 * @param {?string} [value=null] value on empty
	 * @return {EmailAdjuster}
	 */
	allowEmpty(value = null)
	{
		this._objAdjuster.allowEmpty(value);
		return this;
	}

	/**
	 * specify custom pattern by regular expression
	 * @param {RegExp} pattern acceptable pattern
	 * @return {EmailAdjuster}
	 */
	pattern(pattern)
	{
		this._objAdjuster.pattern(pattern);
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
			const adjusted = this._objAdjuster.adjust(value);

			const atPosition = adjusted.lastIndexOf("@");
			if(atPosition > MAX_LENGTH_LOCAL)
			{
				// local-part length error
				throw new AdjusterError(CAUSE.MAX_LENGTH, value);
			}
			if(adjusted.length - atPosition - 1 > MAX_LENGTH_DOMAIN)
			{
				// domain-part length error
				throw new AdjusterError(CAUSE.MAX_LENGTH, value);
			}

			return adjusted;
		}
		catch(err)
		{
			if(err.cause === CAUSE.PATTERN)
			{
				err.cause = CAUSE.EMAIL;
			}
			return AdjusterInterface._handleError(onError, err.cause, value);
		}
	}
}
