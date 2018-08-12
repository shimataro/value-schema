import AdjusterBase from "../libs/AdjusterBase";

import Default from "../libs/decorators/default";
import AcceptNull from "../libs/decorators/acceptNull";
import AcceptEmptyString from "../libs/decorators/acceptEmptyString";
import Type from "../libs/decorators/boolean/type";

/**
 * factory
 * @returns {BooleanAdjuster} adjuster instance
 */
export default () =>
{
	return new BooleanAdjuster();
};

/**
 * adjuster for boolean
 */
@Type
@AcceptEmptyString
@AcceptNull
@Default
class BooleanAdjuster extends AdjusterBase
{
	/**
	 * enable strict type check
	 * @method
	 * @name BooleanAdjuster#strict
	 * @returns {BooleanAdjuster}
	 */

	/**
	 * accept all numbers as boolean
	 * @method
	 * @name BooleanAdjuster#acceptAllNumbers
	 * @returns {BooleanAdjuster}
	 */

	/**
	 * set default value
	 * @method
	 * @name BooleanAdjuster#default
	 * @param {boolean} value default value
	 * @returns {BooleanAdjuster}
	 */

	/**
	 * accept null
	 * @method
	 * @name BooleanAdjuster#acceptNull
	 * @param {?boolean} [value=null] value on null
	 * @returns {BooleanAdjuster}
	 */

	/**
	 * accept empty string
	 * @method
	 * @name BooleanAdjuster#acceptEmptyString
	 * @param {?boolean} [value=null] value on empty
	 * @returns {BooleanAdjuster}
	 */

	/**
	 * do adjust
	 * @method
	 * @name BooleanAdjuster#adjust
	 * @param {*} value value to be checked
	 * @param {?AdjusterBase.OnError} [onError=null] callback function on error
	 * @returns {boolean} adjusted value
	 * @throws {AdjusterError}
	 */
}
