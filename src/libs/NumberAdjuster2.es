import AdjusterInterface from "./AdjusterInterface";

import Init from "./decorators/init";
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
@Init
export default class NumberAdjuster2 extends AdjusterInterface
{
}
