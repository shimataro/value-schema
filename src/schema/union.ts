import * as type from "../appliers/union/type";
import {BaseSchema} from "../libs/BaseSchema";

class UnionSchema<T> extends BaseSchema<T>
{
	constructor(options: type.Options<T>)
	{
		super(options, [type.applyTo]);
	}
}

/**
 * create schema
 * @param schemas Options
 * @returns schema
 */
export function union<T>(...schemas: BaseSchema<T>[]): UnionSchema<T>
{
	return new UnionSchema({schemas});
}
