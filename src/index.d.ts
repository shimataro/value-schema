export = adjuster;

declare namespace adjuster
{
	/** adjustment method */
	export function adjust(data: Types.Input, constraints: Types.Constraints, onError?: Types.ErrorHandler): Object;

	export function boolean(): BooleanAdjuster;
	export function number(): NumberAdjuster;
	export function string(): StringAdjuster;
	export function numericString(): NumericStringAdjuster;
	export function ipv4(): IPv4Adjuster;
	export function ipv6(): IPv6Adjuster;
	export function email(): EmailAdjuster;
	export function array(): ArrayAdjuster;
	export function object(): ObjectAdjuster;

	export const CAUSE: Types._constants.Cause;
	export const STRING: Types._constants.StringOptions;
	export const NUMERIC_STRING: Types._constants.NumericStringOptions;

	// type definitions
	export namespace Types {
		export type Input = null | boolean | number | string | any[] | Object;
		export type Constraints = { [name: string]: AdjusterBase<any> };
		export type ErrorHandler<T = any> = (err: AdjusterError | null) => T | void;
		export type Key = string | number;
		export type Pattern = RegExp | string;

		// internal types
		namespace _constants {
			type Cause = {
				TYPE: string,
				REQUIRED: string,
				NULL: string,
				EMPTY: string,
				ONLY: string,

				MIN_VALUE: string,
				MAX_VALUE: string,

				MIN_LENGTH: string,
				MAX_LENGTH: string,
				PATTERN: string,

				CHECKSUM: string,

				ARRAY: string,
			};
			type StringOptions = {
				PATTERNS: {
					URI: string,
				},
			};
			type NumericStringOptions = {
				CHECKSUM_ALGORITHM: {
					LUHN: string,
					CREDIT_CARD: string,

					MODULUS10_WEIGHT3_1: string,
					ISBN13: string,
					EAN: string,
					JAN: string,
				},
			};
		}
		namespace _decorator {
			type Values = {
				original: Input,
				adjusted: Input,
			};
			type Info<T = any> = {
				key: Symbol,
				init: Init,
				adjust?: Adjust<T>,
			};
			type Init = (params: Object) => void;
			type Feature = (params: Object, ...args: any[]) => void;
			type Adjust<T = any> = (params: Object, value: Values, onError?: ErrorHandler<T>) => boolean;

			type Class = Function;
			type ClassDecorator = (TargetClass: Class) => Class;
		}
	}

	// class definitions
	class AdjusterError extends Error
	{
		name: string;
		cause: string;
		value: any;
		keyStack: Types.Key[];
	}

	interface AdjusterBase<T>
	{
		adjust(value: Types.Input, onError?: Types.ErrorHandler<T>): T;
	}

	interface BooleanAdjuster extends AdjusterBase<boolean> {
		strict(): BooleanAdjuster;
		acceptAllNumbers(): BooleanAdjuster;
		default(value: boolean): BooleanAdjuster;
		acceptNull(value?: boolean | null /* = null */): BooleanAdjuster;
		acceptEmptyString(value?: boolean | null /* = null */): BooleanAdjuster;
	}

	interface NumberAdjuster extends AdjusterBase<number>
	{
		strict(): NumberAdjuster;
		default(value: number): NumberAdjuster;
		acceptNull(value?: number | null /* = null */): NumberAdjuster;
		acceptEmptyString(value?: number | null /* = null */): NumberAdjuster;
		acceptSpecialFormats(): NumberAdjuster;
		integer(adjust?: boolean /* = false */): NumberAdjuster;
		only(...values: number[]): NumberAdjuster;
		minValue(value: number, adjust?: boolean /* = false */): NumberAdjuster;
		maxValue(value: number, adjust?: boolean /* = false */): NumberAdjuster;
	}

	interface StringAdjuster extends AdjusterBase<string>
	{
		strict(): StringAdjuster;
		default(value: string): StringAdjuster;
		acceptNull(value?: string | null /* = null */): StringAdjuster;
		acceptEmptyString(value?: string | null /* = null */): StringAdjuster;
		trim(): StringAdjuster;
		only(...values: string[]): StringAdjuster;
		minLength(length: number): StringAdjuster;
		maxLength(length: number, adjust?: boolean /* = false */): StringAdjuster;
		pattern(pattern: Types.Pattern): StringAdjuster;
	}

	interface NumericStringAdjuster extends AdjusterBase<string>
	{
		default(value: string): NumericStringAdjuster;
		acceptNull(value?: string | null /* = null */): NumericStringAdjuster;
		acceptEmptyString(value?: string | null /* = null */): NumericStringAdjuster;
		joinArray(): NumericStringAdjuster;
		separatedBy(separator: Types.Pattern): NumericStringAdjuster;
		minLength(length: number): NumericStringAdjuster;
		maxLength(length: number, adjust?: boolean /* = false */): NumericStringAdjuster;
		checksum(algorithm: string): NumericStringAdjuster;
	}

	interface IPv4Adjuster extends AdjusterBase<string>
	{
		default(value: string): IPv4Adjuster;
		acceptNull(value?: string | null /* = null */): IPv4Adjuster;
		acceptEmptyString(value?: string | null /* = null */): IPv4Adjuster;
		trim(): IPv4Adjuster;
	}

	interface IPv6Adjuster extends AdjusterBase<string>
	{
		default(value: string): IPv6Adjuster;
		acceptNull(value?: string | null /* = null */): IPv6Adjuster;
		acceptEmptyString(value?: string | null /* = null */): IPv6Adjuster;
		trim(): IPv6Adjuster;
	}

	interface EmailAdjuster extends AdjusterBase<string>
	{
		default(value: string): EmailAdjuster;
		acceptNull(value?: string | null /* = null */): EmailAdjuster;
		acceptEmptyString(value?: string | null /* = null */): EmailAdjuster;
		trim(): EmailAdjuster;
		pattern(pattern: Types.Pattern): EmailAdjuster;
	}

	interface ArrayAdjuster extends AdjusterBase<any[]>
	{
		default(value: any[]): ArrayAdjuster;
		acceptNull(value?: any[] | null /* = null */): ArrayAdjuster;
		acceptEmptyString(value?: any[] | null /* = null */): ArrayAdjuster;
		separatedBy(separator: Types.Pattern): ArrayAdjuster;
		toArray(): ArrayAdjuster;
		minLength(length: number): ArrayAdjuster;
		maxLength(length: number, adjust?: boolean /* = false */): ArrayAdjuster;
		each(adjusterInstance: AdjusterBase<any>, ignoreEachErrors?: boolean /* = false */): ArrayAdjuster;
	}

	interface ObjectAdjuster extends AdjusterBase<Object>
	{
		default(value: Object): ObjectAdjuster;
		acceptNull(value?: Object | null /* = null */): ObjectAdjuster;
		acceptEmptyString(value?: Object | null /* = null */): ObjectAdjuster;
		constraints(constraints: Types.Constraints): ObjectAdjuster;
	}
}
