import AdjusterBase from "../libs/AdjusterBase";

import Default from "../decorators/default";
import AcceptNull from "../decorators/acceptNull";
import AcceptEmptyString from "../decorators/acceptEmptyString";
import Type from "../decorators/string/type";
import Trim from "../decorators/string/trim";
import Pattern from "../decorators/string/pattern";

import {REGEXP} from "../libs/regexp/ipv4";

/**
 * factory
 * @returns {IPv4Adjuster} adjuster instance
 */
export default () =>
{
	return new IPv4Adjuster();
};

/**
 * adjuster for IPv4
 */
@Pattern
@AcceptEmptyString
@Trim
@Type
@AcceptNull
@Default
class IPv4Adjuster extends AdjusterBase
{
	/**
	 * constructor
	 */
	constructor()
	{
		super();

		this.pattern(REGEXP);
	}
}
