// URI pattern follows RFC3986: https://tools.ietf.org/html/rfc3986
import {ALPHA, DIGIT, HEXDIG} from "./rfc";
import {PATTERN_IPV4} from "./ipv4";
import {PATTERN_IPV6} from "./ipv6";

// Percent-Encoding: https://tools.ietf.org/html/rfc3986#section-2.1
const PCT_ENCODED = `%${HEXDIG}${HEXDIG}`;

// Reserved Characters: https://tools.ietf.org/html/rfc3986#section-2.2
// const GEN_DELIMS = `[:/?#\\[]@]`;
const SUB_DELIMS = `[!$&'()*+,;=]`;
// const RESERVED = `(${GEN_DELIMS}|${SUB_DELIMS})`;

// Unreserved Characters: https://tools.ietf.org/html/rfc3986#section-2.3
const UNRESERVED = `(${ALPHA}|${DIGIT}|[-._~])`;

// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
const SCHEME = `${ALPHA}(${ALPHA}|${DIGIT}|[+\\-.])*`;

// User Information: https://tools.ietf.org/html/rfc3986#section-3.2.1
const USERINFO = `(${UNRESERVED}|${PCT_ENCODED}|${SUB_DELIMS}|:)*`;

// Host: https://tools.ietf.org/html/rfc3986#section-3.2.2
const IPVFUTURE = `v${HEXDIG}+\\.(${UNRESERVED}|${SUB_DELIMS}|:)+`;
const IP_LITERAL = `\\[(${PATTERN_IPV6}|${IPVFUTURE})]`;
const REG_NAME = `(${UNRESERVED}|${PCT_ENCODED}|${SUB_DELIMS})*`;
const HOST = `(${IP_LITERAL}|${PATTERN_IPV4}|${REG_NAME})`;

// Port: https://tools.ietf.org/html/rfc3986#section-3.2.3
const PORT = `\\d*`;

// Authority: https://tools.ietf.org/html/rfc3986#section-3.2
const AUTHORITY = `(${USERINFO}@)?${HOST}(:${PORT})?`;

// Path: https://tools.ietf.org/html/rfc3986#section-3.3
const PCHAR = `(${UNRESERVED}|${PCT_ENCODED}|${SUB_DELIMS}|[:@])`;
const SEGMENT = `(${PCHAR})*`;
const SEGMENT_NZ = `(${PCHAR})+`;
// const SEGMENT_NZ_NC = `(${UNRESERVED}|${PCT_ENCODED}|${SUB_DELIMS}|@)+`; // non-zero-length segment without any colon ":"
const PATH_EMPTY = ``; // zero characters
const PATH_ROOTLESS = `${SEGMENT_NZ}(/${SEGMENT})*`; // begins with a segment
// const PATH_NOSCHEME = `${SEGMENT_NZ_NC}(/${SEGMENT})*`; // begins with a non-colon segment
const PATH_ABSOLUTE = `/(${SEGMENT_NZ}(/${SEGMENT})*)?`; // begins with "/" but not "//"
const PATH_ABEMPTY = `(/${SEGMENT})*`; // begins with "/" or is empty
// const PATH = `(${PATH_ABEMPTY}|${PATH_ABSOLUTE}|${PATH_NOSCHEME}|${PATH_ROOTLESS}|${PATH_EMPTY})`;

// Query: https://tools.ietf.org/html/rfc3986#section-3.4
const QUERY = `(${PCHAR}|[/?])*`;

// Fragment: https://tools.ietf.org/html/rfc3986#section-3.5
const FRAGMENT = `(${PCHAR}|[/?])*`;

// Syntax Components: https://tools.ietf.org/html/rfc3986#section-3
const HIER_PART = `(//${AUTHORITY}${PATH_ABEMPTY}|${PATH_ABSOLUTE}|${PATH_ROOTLESS}|${PATH_EMPTY})`;
const URI = `${SCHEME}:${HIER_PART}(\\?${QUERY})?(#${FRAGMENT})?`;

export const PATTERN_URI = URI;
export const REGEXP_URI = new RegExp(`^${PATTERN_URI}$`, "i");

// pattern for HTTP
const HTTP = `https?://${AUTHORITY}${PATH_ABEMPTY}(\\?${QUERY})?(#${FRAGMENT})?`;

export const PATTERN_HTTP = HTTP;
export const REGEXP_HTTP = new RegExp(`^${PATTERN_HTTP}$`, "i");
