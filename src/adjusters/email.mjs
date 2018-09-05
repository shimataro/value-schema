import AdjusterBase from "../libs/AdjusterBase";

import Default from "../decorators/default";
import AcceptNull from "../decorators/acceptNull";
import AcceptEmptyString from "../decorators/acceptEmptyString";
import Type from "../decorators/string/type";
import Trim from "../decorators/string/trim";
import Pattern from "../decorators/string/pattern";
import MaxLength from "../decorators/email/maxLength";

import {REGEXP_EMAIL} from "../libs/regexp/email";

/**
 * factory
 * @returns {EmailAdjuster} adjuster instance
 */
export default () =>
{
	return new EmailAdjuster();
};

/**
 * adjuster for e-mail
 */
@Pattern
@MaxLength
@AcceptEmptyString
@Trim
@Type
@AcceptNull
@Default
class EmailAdjuster extends AdjusterBase
{
	/**
	 * constructor
	 */
	constructor()
	{
		super();

		this.pattern(REGEXP_EMAIL);
	}
}
