import AdjusterBase from "../libs/AdjusterBase";

import Default from "../decorators/default";
import AcceptNull from "../decorators/acceptNull";
import AcceptEmptyString from "../decorators/acceptEmptyString";
import Type from "../decorators/string/type";
import Trim from "../decorators/string/trim";
import Pattern from "../decorators/string/pattern";

import {PATTERN as PATTERN_IPV4} from "./ipv4";

const PATTERN_CHARSET = "[\\da-fA-F]";
const PATTERN_COMPONENT = `${PATTERN_CHARSET}{1,4}`;

const PATTERN_0 = `:(((:${PATTERN_COMPONENT}){1,7})|((:${PATTERN_COMPONENT}){0,5}:${PATTERN_IPV4})|:)`;
const PATTERN_1 = `(${PATTERN_COMPONENT}:){1}(((:${PATTERN_COMPONENT}){1,6})|((:${PATTERN_COMPONENT}){0,4}:${PATTERN_IPV4})|:)`;
const PATTERN_2 = `(${PATTERN_COMPONENT}:){2}(((:${PATTERN_COMPONENT}){1,5})|((:${PATTERN_COMPONENT}){0,3}:${PATTERN_IPV4})|:)`;
const PATTERN_3 = `(${PATTERN_COMPONENT}:){3}(((:${PATTERN_COMPONENT}){1,4})|((:${PATTERN_COMPONENT}){0,2}:${PATTERN_IPV4})|:)`;
const PATTERN_4 = `(${PATTERN_COMPONENT}:){4}(((:${PATTERN_COMPONENT}){1,3})|((:${PATTERN_COMPONENT}){0,1}:${PATTERN_IPV4})|:)`;
const PATTERN_5 = `(${PATTERN_COMPONENT}:){5}(((:${PATTERN_COMPONENT}){1,2})|:${PATTERN_IPV4}|:)`;
const PATTERN_6 = `(${PATTERN_COMPONENT}:){6}(:${PATTERN_COMPONENT}|${PATTERN_IPV4}|:)`;
const PATTERN_7 = `(${PATTERN_COMPONENT}:){7}(${PATTERN_COMPONENT}|:)`;

const PATTERN = `(${PATTERN_0}|${PATTERN_1}|${PATTERN_2}|${PATTERN_3}|${PATTERN_4}|${PATTERN_5}|${PATTERN_6}|${PATTERN_7})`;

const REGEXP = new RegExp(`^${PATTERN}$`);

export {PATTERN};

/**
 * factory
 * @returns {IPv6Adjuster} adjuster instance
 */
export default () =>
{
	return new IPv6Adjuster();
};

/**
 * adjuster for IPv6
 */
@Pattern
@AcceptEmptyString
@Trim
@Type
@AcceptNull
@Default
class IPv6Adjuster extends AdjusterBase
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
