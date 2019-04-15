import AdjusterBase from "../libs/AdjusterBase";

import Default from "../decorators/default";
import AcceptNull from "../decorators/acceptNull";
import AcceptEmptyString from "../decorators/acceptEmptyString";
import Only from "../decorators/only";
import Convert from "../decorators/convert";
import AcceptFullWidth from "../decorators/number/acceptFullWidth";
import Type from "../decorators/number/type";
import MinValue from "../decorators/number/minValue";
import MaxValue from "../decorators/number/maxValue";

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
@Convert
@MaxValue
@MinValue
@Only
@Type
@AcceptFullWidth
@AcceptEmptyString
@AcceptNull
@Default
class NumberAdjuster extends AdjusterBase
{
}
