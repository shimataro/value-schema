import AdjusterBase from "../libs/AdjusterBase";

import Default from "../libs/decorators/default";
import AllowEmptyString from "../libs/decorators/allowEmptyString";
import Type from "../libs/decorators/string/type";
import Pattern from "../libs/decorators/string/pattern";

const PATTERN_COMPONENT = `(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})`;
const PATTERN = `${PATTERN_COMPONENT}(\\.${PATTERN_COMPONENT}){3}`;

const REGEXP = new RegExp(`^${PATTERN}$`);

export {PATTERN};

/**
 * factory
 * @return {IPv4Adjuster}
 */
export default () =>
{
	return new IPv4Adjuster();
};

/**
 * adjuster for IPv4
 */
@Pattern
@Type
@AllowEmptyString
@Default
class IPv4Adjuster extends AdjusterBase
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
	 * @name IPv4Adjuster#default
	 * @param {string} value default value
	 * @return {IPv4Adjuster}
	 */

	/**
	 * allow empty string
	 * @method
	 * @name IPv4Adjuster#allowEmptyString
	 * @param {?string} [value=null] value on empty
	 * @return {IPv4Adjuster}
	 */

	/**
	 * specify acceptable pattern by regular expression
	 * @param {string|String|RegExp} pattern acceptable pattern(regular expression); string or RegExp
	 * @return {IPv4Adjuster}
	 */

	/**
	 * do adjust
	 * @method
	 * @name IPv4Adjuster#adjust
	 * @param {*} value value to be checked
	 * @param {?AdjusterBase.OnError} [onError=null] callback function on error
	 * @return {string} adjusted value
	 * @throws {AdjusterError}
	 */
}
