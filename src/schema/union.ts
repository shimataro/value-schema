import * as type from "../appliers/union/type";
import {BaseSchema} from "../libs/BaseSchema";

type TupleToUnion<T extends unknown[]> = T[number];

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
export function union<T extends BaseSchema<any>[]>(...schemas: T): UnionSchema<TupleToUnion<Unwrap<T>>> // eslint-disable-line @typescript-eslint/no-explicit-any
{
	return new UnionSchema({schemas});
}
