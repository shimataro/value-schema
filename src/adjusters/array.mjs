import AdjusterBase from "../libs/AdjusterBase";

import Default from "../libs/decorators/default";
import AcceptNull from "../libs/decorators/acceptNull";
import AcceptEmptyString from "../libs/decorators/acceptEmptyString";
import Type from "../libs/decorators/array/type";
import MinLength from "../libs/decorators/array/minLength";
import MaxLength from "../libs/decorators/array/maxLength";
import Each from "../libs/decorators/array/each";

/**
 * factory
 * @returns {ArrayAdjuster} adjuster instance
 */
export default () =>
{
	return new ArrayAdjuster();
};

/**
 * adjuster for array
 */
@MaxLength
@MinLength
@Each
@Type
@AcceptEmptyString
@AcceptNull
@Default
class ArrayAdjuster extends AdjusterBase
{
	/**
	 * set default value; enable to omit
	 * @method
	 * @name ArrayAdjuster#default
	 * @param {Array} value default value
	 * @returns {ArrayAdjuster}
	 */

	/**
	 * accept null
	 * @method
	 * @name ArrayAdjuster#acceptNull
	 * @param {?Array} [value=null] value on null
	 * @returns {ArrayAdjuster}
	 */

	/**
	 * accept empty string
	 * @method
	 * @name ArrayAdjuster#acceptEmptyString
	 * @param {?Array} [value=null] value on empty
	 * @returns {ArrayAdjuster}
	 */

	/**
	 * accept string and set separator
	 * @method
	 * @name ArrayAdjuster#separatedBy
	 * @param {string|RegExp} separator separator
	 * @returns {ArrayAdjuster}
	 */

	/**
	 * convert to array, if not
	 * @method
	 * @name ArrayAdjuster#toArray
	 * @returns {ArrayAdjuster}
	 */

	/**
	 * set min-length of array elements
	 * @method
	 * @name ArrayAdjuster#minLength
	 * @param {number} length min-length; error if shorter
	 * @returns {ArrayAdjuster}
	 */

	/**
	 * set max-length of array elements
	 * @method
	 * @name ArrayAdjuster#maxLength
	 * @param {number} length max-length
	 * @param {boolean} [adjust=false] truncate if longer; default is ERROR
	 * @returns {ArrayAdjuster}
	 */

	/**
	 * apply constraints for each elements
	 * @method
	 * @name ArrayAdjuster#each
	 * @param {AdjusterBase} adjusterInstance adjuster to apply
	 * @param {boolean} [ignoreEachErrors=false] ignore errors of each elements
	 * @returns {ArrayAdjuster}
	 */

	/**
	 * do adjust
	 * @method
	 * @name ArrayAdjuster#adjust
	 * @param {*} value value to be checked
	 * @param {?AdjusterBase.OnError} [onError=null] callback function on error
	 * @returns {Array} adjusted value
	 */
}
