import AdjusterBase from "../libs/AdjusterBase";

import Default from "../libs/decorators/default";
import AcceptNull from "../libs/decorators/acceptNull";
import AcceptEmptyString from "../libs/decorators/acceptEmptyString";
import Only from "../libs/decorators/only";
import Type from "../libs/decorators/number/type";
import MinValue from "../libs/decorators/number/minValue";
import MaxValue from "../libs/decorators/number/maxValue";

/**
 * factory
 * @return {NumberAdjuster} adjuster object
 */
export default () =>
{
	return new NumberAdjuster();
};

/**
 * adjuster for number
 */
@MaxValue
@MinValue
@Only
@Type
@AcceptEmptyString
@AcceptNull
@Default
class NumberAdjuster extends AdjusterBase
{
	/**
	 * enable strict type check
	 * @method
	 * @name NumberAdjuster#strict
	 * @return {NumberAdjuster}
	 */

	/**
	 * set default value
	 * @method
	 * @name NumberAdjuster#default
	 * @param {number} value default value
	 * @return {NumberAdjuster}
	 */

	/**
	 * accept null
	 * @method
	 * @name NumberAdjuster#acceptNull
	 * @param {?number} [value=null] value on null
	 * @return {NumberAdjuster}
	 */

	/**
	 * accept empty string
	 * @method
	 * @name NumberAdjuster#acceptEmptyString
	 * @param {?number} [value=null] value on empty
	 * @return {NumberAdjuster}
	 */

	/**
	 * accept all special formats; i.e., "1e+10", "0x100"
	 * @method
	 * @name NumberAdjuster#acceptSpecialFormats
	 * @return {NumberAdjuster}
	 */

	/**
	 * limit value to integer
	 * @method
	 * @name NumberAdjuster#integer
	 * @param {boolean} [adjust=false] adjust to integer value is not an integer; default is ERROR
	 * @return {NumberAdjuster}
	 */

	/**
	 * accept only specified values
	 * @method
	 * @name NumberAdjuster#only
	 * @param {...number} values values to be accepted
	 * @return {NumberAdjuster}
	 */

	/**
	 * set min-value
	 * @method
	 * @name NumberAdjuster#minValue
	 * @param {number} value min-value
	 * @param {boolean} [adjust=false] adjust to min-value if value < min-value; default is ERROR
	 * @return {NumberAdjuster}
	 */

	/**
	 * set max-value
	 * @method
	 * @name NumberAdjuster#maxValue
	 * @param {number} value max-value
	 * @param {boolean} [adjust=false] adjust to max-value if value > max-value; default is ERROR
	 * @return {NumberAdjuster}
	 */

	/**
	 * do adjust
	 * @method
	 * @name NumberAdjuster#adjust
	 * @param {*} value value to be checked
	 * @param {?AdjusterBase.OnError} [onError=null] callback function on error
	 * @return {number} adjusted value
	 * @throws {AdjusterError}
	 */
}
