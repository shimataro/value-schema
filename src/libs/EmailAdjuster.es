import {CAUSE} from "./constants";
import {REGEXP as REGEXP_IPV4} from "./IPv4Adjuster";

import AdjusterInterface from "./AdjusterInterface";
import AdjusterError from "./AdjusterError";
import StringAdjuster from "./StringAdjuster";

const MAX_LENGTH_LOCAL = 64;
const MAX_LENGTH_DOMAIN = 255;
const MAX_LENGTH = MAX_LENGTH_LOCAL + 1 + MAX_LENGTH_DOMAIN; // local-part + "@" + domain-part

// https://tools.ietf.org/html/rfc5321
// https://tools.ietf.org/html/rfc5322
const REGEXP_CHARSET_DOT = "[\\w!#$%&'*+\\-\\/=?^`{|}~]";
const REGEXP_CHARSET_QUOTED = "[\\w!#$%&'*+\\-\\/=?^`{|}~. ()<>\\[\\]:;@,]";
const REGEXP_CHARSET_TLD = "[a-zA-Z]";
const REGEXP_CHARSET_SLD = "[a-zA-Z\\d\\-]";
const REGEXP_CHARSET_IPV6 = "[\\da-fA-F]";

const REGEXP_COMPONENT_DOT = `${REGEXP_CHARSET_DOT}+`;
const REGEXP_COMPONENT_QUOTED = `(${REGEXP_CHARSET_QUOTED}|\\\\[\\\\"])+`;
const REGEXP_COMPONENT_TLD = `${REGEXP_CHARSET_TLD}+`;
const REGEXP_COMPONENT_SLD = `${REGEXP_CHARSET_SLD}+`;
const REGEXP_COMPONENT_IPV6 = `${REGEXP_CHARSET_IPV6}{1,4}`;

const REGEXP_LOCAL_DOT = `${REGEXP_COMPONENT_DOT}(\\.${REGEXP_COMPONENT_DOT})*`;
const REGEXP_LOCAL_QUOTED = `"${REGEXP_COMPONENT_QUOTED}"`;
const REGEXP_LOCAL = `(${REGEXP_LOCAL_DOT}|${REGEXP_LOCAL_QUOTED})`;

const REGEXP_DOMAIN_GENERAL = `(${REGEXP_COMPONENT_SLD}\\.)+${REGEXP_COMPONENT_TLD}`;
const REGEXP_DOMAIN_IPV6_0 = `:(((:${REGEXP_COMPONENT_IPV6}){1,7})|((:${REGEXP_COMPONENT_IPV6}){0,5}:${REGEXP_IPV4})|:)`;
const REGEXP_DOMAIN_IPV6_1 = `(${REGEXP_COMPONENT_IPV6}:){1}(((:${REGEXP_COMPONENT_IPV6}){1,6})|((:${REGEXP_COMPONENT_IPV6}){0,4}:${REGEXP_IPV4})|:)`;
const REGEXP_DOMAIN_IPV6_2 = `(${REGEXP_COMPONENT_IPV6}:){2}(((:${REGEXP_COMPONENT_IPV6}){1,5})|((:${REGEXP_COMPONENT_IPV6}){0,3}:${REGEXP_IPV4})|:)`;
const REGEXP_DOMAIN_IPV6_3 = `(${REGEXP_COMPONENT_IPV6}:){3}(((:${REGEXP_COMPONENT_IPV6}){1,4})|((:${REGEXP_COMPONENT_IPV6}){0,2}:${REGEXP_IPV4})|:)`;
const REGEXP_DOMAIN_IPV6_4 = `(${REGEXP_COMPONENT_IPV6}:){4}(((:${REGEXP_COMPONENT_IPV6}){1,3})|((:${REGEXP_COMPONENT_IPV6}){0,1}:${REGEXP_IPV4})|:)`;
const REGEXP_DOMAIN_IPV6_5 = `(${REGEXP_COMPONENT_IPV6}:){5}(((:${REGEXP_COMPONENT_IPV6}){1,2})|:${REGEXP_IPV4}|:)`;
const REGEXP_DOMAIN_IPV6_6 = `(${REGEXP_COMPONENT_IPV6}:){6}(:${REGEXP_COMPONENT_IPV6}|${REGEXP_IPV4}|:)`;
const REGEXP_DOMAIN_IPV6_7 = `(${REGEXP_COMPONENT_IPV6}:){7}(${REGEXP_COMPONENT_IPV6}|:)`;
const REGEXP_DOMAIN_IPV6 = `(${REGEXP_DOMAIN_IPV6_0}|${REGEXP_DOMAIN_IPV6_1}|${REGEXP_DOMAIN_IPV6_2}|${REGEXP_DOMAIN_IPV6_3}|${REGEXP_DOMAIN_IPV6_4}|${REGEXP_DOMAIN_IPV6_5}|${REGEXP_DOMAIN_IPV6_6}|${REGEXP_DOMAIN_IPV6_7})`;
const REGEXP_DOMAIN_IP = `\\[(${REGEXP_IPV4}|IPv6:${REGEXP_DOMAIN_IPV6})\\]`;
const REGEXP_DOMAIN = `(${REGEXP_DOMAIN_GENERAL}|${REGEXP_DOMAIN_IP})`;

const REGEXP = `${REGEXP_LOCAL}@${REGEXP_DOMAIN}`;

const PATTERN = new RegExp(`^${REGEXP}$`);

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
			.pattern(PATTERN);
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
