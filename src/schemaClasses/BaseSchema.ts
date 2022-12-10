import {Key, makeValues, Values} from "../libs/types";
import {ErrorHandler} from "../libs/publicTypes";
import {ValueSchemaError} from "../libs/ValueSchemaError";

interface Rules
{
}
type ApplyTo<T> = (values: Values, rules: Rules, keyStack: Key[]) => values is Values<T>;

/**
 * Base Schema Class
 */
export class BaseSchema<T = unknown>
{
	private readonly rules: Rules;
	private readonly applyToList: ApplyTo<T>[];

	/**
	 * constructor
	 * @param rules rules
	 * @param applyToList list of applyTo
	 */
	constructor(rules: Rules, applyToList: ApplyTo<T>[])
	{
		this.rules = rules;
		this.applyToList = applyToList;
	}

	/**
	 * apply schema
	 * @param value value to apply
	 * @param onError error handler
	 * @returns escapes from applyTo chain or not
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
				if(applyTo(values, this.rules, keyStack))
				{
					return values.output;
				}
			}

			return values.output as T;
		}
		catch(err)
		{
			return onError(err as ValueSchemaError);
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
