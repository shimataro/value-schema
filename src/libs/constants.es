/**
 * cause of error
 * @type {AdjusterErrorCause}
 */
export const CAUSE = {
	TYPE: "type",
	REQUIRED: "required",
	EMPTY: "empty",
	IN: "in",

	MIN_VALUE: "min-value",
	MAX_VALUE: "max-value",

	MIN_LENGTH: "min-length",
	MAX_LENGTH: "max-length",
	PATTERN: "pattern",

	IPV4: "ipv4",
	IPV6: "ipv6",
	EMAIL: "email",
};

/**
 * @typedef {Object} AdjusterErrorCause
 * @property {string} TYPE
 * @property {string} REQUIRED
 * @property {string} EMPTY
 * @property {string} IN
 * @property {string} MIN_VALUE
 * @property {string} MAX_VALUE
 * @property {string} MIN_LENGTH
 * @property {string} MAX_LENGTH
 * @property {string} PATTERN
 * @property {string} IPV4
 * @property {string} IPV6
 * @property {string} EMAIL
 */
