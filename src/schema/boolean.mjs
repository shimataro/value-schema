import BaseSchema from "../libs/BaseSchema";

import Default from "../decorators/default";
import AcceptNull from "../decorators/acceptNull";
import AcceptEmptyString from "../decorators/acceptEmptyString";
import Type from "../decorators/boolean/type";

/**
 * factory
 * @returns {BooleanSchema} schema instance
 */
export default () =>
{
	return new BooleanSchema();
};

/**
 * valueSchema for boolean
 */
@Type
@AcceptEmptyString
@AcceptNull
@Default
class BooleanSchema extends BaseSchema
{
}
