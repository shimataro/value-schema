import {CHECKSUM_ALGORITHM, INTEGER} from "./enums";
import {REGEXP_EMAIL} from "./regexp/email";
import {REGEXP_IPV4} from "./regexp/ipv4";
import {REGEXP_IPV6} from "./regexp/ipv6";
import {REGEXP_HTTP, REGEXP_URI} from "./regexp/uri";
import {CONVERT_CASE} from "../appliers/string/convertCase";

export {CAUSE} from "./enums";

export const NUMBER = {
	INTEGER,
};

export const NUMERIC_STRING = {
	CHECKSUM_ALGORITHM,
};

export const STRING = {
	CONVERT_CASE,
	PATTERN: {
		EMAIL: REGEXP_EMAIL,
		HTTP: REGEXP_HTTP,
		IPV4: REGEXP_IPV4,
		IPV6: REGEXP_IPV6,
		URI: REGEXP_URI,
	},
};
