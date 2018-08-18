import AdjusterBase from "../libs/AdjusterBase";

import Default from "../decorators/default";
import AcceptNull from "../decorators/acceptNull";
import AcceptEmptyString from "../decorators/acceptEmptyString";
import Only from "../decorators/only";
import Type from "../decorators/string/type";
import Trim from "../decorators/string/trim";
import MinLength from "../decorators/string/minLength";
import MaxLength from "../decorators/string/maxLength";
import Pattern from "../decorators/string/pattern";

/**
 * factory
 * @returns {StringAdjuster} adjuster instance
 */
export default () =>
{
	return new StringAdjuster();
};

/**
 * adjuster for string
 */
@Pattern
@MaxLength
@MinLength
@AcceptEmptyString
@Only
@Trim
@Type
@AcceptNull
@Default
class StringAdjuster extends AdjusterBase
{
	/**
	 * enable strict type check
	 * @method
	 * @name StringAdjuster#strict
	 * @returns {StringAdjuster}
	 */

	/**
	 * set default value
	 * @method
	 * @name StringAdjuster#default
	 * @param {string} value default value
	 * @returns {StringAdjuster}
	 */

	/**
	 * accept null
	 * @method
	 * @name StringAdjuster#acceptNull
	 * @param {?string} [value=null] value on null
	 * @returns {StringAdjuster}
	 */

	/**
	 * remove whitespace from both ends
	 * @method
	 * @name StringAdjuster#trim
	 * @returns {StringAdjuster}
	 */

	/**
	 * accept empty string
	 * @method
	 * @name StringAdjuster#acceptEmptyString
	 * @param {?string} [value=null] value on empty
	 * @returns {StringAdjuster}
	 */

	/**
	 * accept only specified values
	 * @method
	 * @name StringAdjuster#only
	 * @param {...string} values values to be accepted
	 * @returns {StringAdjuster}
	 */

	/**
	 * set min-length
	 * @method
	 * @name StringAdjuster#minLength
	 * @param {number} length min-length; error if shorter
	 * @returns {StringAdjuster}
	 */

	/**
	 * set max-length
	 * @method
	 * @name StringAdjuster#maxLength
	 * @param {number} length max-length; error if longer
	 * @param {boolean} [adjust=false] truncate if longer; default is ERROR
	 * @returns {StringAdjuster}
	 */

	/**
	 * specify acceptable pattern by regular expression
	 * @method
	 * @name StringAdjuster#pattern
	 * @param {string|RegExp} pattern acceptable pattern(regular expression); string or RegExp
	 * @returns {StringAdjuster}
	 */

	/**
	 * do adjust
	 * @method
	 * @name StringAdjuster#adjust
	 * @param {*} value value to be checked
	 * @param {?AdjusterBase.OnError} [onError=null] callback function on error
	 * @returns {string} adjusted value
	 * @throws {AdjusterError}
	 */
}
