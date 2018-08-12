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
 * @returns {NumberAdjuster} adjuster instance
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
	 * @returns {NumberAdjuster}
	 */

	/**
	 * set default value
	 * @method
	 * @name NumberAdjuster#default
	 * @param {number} value default value
	 * @returns {NumberAdjuster}
	 */

	/**
	 * accept null
	 * @method
	 * @name NumberAdjuster#acceptNull
	 * @param {?number} [value=null] value on null
	 * @returns {NumberAdjuster}
	 */

	/**
	 * accept empty string
	 * @method
	 * @name NumberAdjuster#acceptEmptyString
	 * @param {?number} [value=null] value on empty
	 * @returns {NumberAdjuster}
	 */

	/**
	 * accept all special formats; i.e., "1e+10", "0x100"
	 * @method
	 * @name NumberAdjuster#acceptSpecialFormats
	 * @returns {NumberAdjuster}
	 */

	/**
	 * limit value to integer
	 * @method
	 * @name NumberAdjuster#integer
	 * @param {boolean} [adjust=false] adjust to integer value is not an integer; default is ERROR
	 * @returns {NumberAdjuster}
	 */

	/**
	 * accept only specified values
	 * @method
	 * @name NumberAdjuster#only
	 * @param {...number} values values to be accepted
	 * @returns {NumberAdjuster}
	 */

	/**
	 * set min-value
	 * @method
	 * @name NumberAdjuster#minValue
	 * @param {number} value min-value
	 * @param {boolean} [adjust=false] adjust to min-value if value < min-value; default is ERROR
	 * @returns {NumberAdjuster}
	 */

	/**
	 * set max-value
	 * @method
	 * @name NumberAdjuster#maxValue
	 * @param {number} value max-value
	 * @param {boolean} [adjust=false] adjust to max-value if value > max-value; default is ERROR
	 * @returns {NumberAdjuster}
	 */

	/**
	 * do adjust
	 * @method
	 * @name NumberAdjuster#adjust
	 * @param {*} value value to be checked
	 * @param {?AdjusterBase.OnError} [onError=null] callback function on error
	 * @returns {number} adjusted value
	 * @throws {AdjusterError}
	 */
}
