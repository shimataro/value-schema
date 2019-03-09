import * as assert from "assert";

import * as adjuster from "./index";

const constraints: adjuster.Constraints = { // constraints for input
	id: adjuster.number().minValue(1), // number, >=1
	name: adjuster.string().maxLength(16, true), // string, max 16 characters (trims if over)
	age: adjuster.number().integer(true).minValue(0), // number, integer (trims if decimal), >=0
	email: adjuster.email(), // email
	state: adjuster.string().only("active", "inactive"), // string, accepts only "active" and "inactive"
	classes: adjuster.array().separatedBy(",").each(adjuster.number(), true), // array of number, separated by ",", ignores errors
	skills: adjuster.array().separatedBy(",").each(adjuster.string(), true), // array of string, separated by ",", ignores errors
	credit_card: adjuster.numericString().separatedBy("-").checksum(adjuster.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD), // numeric string, separated by "-", checks by Luhn algorithm
	remote_addr: adjuster.string().pattern(adjuster.STRING.PATTERN.IPV4), // IPv4
	remote_addr_ipv6: adjuster.string().pattern(adjuster.STRING.PATTERN.IPV6), // IPv6
	limit: adjuster.number().integer().default(10).minValue(1, true).maxValue(100, true), // number, integer, omittable (sets 10 if omitted), >=1 (sets 1 if less), <=100 (sets 100 if greater)
	offset: adjuster.number().integer().default(0).minValue(0, true), // number, integer, omiitable (sets 0 if omited), >=0 (sets 0 if less)
};
const input = { // input values
	id: "1",
	name: "Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Ciprin Cipriano de la Santísima Trinidad Ruiz y Picasso",
	age: 20.5,
	email: "picasso@example.com",
	state: "active",
	classes: "1,3,abc,4",
	skills: "c,c++,javascript,python,,swift,kotlin",
	credit_card: "4111-1111-1111-1111",
	remote_addr: "127.0.0.1",
	remote_addr_ipv6: "::1",
	limit: "0",
};
const expected = { // should be adjusted to this
	id: 1,
	name: "Pablo Diego José",
	age: 20,
	email: "picasso@example.com",
	state: "active",
	classes: [1, 3, 4],
	skills: ["c", "c++", "javascript", "python", "swift", "kotlin"],
	credit_card: "4111111111111111",
	remote_addr: "127.0.0.1",
	remote_addr_ipv6: "::1",
	limit: 1,
	offset: 0,
};

// Let's adjust!
const adjusted = adjuster.adjust(input, constraints);

// verification
assert.deepStrictEqual(adjusted, expected);
