import AdjusterInterface from "./AdjusterInterface";

import decInit from "./decorators/init";
import decDefault from "./decorators/default";
import decAllowEmpty from "./decorators/allowEmpty";
import decType from "./decorators/number/type";
import decIn from "./decorators/in";
import decMinValue from "./decorators/number/minValue";
import decMaxValue from "./decorators/number/maxValue";

/**
 * adjuster for number
 */
@decMaxValue
@decMinValue
@decIn
@decType
@decAllowEmpty
@decDefault
@decInit
export default class NumberAdjuster2 extends AdjusterInterface
{
}
