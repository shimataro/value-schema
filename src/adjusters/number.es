import AdjusterBase from "../libs/AdjusterBase";

import Default from "../libs/decorators/default";
import AllowEmptyString from "../libs/decorators/allowEmptyString";
import In from "../libs/decorators/in";
import Type from "../libs/decorators/number/type";
import MinValue from "../libs/decorators/number/minValue";
import MaxValue from "../libs/decorators/number/maxValue";

/**
 * factory
 * @return {NumberAdjuster}
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
@In
@Type
@AllowEmptyString
@Default
class NumberAdjuster extends AdjusterBase
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
	 * @name NumberAdjuster#allowEmptyString
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
