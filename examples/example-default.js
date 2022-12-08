"use strict";

const assert = require("assert");
const vs = require("value-schema").default;

const schemaObject = { // schema for input
	id: vs.number({ // number, >=1
		minValue: 1,
	}),
	name: vs.string({ // string, max 16 characters (trims if over)
		maxLength: {
			length: 16,
			trims: true,
		},
	}),
	birthday: vs.date(),
	age: vs.number({ // number, integer (trims if decimal), >=0
		integer: vs.NUMBER.INTEGER.FLOOR_RZ,
		minValue: 0,
	}),
	email: vs.email(), // email
	state: vs.string({ // string, accepts only "active" and "inactive"
		only: ["active", "inactive"],
	}),
	classes: vs.array({ // array of number, separated by ",", ignores errors
		separatedBy: ",",
		each: {
			schema: vs.number(),
			ignoresErrors: true,
		},
	}),
	skills: vs.array({ // array of string, separated by ",", ignores errors
		separatedBy: ",",
		each: {
			schema: vs.string(),
			ignoresErrors: true,
		},
	}),
	creditCard: vs.numericString({ // numeric string, separated by "-", checks by Luhn algorithm
		separatedBy: "-",
		checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD,
	}),
	remoteAddr: vs.string({ // IPv4
		pattern: vs.STRING.PATTERN.IPV4,
	}),
	remoteAddrIpv6: vs.string({ // IPv6
		pattern: vs.STRING.PATTERN.IPV6,
	}),
	limit: vs.number({ // number, integer, omittable (sets 10 if omitted), >=1 (sets 1 if less), <=100 (sets 100 if greater)
		ifUndefined: 10,
		integer: true,
		minValue: {
			value: 1,
			adjusts: true,
		},
		maxValue: {
			value: 100,
			adjusts: true,
		},
	}),
	offset: vs.number({ // number, integer, omittable (sets 0 if omitted), >=0 (sets 0 if less)
		ifUndefined: 0,
		integer: true,
		minValue: {
			value: 0,
			adjusts: true,
		},
	}),
};
const input = { // input values
	id: "1",
	name: "Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Ciprin Cipriano de la Santísima Trinidad Ruiz y Picasso",
	birthday: "2000-01-02T03:04:05.678Z",
	age: 20.5,
	email: "picasso@example.com",
	state: "active",
	classes: "1,3,abc,4",
	skills: "c,c++,javascript,python,,swift,kotlin",
	creditCard: "4111-1111-1111-1111",
	remoteAddr: "127.0.0.1",
	remoteAddrIpv6: "::1",
	limit: "0",
};
const expected = { // should be converted to this
	id: 1,
	name: "Pablo Diego José",
	birthday: new Date("2000-01-02T03:04:05.678Z"),
	age: 20,
	email: "picasso@example.com",
	state: "active",
	classes: [1, 3, 4],
	skills: ["c", "c++", "javascript", "python", "swift", "kotlin"],
	creditCard: "4111111111111111",
	remoteAddr: "127.0.0.1",
	remoteAddrIpv6: "::1",
	limit: 1,
	offset: 0,
};

// Let's apply!
const actual = vs.applySchemaObject(schemaObject, input);

// verification
assert.deepStrictEqual(actual, expected);

console.log("CJS(TypeScript/Babel compatible): OK!🎉");
