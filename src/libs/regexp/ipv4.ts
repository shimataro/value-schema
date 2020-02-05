import {DEC_OCTET} from "./rfc";

const IPV4ADDRESS = `${DEC_OCTET}(\\.${DEC_OCTET}){3}`;

export const PATTERN_IPV4 = IPV4ADDRESS;
export const REGEXP_IPV4 = new RegExp(`^${PATTERN_IPV4}$`);
