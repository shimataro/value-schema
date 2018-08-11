import AdjusterBase from "../libs/AdjusterBase";

import Default from "../libs/decorators/default";
import AcceptNull from "../libs/decorators/acceptNull";
import AcceptEmptyString from "../libs/decorators/acceptEmptyString";
import Type from "../libs/decorators/array/type";
import MinLength from "../libs/decorators/array/minLength";
import MaxLength from "../libs/decorators/array/maxLength";
import Each from "../libs/decorators/stringArray/each";

/**
 * factory
 * @return {StringArrayAdjuster} adjuster object
 */
export default () =>
{
	return new StringArrayAdjuster();
};

/**
 * adjuster for array of string
 */
@MaxLength
@MinLength
@Each
@Type
@AcceptEmptyString
@AcceptNull
@Default
class StringArrayAdjuster extends AdjusterBase
{
	/**
	 * set default value; enable to omit
	 * @method
	 * @name StringArrayAdjuster#default
	 * @param {string[]} value default value
	 * @return {StringArrayAdjuster}
	 */

	/**
	 * accept null
	 * @method
	 * @name StringArrayAdjuster#acceptNull
	 * @param {?string[]} [value=null] value on null
	 * @return {StringArrayAdjuster}
	 */

	/**
	 * accept empty string
	 * @method
	 * @name StringArrayAdjuster#acceptEmptyString
	 * @param {?string[]} [value=null] value on empty
	 * @return {StringArrayAdjuster}
	 */

	/**
	 * accept string and set separator
	 * @method
	 * @name StringArrayAdjuster#separatedBy
	 * @param {string|String|RegExp} separator separator
	 * @return {StringArrayAdjuster}
	 */

	/**
	 * convert to array, if not
	 * @method
	 * @name StringArrayAdjuster#toArray
	 * @return {StringArrayAdjuster}
	 */

	/**
	 * set min-length of array elements
	 * @method
	 * @name StringArrayAdjuster#minLength
	 * @param {number} length min-length; error if shorter
	 * @return {StringArrayAdjuster}
	 */

	/**
	 * set max-length of array elements
	 * @method
	 * @name StringArrayAdjuster#maxLength
	 * @param {number} length max-length
	 * @param {boolean} [adjust=false] truncate if longer; default is ERROR
	 * @return {StringArrayAdjuster}
	 */

	/**
	 * ignore each elements error
	 * @method
	 * @name StringArrayAdjuster#ignoreEachErrors
	 * @return {StringArrayAdjuster}
	 */

	/**
	 * enable strict type check for each elements
	 * @method
	 * @name StringArrayAdjuster#eachStrict
	 * @return {StringArrayAdjuster}
	 */

	/**
	 * set a default value for each elements
	 * @method
	 * @name StringArrayAdjuster#eachDefault
	 * @param {?string} value default value
	 * @return {StringArrayAdjuster}
	 */

	/**
	 * remove whitespace from both ends for each elements
	 * @method
	 * @name StringArrayAdjuster#eachTrim
	 * @return {StringArrayAdjuster}
	 */

	/**
	 * accept null for each elements
	 * @method
	 * @name StringArrayAdjuster#eachAcceptNull
	 * @param {?string} [value=null] value on null
	 * @return {StringArrayAdjuster}
	 */

	/**
	 * accept empty string for each elements
	 * @method
	 * @name StringArrayAdjuster#eachAcceptEmptyString
	 * @param {?string} [value=null] value on empty
	 * @return {StringArrayAdjuster}
	 */

	/**
	 * accept only specified values for each elements
	 * @method
	 * @name StringArrayAdjuster#eachOnly
	 * @param {...string} values values to be accepted
	 * @return {StringArrayAdjuster}
	 */

	/**
	 * set min-length for each elements
	 * @method
	 * @name StringArrayAdjuster#eachMinLength
	 * @param {number} length min-length; error if shorter
	 * @return {StringArrayAdjuster}
	 */

	/**
	 * set max-length for each elements
	 * @method
	 * @name StringArrayAdjuster#eachMaxLength
	 * @param {number} length max-length
	 * @param {boolean} [adjust=false] truncate if longer; default is ERROR
	 * @return {StringArrayAdjuster}
	 */

	/**
	 * specify acceptable pattern by regular expression for each elements
	 * @method
	 * @name StringArrayAdjuster#eachPattern
	 * @param {string|String|RegExp} pattern acceptable pattern(regular expression); string or RegExp
	 * @return {StringArrayAdjuster}
	 */

	/**
	 * do adjust
	 * @method
	 * @name StringArrayAdjuster#adjust
	 * @param {*} value value to be checked
	 * @param {?AdjusterBase.OnError} [onError=null] callback function on error
	 * @return {string[]} adjusted value
	 */
}
