import AdjusterBase from "../libs/AdjusterBase";

import Default from "../libs/decorators/default";
import AcceptNull from "../libs/decorators/acceptNull";
import AcceptEmptyString from "../libs/decorators/acceptEmptyString";
import Type from "../libs/decorators/object/type";
import Constraints from "../libs/decorators/object/constraints";

/**
 * factory
 * @return {ObjectAdjuster} adjuster instance
 */
export default () =>
{
	return new ObjectAdjuster();
};

/**
 * adjuster for object
 */
@Constraints
@Type
@AcceptEmptyString
@AcceptNull
@Default
class ObjectAdjuster extends AdjusterBase
{
	/**
	 * set default value; enable to omit
	 * @method
	 * @name ObjectAdjuster#default
	 * @param {Object} value default value
	 * @return {ObjectAdjuster}
	 */

	/**
	 * accept null
	 * @method
	 * @name ObjectAdjuster#acceptNull
	 * @param {?Object} [value=null] value on null
	 * @return {ObjectAdjuster}
	 */

	/**
	 * accept empty string
	 * @method
	 * @name ObjectAdjuster#acceptEmptyString
	 * @param {?Object} [value=null] value on empty
	 * @return {ObjectAdjuster}
	 */

	/**
	 * apply constraints
	 * @method
	 * @name ObjectAdjuster#constraints
	 * @param {Object<string, AdjusterBase>} constraints constraints to apply
	 * @return {ObjectAdjuster}
	 */

	/**
	 * do adjust
	 * @method
	 * @name ObjectAdjuster#adjust
	 * @param {*} value value to be checked
	 * @param {?AdjusterBase.OnError} [onError=null] callback function on error
	 * @return {Object} adjusted value
	 */
}
