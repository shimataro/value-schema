import AdjusterBase from "./AdjusterBase";

import Default from "./decorators/default";
import AllowEmpty from "./decorators/allowEmpty";
import Type from "./decorators/string/type";
import Pattern from "./decorators/string/pattern";
import MaxLength from "./decorators/email/maxLength";

import {PATTERN as PATTERN_IPV4} from "./IPv4Adjuster";
import {PATTERN as PATTERN_IPV6} from "./IPv6Adjuster";

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
@Pattern
@MaxLength
@Type
@AllowEmpty
@Default
export default class EmailAdjuster extends AdjusterBase
{
	/**
	 * constructor
	 */
	constructor()
	{
		super();

		this.pattern(REGEXP);
	}

	/**
	 * set default value
	 * @method
	 * @name EmailAdjuster#default
	 * @param {string} value default value
	 * @return {EmailAdjuster}
	 */

	/**
	 * allow empty string
	 * @method
	 * @name EmailAdjuster#allowEmpty
	 * @param {?string} [value=null] value on empty
	 * @return {EmailAdjuster}
	 */

	/**
	 * specify acceptable pattern by regular expression
	 * @param {string|String|RegExp} pattern acceptable pattern(regular expression); string or RegExp
	 * @return {EmailAdjuster}
	 */

	/**
	 * do adjust
	 * @method
	 * @name EmailAdjuster#adjust
	 * @param {*} value value to be checked
	 * @param {?AdjusterBase.OnError} [onError=null] callback function on error
	 * @return {string} adjusted value
	 * @throws {AdjusterError}
	 */
}
