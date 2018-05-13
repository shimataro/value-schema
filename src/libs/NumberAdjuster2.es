import AdjusterInterface from "./AdjusterInterface";

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
export default class NumberAdjuster2 extends AdjusterInterface
{
}
