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
export default class NumberAdjuster2 extends AdjusterBase
{
	/**
	 * set default value
	 * @method
	 * @name NumberAdjuster2#default
	 * @param {number} value default value
	 * @return {NumberAdjuster2}
	 */

	/**
	 * allow empty string
	 * @method
	 * @name NumberAdjuster2#allowEmpty
	 * @param {?number} [value=null] value on empty
	 * @return {NumberAdjuster2}
	 */

	/**
	 * accept only specified values
	 * @method
	 * @name NumberAdjuster2#in
	 * @param {...number} values values to be accepted
	 * @return {NumberAdjuster2}
	 */

	/**
	 * set min-value
	 * @method
	 * @name NumberAdjuster2#minValue
	 * @param {number} value min-value
	 * @param {boolean} [adjust=false] adjust to min-value if value < min-value; default is ERROR
	 * @return {NumberAdjuster2}
	 */

	/**
	 * set max-value
	 * @method
	 * @name NumberAdjuster2#maxValue
	 * @param {number} value max-value
	 * @param {boolean} [adjust=false] adjust to max-value if value > max-value; default is ERROR
	 * @return {NumberAdjuster2}
	 */

	/**
	 * do adjust
	 * @method
	 * @name NumberAdjuster2#adjust
	 * @param {*} value value to be checked
	 * @param {?AdjusterBase.OnError} [onError=null] callback function on error
	 * @return {number} adjusted value
	 * @throws {AdjusterError}
	 */
}
