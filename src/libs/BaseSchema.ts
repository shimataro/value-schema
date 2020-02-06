import {Key, Values, makeValues} from "./types";
import {ValueSchemaError} from "./ValueSchemaError";

export type ErrorHandler<T = unknown> = (err: ValueSchemaError) => T | null | never;
export type FinishHandler = () => void;

type Options = {};
type Apply<T> = (values: Values, options: Options, keyStack: Key[]) => values is Values<T>;

/**
 * Base Schema Class
 */
export class BaseSchema<T = unknown>
{
	private readonly options: Options;
	private readonly applies: Apply<T>[];

	/**
	 * constructor
	 * @param options options
	 * @param applies appliers
	 */
	constructor(options: Options, applies: Apply<T>[])
	{
		this.options = options;
		this.applies = applies;
	}

	/**
	 * apply schema
	 * @param value value to apply
	 * @param onError error handler
	 * @returns applied value
	 */
	applyTo(value: unknown, onError: ErrorHandler<T> = onErrorDefault): T | null
	{
		return this._applyTo(value, onError, []);
	}

	private _applyTo(value: unknown, onError: ErrorHandler<T>, keyStack: Key[]): T | null
	{
		try
		{
			const values = makeValues(value);
			for(const applyTo of this.applies)
			{
				if(applyTo(values, this.options, keyStack))
				{
					return values.output;
				}
			}

			return values.output as T | null;
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
