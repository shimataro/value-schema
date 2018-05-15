import AdjusterBase from "./AdjusterBase";

import Default from "./decorators/default";
import AllowEmptyString from "./decorators/allowEmptyString";
import Type from "./decorators/array/type";
import MinLength from "./decorators/array/minLength";
import MaxLength from "./decorators/array/maxLength";
import Each from "./decorators/numberArray/each";

/**
 * adjuster for array of number
 */
@MaxLength
@MinLength
@Each
@Type
@AllowEmptyString
@Default
export default class NumberArrayAdjuster extends AdjusterBase
{
	/**
	 * set default value
	 * @method
	 * @name NumberArrayAdjuster#default
	 * @param {number[]} value default value
	 * @return {NumberArrayAdjuster}
	 */

	/**
	 * allow empty string
	 * @method
	 * @name NumberArrayAdjuster#allowEmptyString
	 * @param {?number[]} [value=null] value on empty
	 * @return {NumberArrayAdjuster}
	 */

	/**
	 * allow string and set separator
	 * @method
	 * @name NumberArrayAdjuster#separatedBy
	 * @param {string|String|RegExp} separator separator
	 * @return {NumberArrayAdjuster}
	 */

	/**
	 * convert to array, if not
	 * @method
	 * @name NumberArrayAdjuster#toArray
	 * @return {NumberArrayAdjuster}
	 */

	/**
	 * set min-length of array elements
	 * @method
	 * @name NumberArrayAdjuster#minLength
	 * @param {int} value min-length; error if shorter
	 * @return {NumberArrayAdjuster}
	 */

	/**
	 * set max-length of array elements
	 * @method
	 * @name NumberArrayAdjuster#maxLength
	 * @param {int} length max-length
	 * @param {boolean} [adjust=false] truncate if longer; default is ERROR
	 * @return {NumberArrayAdjuster}
	 */

	/**
	 * ignore each elements error
	 * @method
	 * @name NumberArrayAdjuster#ignoreEachErrors
	 * @return {NumberArrayAdjuster}
	 */

	/**
	 * set a default value for each elements
	 * @method
	 * @name NumberArrayAdjuster#eachDefault
	 * @param {?number} value default value
	 * @return {NumberArrayAdjuster}
	 */

	/**
	 * allow empty string for each elements
	 * @method
	 * @name NumberArrayAdjuster#eachAllowEmptyString
	 * @param {?number} [value=null] value on empty
	 * @return {NumberArrayAdjuster}
	 */

	/**
	 * accept only specified values for each elements
	 * @method
	 * @name NumberArrayAdjuster#eachIn
	 * @param {...number} values values to be accepted
	 * @return {NumberArrayAdjuster}
	 */

	/**
	 * set min-value for each elements
	 * @method
	 * @name NumberArrayAdjuster#eachMinValue
	 * @param {number} value min-value
	 * @param {boolean} [adjust=false] adjust to min-value if value < min-value; default is ERROR
	 * @return {NumberArrayAdjuster}
	 */

	/**
	 * set max-value for each elements
	 * @method
	 * @name NumberArrayAdjuster#eachMaxValue
	 * @param {number} value max-value
	 * @param {boolean} [adjust=false] adjust to max-value if value > max-value; default is ERROR
	 * @return {NumberArrayAdjuster}
	 */

	/**
	 * do adjust
	 * @method
	 * @name NumberArrayAdjuster#adjust
	 * @param {*} value value to be checked
	 * @param {?AdjusterBase.OnError} [onError=null] callback function on error
	 * @return {number[]} adjusted value
	 * @throws {AdjusterError}
	 */
}
