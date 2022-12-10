import {Key, Values} from "./types";

export const RULE =
{
	TYPE: "type",
	UNDEFINED: "undefined",
	NULL: "null",
	EMPTY_STRING: "empty-string",
	ONLY: "only",
	TRANSFORM: "transform",

	MIN_VALUE: "min-value",
	MAX_VALUE: "max-value",

	MIN_LENGTH: "min-length",
	MAX_LENGTH: "max-length",
	PATTERN: "pattern",

	CHECKSUM: "checksum",
} as const;
type RULE = typeof RULE[keyof typeof RULE];

/**
 * Value-Schema Error
 */
export class ValueSchemaError extends Error
{
	/** the rule that input value didn't satisfy */
	public readonly rule: RULE;
	public readonly value: unknown;
	public readonly keyStack: Key[];

	/**
	 * throw an error
	 * @param rule the rule that input value didn't satisfy
	 * @param values input/output values
	 * @param keyStack path to key that caused error
	 * @throws error object
	 */
	static raise(rule: RULE, values: Values, keyStack: Key[]): never
	{
		throw new ValueSchemaError(rule, values.input, keyStack);
	}

	/**
     * check whether error is instance of ValueSchemaError or not
	 * @param err error to check
	 * @returns Yes/No
	 */
	static is(err: unknown): err is ValueSchemaError
	{
		return err instanceof ValueSchemaError;
	}

	/**
	 * constructor
	 * @param rule the rule that input value didn't satisfy
	 * @param value input value
	 * @param keyStack path to key that caused error
	 */
	constructor(rule: RULE, value: unknown, keyStack: Key[])
	{
		super(`${rule}; ${value}; ${keyStack}`);

		this.name = "ValueSchemaError";
		this.rule = rule;
		this.value = value;
		this.keyStack = [...keyStack];
	}
}
