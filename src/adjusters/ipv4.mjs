import AdjusterBase from "../libs/AdjusterBase";

import Default from "../libs/decorators/default";
import AcceptNull from "../libs/decorators/acceptNull";
import AcceptEmptyString from "../libs/decorators/acceptEmptyString";
import Type from "../libs/decorators/string/type";
import Trim from "../libs/decorators/string/trim";
import Pattern from "../libs/decorators/string/pattern";

const PATTERN_COMPONENT = `(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]{1,2})`;
const PATTERN = `${PATTERN_COMPONENT}(\\.${PATTERN_COMPONENT}){3}`;

const REGEXP = new RegExp(`^${PATTERN}$`);

export {PATTERN};

/**
 * factory
 * @returns {IPv4Adjuster} adjuster instance
 */
export default () =>
{
	return new IPv4Adjuster();
};

/**
 * adjuster for IPv4
 */
@Pattern
@AcceptEmptyString
@Trim
@Type
@AcceptNull
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
	 * @returns {IPv4Adjuster}
	 */

	/**
	 * accept null
	 * @method
	 * @name IPv4Adjuster#acceptNull
	 * @param {?string} [value=null] value on null
	 * @returns {IPv4Adjuster}
	 */

	/**
	 * remove whitespace from both ends
	 * @method
	 * @name IPv4Adjuster#trim
	 * @returns {IPv4Adjuster}
	 */

	/**
	 * accept empty string
	 * @method
	 * @name IPv4Adjuster#acceptEmptyString
	 * @param {?string} [value=null] value on empty
	 * @returns {IPv4Adjuster}
	 */

	/**
	 * do adjust
	 * @method
	 * @name IPv4Adjuster#adjust
	 * @param {*} value value to be checked
	 * @param {?AdjusterBase.OnError} [onError=null] callback function on error
	 * @returns {string} adjusted value
	 * @throws {AdjusterError}
	 */
}
