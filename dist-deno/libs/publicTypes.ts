import { ValueSchemaError } from "./ValueSchemaError.ts";
export type NullableRules = {
    ifNull: null;
} | {
    ifUndefined: null;
} | {
    ifEmptyString: null;
};
export type UndefinableRules = {
    ifUndefined: undefined;
};
export type ErrorHandler<T = unknown> = (err: ValueSchemaError) => T | never;
export type FinishHandler = () => void;
