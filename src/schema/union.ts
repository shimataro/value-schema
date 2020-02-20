import * as type from "../appliers/union/type";
import {BaseSchema} from "../libs/BaseSchema";

type Union<T extends BaseSchema[]> = Unwrap<T>[number];
type Unwrap<S> = {[P in keyof S]: SchemaType<S[P]>};
type SchemaType<S> = S extends BaseSchema<infer T> ? T : never;

class UnionSchema<T> extends BaseSchema<T>
{
	constructor(options: type.Options<T>)
	{
		super(options, [type.applyTo]);
	}
}

/**
 * create schema
 * @param schemas schemas to unify
 * @returns schema
 */
export function union<T extends BaseSchema[]>(...schemas: T): UnionSchema<Union<T>>
{
	return new UnionSchema({
		schemas: schemas as BaseSchema<Union<T>>[],
	});
}
