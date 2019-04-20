import * as assert from "assert";

import * as vs from "./index";

const schemaObject: vs.SchemaObject = { // schema for input
	id: vs.number().minValue(1), // number, >=1
	name: vs.string().maxLength(16, true), // string, max 16 characters (trims if over)
	age: vs.number().integer(true).minValue(0), // number, integer (trims if decimal), >=0
	email: vs.email(), // email
	state: vs.string().only("active", "inactive"), // string, accepts only "active" and "inactive"
	classes: vs.array().separatedBy(",").each(vs.number(), true), // array of number, separated by ",", ignores errors
	skills: vs.array().separatedBy(",").each(vs.string(), true), // array of string, separated by ",", ignores errors
	credit_card: vs.numericString().separatedBy("-").checksum(vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD), // numeric string, separated by "-", checks by Luhn algorithm
	remote_addr: vs.string().pattern(vs.STRING.PATTERN.IPV4), // IPv4
	remote_addr_ipv6: vs.string().pattern(vs.STRING.PATTERN.IPV6), // IPv6
	limit: vs.number().integer().default(10).minValue(1, true).maxValue(100, true), // number, integer, omittable (sets 10 if omitted), >=1 (sets 1 if less), <=100 (sets 100 if greater)
	offset: vs.number().integer().default(0).minValue(0, true), // number, integer, omittable (sets 0 if omitted), >=0 (sets 0 if less)
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

// Let's fit!
const adjusted = vs.fit(input, schemaObject);

// verification
assert.deepStrictEqual(adjusted, expected);
