import {Key, Values, makeValues} from "../libs/types";
import {ValueSchemaError} from "../libs/ValueSchemaError";

export type ErrorHandler<T = unknown> = (err: ValueSchemaError) => T | never;
export type FinishHandler = () => void;

interface Options
{
}
type ApplyTo<T> = (values: Values, options: Options, keyStack: Key[]) => values is Values<T>;

export type NullableOptions = {ifNull: null} | {ifUndefined: null} | {ifEmptyString: null}

/**
 * Base Schema Class
 */
export class BaseSchema<T = unknown>
{
	private readonly options: Options;
	private readonly applyToList: ApplyTo<T>[];

	/**
	 * constructor
	 * @param options options
	 * @param applyToList list of applyTo
	 */
	constructor(options: Options, applyToList: ApplyTo<T>[])
	{
		this.options = options;
		this.applyToList = applyToList;
	}

	/**
	 * apply schema
	 * @param value value to apply
	 * @param onError error handler
	 * @returns applied value
	 */
	applyTo(value: unknown, onError: ErrorHandler<T> = onErrorDefault): T
	{
		return this._applyTo(value, onError, []);
	}

	private _applyTo(value: unknown, onError: ErrorHandler<T>, keyStack: Key[]): T
	{
		try
		{
			const values = makeValues(value);
			for(const applyTo of this.applyToList)
			{
				if(applyTo(values, this.options, keyStack))
				{
					return values.output;
				}
			}

			return values.output as T;
		}
		catch(err)
		{
			return onError(err);
		}
	}
}

/**
 * default error handler
 * @param err error object
 */
export function onErrorDefault(err: ValueSchemaError): never
{
	throw err;
}

/**
 * default finish handler
 */
export function onFinishedDefault(): void
{
	// do nothing
}
