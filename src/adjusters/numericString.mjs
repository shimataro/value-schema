import AdjusterBase from "../libs/AdjusterBase";

import Default from "../decorators/default";
import AcceptNull from "../decorators/acceptNull";
import AcceptEmptyString from "../decorators/acceptEmptyString";
import Type from "../decorators/string/type";
import MinLength from "../decorators/string/minLength";
import MaxLength from "../decorators/string/maxLength";
import JoinArray from "../decorators/numericString/joinArray";
import SeparatedBy from "../decorators/numericString/separatedBy";
import Pattern from "../decorators/numericString/pattern";
import Checksum from "../decorators/numericString/checksum";

/**
 * factory
 * @returns {NumericStringAdjuster} adjuster instance
 */
export default () =>
{
	return new NumericStringAdjuster();
};

/**
 * adjuster for numeric string
 */
@Checksum
@MaxLength
@MinLength
@Pattern
@SeparatedBy
@Type
@JoinArray
@AcceptEmptyString
@AcceptNull
@Default
class NumericStringAdjuster extends AdjusterBase
{
	/**
	 * set default value
	 * @method
	 * @name NumericStringAdjuster#default
	 * @param {string} value default value
	 * @returns {NumericStringAdjuster}
	 */

	/**
	 * accept null
	 * @method
	 * @name NumericStringAdjuster#acceptNull
	 * @param {?string} [value=null] value on null
	 * @returns {NumericStringAdjuster}
	 */

	/**
	 * accept empty string
	 * @method
	 * @name NumericStringAdjuster#acceptEmptyString
	 * @param {?string} [value=null] value on empty
	 * @returns {NumericStringAdjuster}
	 */

	/**
	 * join array into string
	 * @method
	 * @name NumericStringAdjuster#joinArray
	 * @returns {NumericStringAdjuster}
	 */

	/**
	 * ignore separator
	 * @method
	 * @name NumericStringAdjuster#separatedBy
	 * @param {string|RegExp} separator separator
	 * @returns {NumericStringAdjuster}
	 */

	/**
	 * set min-length
	 * @method
	 * @name NumericStringAdjuster#minLength
	 * @param {number} length min-length; error if shorter
	 * @returns {NumericStringAdjuster}
	 */

	/**
	 * set max-length
	 * @method
	 * @name NumericStringAdjuster#maxLength
	 * @param {number} length max-length; error if longer
	 * @param {boolean} [adjust=false] truncate if longer; default is ERROR
	 * @returns {NumericStringAdjuster}
	 */

	/**
	 * validate by checksum
	 * @method
	 * @name NumericStringAdjuster#checksum
	 * @param {string} algorithm checksum algorithm
	 * @returns {NumericStringAdjuster}
	 */

	/**
	 * do adjust
	 * @method
	 * @name NumericStringAdjuster#adjust
	 * @param {*} value value to be checked
	 * @param {?AdjusterBase.OnError} [onError=null] callback function on error
	 * @returns {string} adjusted value
	 * @throws {AdjusterError}
	 */
}
