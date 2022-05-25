import { ValueSchemaError } from "./ValueSchemaError.ts";
export type NullableOptions = {
    ifNull: null;
} | {
    ifUndefined: null;
} | {
    ifEmptyString: null;
};
export type UndefinableOptions = {
    ifUndefined: undefined;
};
export type ErrorHandler<T = unknown> = (err: ValueSchemaError) => T | never;
export type FinishHandler = () => void;
