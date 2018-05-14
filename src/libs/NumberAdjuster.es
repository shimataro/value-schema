import AdjusterBase from "./AdjusterBase";

import Default from "./decorators/default";
import AllowEmpty from "./decorators/allowEmpty";
import Type from "./decorators/number/type";
import In from "./decorators/in";
import MinValue from "./decorators/number/minValue";
import MaxValue from "./decorators/number/maxValue";

/**
 * adjuster for number
 */
@MaxValue
@MinValue
@In
@Type
@AllowEmpty
@Default
export default class NumberAdjuster extends AdjusterBase
{
	/**
	 * set default value
	 * @method
	 * @name NumberAdjuster#default
	 * @param {number} value default value
	 * @return {NumberAdjuster}
	 */

	/**
	 * allow empty string
	 * @method
	 * @name NumberAdjuster#allowEmpty
	 * @param {?number} [value=null] value on empty
	 * @return {NumberAdjuster}
	 */

	/**
	 * accept only specified values
	 * @method
	 * @name NumberAdjuster#in
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
