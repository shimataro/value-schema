import AdjusterBase from "../libs/AdjusterBase";

import Default from "../libs/decorators/default";
import AcceptNull from "../libs/decorators/acceptNull";
import AcceptEmptyString from "../libs/decorators/acceptEmptyString";
import Only from "../libs/decorators/only";
import Type from "../libs/decorators/string/type";
import Trim from "../libs/decorators/string/trim";
import MinLength from "../libs/decorators/string/minLength";
import MaxLength from "../libs/decorators/string/maxLength";
import Pattern from "../libs/decorators/string/pattern";

/**
 * factory
 * @return {StringAdjuster} adjuster instance
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
	 * @return {StringAdjuster}
	 */

	/**
	 * set default value
	 * @method
	 * @name StringAdjuster#default
	 * @param {string} value default value
	 * @return {StringAdjuster}
	 */

	/**
	 * accept null
	 * @method
	 * @name StringAdjuster#acceptNull
	 * @param {?string} [value=null] value on null
	 * @return {StringAdjuster}
	 */

	/**
	 * remove whitespace from both ends
	 * @method
	 * @name StringAdjuster#trim
	 * @return {StringAdjuster}
	 */

	/**
	 * accept empty string
	 * @method
	 * @name StringAdjuster#acceptEmptyString
	 * @param {?string} [value=null] value on empty
	 * @return {StringAdjuster}
	 */

	/**
	 * accept only specified values
	 * @method
	 * @name StringAdjuster#only
	 * @param {...string} values values to be accepted
	 * @return {StringAdjuster}
	 */

	/**
	 * set min-length
	 * @method
	 * @name StringAdjuster#minLength
	 * @param {number} length min-length; error if shorter
	 * @return {StringAdjuster}
	 */

	/**
	 * set max-length
	 * @method
	 * @name StringAdjuster#maxLength
	 * @param {number} length max-length; error if longer
	 * @param {boolean} [adjust=false] truncate if longer; default is ERROR
	 * @return {StringAdjuster}
	 */

	/**
	 * specify acceptable pattern by regular expression
	 * @method
	 * @name StringAdjuster#pattern
	 * @param {string|String|RegExp} pattern acceptable pattern(regular expression); string or RegExp
	 * @return {StringAdjuster}
	 */

	/**
	 * do adjust
	 * @method
	 * @name StringAdjuster#adjust
	 * @param {*} value value to be checked
	 * @param {?AdjusterBase.OnError} [onError=null] callback function on error
	 * @return {string} adjusted value
	 * @throws {AdjusterError}
	 */
}
