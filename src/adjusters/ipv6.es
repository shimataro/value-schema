import AdjusterBase from "../libs/AdjusterBase";

import Default from "../libs/decorators/default";
import AllowEmptyString from "../libs/decorators/allowEmptyString";
import Type from "../libs/decorators/string/type";
import Pattern from "../libs/decorators/string/pattern";

import {PATTERN as PATTERN_IPV4} from "./ipv4";

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
 * factory
 * @return {IPv6Adjuster}
 */
export default () =>
{
	return new IPv6Adjuster();
};

/**
 * adjuster for IPv6
 */
@Pattern
@Type
@AllowEmptyString
@Default
class IPv6Adjuster extends AdjusterBase
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
	 * @name IPv6Adjuster#default
	 * @param {string} value default value
	 * @return {IPv6Adjuster}
	 */

	/**
	 * allow empty string
	 * @method
	 * @name IPv6Adjuster#allowEmptyString
	 * @param {?string} [value=null] value on empty
	 * @return {IPv6Adjuster}
	 */

	/**
	 * specify acceptable pattern by regular expression
	 * @param {string|String|RegExp} pattern acceptable pattern(regular expression); string or RegExp
	 * @return {IPv6Adjuster}
	 */

	/**
	 * do adjust
	 * @method
	 * @name IPv6Adjuster#adjust
	 * @param {*} value value to be checked
	 * @param {?AdjusterBase.OnError} [onError=null] callback function on error
	 * @return {string} adjusted value
	 * @throws {AdjusterError}
	 */
}
