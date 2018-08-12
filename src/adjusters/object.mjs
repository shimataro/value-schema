import AdjusterBase from "../libs/AdjusterBase";

import Default from "../libs/decorators/default";
import AcceptNull from "../libs/decorators/acceptNull";
import AcceptEmptyString from "../libs/decorators/acceptEmptyString";
import Type from "../libs/decorators/object/type";
import Constraints from "../libs/decorators/object/constraints";

/**
 * factory
 * @returns {ObjectAdjuster} adjuster instance
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
	 * @returns {ObjectAdjuster}
	 */

	/**
	 * accept null
	 * @method
	 * @name ObjectAdjuster#acceptNull
	 * @param {?Object} [value=null] value on null
	 * @returns {ObjectAdjuster}
	 */

	/**
	 * accept empty string
	 * @method
	 * @name ObjectAdjuster#acceptEmptyString
	 * @param {?Object} [value=null] value on empty
	 * @returns {ObjectAdjuster}
	 */

	/**
	 * apply constraints
	 * @method
	 * @name ObjectAdjuster#constraints
	 * @param {Object<string, AdjusterBase>} constraints constraints to apply
	 * @returns {ObjectAdjuster}
	 */

	/**
	 * do adjust
	 * @method
	 * @name ObjectAdjuster#adjust
	 * @param {*} value value to be checked
	 * @param {?AdjusterBase.OnError} [onError=null] callback function on error
	 * @returns {Object} adjusted value
	 */
}
