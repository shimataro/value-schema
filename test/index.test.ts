import vs from "value-schema";
import {describe, expect, it} from "@jest/globals";

{
	describe("applySchemaObject", testApplySchemaObject);
	describe("error", testError);
}

/**
 * test applySchemaObject()
 */
function testApplySchemaObject(): void
{
	it("should be adjusted", () =>
	{
		const enum State
		{
			ACTIVE = "active",
			INACTIVE = "inactive",
		}
		interface SchemaType
		{
			id: number;
			name: string;
			age: number;
			email: string | null;
			state: State;
			classes: number[];
			skills: string[];
			creditCard: string;
			remoteAddr: string;
			remoteAddrIpv6: string;
			limit: number;
			offset: number;
		}

		const input = {
			id: "1",
			name: "Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Ciprin Cipriano de la Santísima Trinidad Ruiz y Picasso",
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
		const expected: SchemaType = {
			id: 1,
			name: "Pablo Diego José",
			age: 20,
			email: "picasso@example.com",
			state: State.ACTIVE,
			classes: [1, 3, 4],
			skills: ["c", "c++", "javascript", "python", "swift", "kotlin"],
			creditCard: "4111111111111111",
			remoteAddr: "127.0.0.1",
			remoteAddrIpv6: "::1",
			limit: 1,
			offset: 0,
		};

		// type check
		const actual = parse(input);
		expect(actual).toEqual(expected);

		/**
		 * parse input value
		 * @param input input value
		 * @returns parsed result
		 */
		function parse(input: unknown): SchemaType
		{
			const schemaObject = {
				id: vs.number({
					minValue: 1,
				}),
				name: vs.string({
					maxLength: {
						length: 16,
						trims: true,
					},
				}),
				age: vs.number({
					integer: vs.NUMBER.INTEGER.FLOOR_RZ,
					minValue: 0,
				}),
				email: vs.email({
					ifUndefined: null,
				}),
				state: vs.enumeration({
					only: [State.ACTIVE, State.INACTIVE],
				}),
				classes: vs.array({
					separatedBy: ",",
					each: {
						schema: vs.number(),
						ignoresErrors: true,
					},
				}),
				skills: vs.array({
					separatedBy: ",",
					each: {
						schema: vs.string(),
						ignoresErrors: true,
					},
				}),
				creditCard: vs.numericString({
					separatedBy: "-",
					checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD,
				}),
				remoteAddr: vs.string({
					pattern: vs.STRING.PATTERN.IPV4,
				}),
				remoteAddrIpv6: vs.string({
					pattern: vs.STRING.PATTERN.IPV6,
				}),
				limit: vs.number({
					integer: true,
					ifUndefined: 10,
					minValue: {
						value: 1,
						adjusts: true,
					},
					maxValue: {
						value: 100,
						adjusts: true,
					},
				}),
				offset: vs.number({
					integer: true,
					ifUndefined: 0,
					minValue: {
						value: 0,
						adjusts: true,
					},
				}),
			};
			return vs.applySchemaObject(schemaObject, input);
		}
	});
	it("property / type-inference test", () =>
	{
		const schemaObject = {
			boolean: vs.boolean(),
			number: vs.number(),
			string: vs.string(),
			email: vs.email(),
			numericString: vs.numericString(),

			arrayOfBoolean: vs.array({each: vs.boolean()}),
			arrayOfNumber: vs.array({each: vs.number()}),
			arrayOfString: vs.array({each: vs.string()}),
			arrayOfArrayOfNumber: vs.array({
				each: vs.array({
					each: vs.number(),
				}),
			}),
			arrayOfObject: vs.array({
				each: vs.object({
					schemaObject: {foo: vs.number()},
				}),
			}),

			object: vs.object({
				schemaObject: {
					boolean: vs.boolean(),
					number: vs.number(),
					string: vs.string(),
					email: vs.email(),
					numericString: vs.numericString(),

					arrayOfBoolean: vs.array({each: vs.boolean()}),
					arrayOfNumber: vs.array({each: vs.number()}),
					arrayOfArrayOfString: vs.array({
						each: vs.array({
							each: vs.string(),
						}),
					}),
					arrayOfString: vs.array({each: vs.string()}),
				},
			}),
		};
		const input = {
			boolean: false,
			number: 0,
			string: "X",
			email: "user@example.com",
			numericString: "1234",

			arrayOfBoolean: [true, false],
			arrayOfNumber: [0, 1, 2, 3],
			arrayOfString: ["a", "b", "c"],
			arrayOfArrayOfNumber: [[0, 1], [2], [3, 4, 5]],
			arrayOfObject: [{foo: 1}, {foo: 2}, {foo: 3}],

			object: {
				boolean: false,
				number: 0,
				string: "X",
				email: "user@example.com",
				numericString: "1234",

				arrayOfBoolean: [true, false],
				arrayOfNumber: [0, 1, 2, 3],
				arrayOfString: ["a", "b", "c"],
				arrayOfArrayOfString: [["A", "B"], ["C"], ["X", "Y", "Z"]],
			},
		};

		// property / type-inference check
		const actual = vs.applySchemaObject(schemaObject, input);
		expect(actual.boolean).toEqual(false);
		expect(actual.number.toExponential()).toEqual("0e+0");
		expect(actual.string.toLowerCase()).toEqual("x");
		expect(actual.email.toUpperCase()).toEqual("USER@EXAMPLE.COM");
		expect(actual.numericString.padStart(8, "0")).toEqual("00001234");

		expect(actual.arrayOfBoolean.slice()).toEqual([true, false]);
		expect(actual.arrayOfNumber.slice()[0].toFixed()).toEqual("0");
		expect(actual.arrayOfString.slice()[0].toUpperCase()).toEqual("A");
		expect(actual.arrayOfArrayOfNumber.slice()[0].slice()[0].toFixed()).toEqual("0");
		expect(actual.arrayOfObject.slice()[0].foo.toExponential()).toEqual("1e+0");

		expect(actual.object.boolean).toEqual(false);
		expect(actual.object.number.toExponential()).toEqual("0e+0");
		expect(actual.object.string.toLowerCase()).toEqual("x");
		expect(actual.object.email.toUpperCase()).toEqual("USER@EXAMPLE.COM");
		expect(actual.object.numericString.padEnd(8, "0")).toEqual("12340000");
		expect(actual.object.arrayOfBoolean.slice()[0]).toEqual(true);
		expect(actual.object.arrayOfNumber.slice()[0].toFixed()).toEqual("0");
		expect(actual.object.arrayOfString.slice()[0].toUpperCase()).toEqual("A");
		expect(actual.object.arrayOfArrayOfString.slice()[0].slice()[1].toLowerCase()).toEqual("b");
	});
}

/**
 * error handling
 */
function testError(): void
{
	it("should be adjusted", () =>
	{
		const schemaObject = {
			id: vs.number({
				minValue: 1,
			}),
			name: vs.string({
				maxLength: {
					length: 16,
					trims: true,
				},
			}),
			email: vs.email(),
		};
		const input = {
			id: 0, // error! (>= 1)
			name: "", // error! (empty string is not allowed)
			email: "john@example.com", // OK
		};
		const expected = {
			id: 100,
			name: "John",
			email: "john@example.com",
		};

		const actual = vs.applySchemaObject(schemaObject, input, (err) =>
		{
			switch(err.keyStack.shift())
			{
			case "id":
				return 100;

			default:
				return "John";
			}
		});
		expect(actual).toEqual(expected);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			// input must be an object
			vs.applySchemaObject({}, null, (err) =>
			{
				expect(err.rule).toEqual(vs.RULE.TYPE);
				return null;
			});
		}).toThrow(vs.RULE.TYPE);

		expect(
			// input must be an object
			vs.applySchemaObject({}, null, (err) =>
			{
				expect(err.rule).toEqual(vs.RULE.TYPE);
				return {};
			})
		).toEqual({});

		expect(() =>
		{
			const schemaObject = {};
			const input = 0;

			vs.applySchemaObject(schemaObject, input);
		}).toThrow(vs.RULE.TYPE); // input must be an object

		expect(() =>
		{
			const schemaObject = {};
			const input = null;

			vs.applySchemaObject(schemaObject, input);
		}).toThrow(vs.RULE.TYPE); // input must be an object; typeof null === "object"

		expect(() =>
		{
			const schemaObject = {};
			const input: number[] = [];

			vs.applySchemaObject(schemaObject, input);
		}).toThrow(vs.RULE.TYPE); // input must be an object; typeof [] === "object"

		expect(() =>
		{
			const schemaObject = {
				id: vs.number({
					minValue: 1,
				}),
				name: vs.string({
					maxLength: {
						length: 16,
						trims: true,
					},
				}),
				email: vs.email(),
			};
			const input = {
				id: 0, // error! (>= 1)
				name: "", // error! (empty string is not allowed)
				email: "john@example.com", // OK
			};

			const keys: (string | number)[] = [];
			vs.applySchemaObject(schemaObject, input, (err) =>
			{
				if(err.keyStack.length === 0)
				{
					return;
				}
				// append key name
				keys.push(err.keyStack[0]);
			}, () =>
			{
				// finished; join key name as message
				throw new Error(keys.join(","));
			});
		}).toThrow("id,name");

		expect(() =>
		{
			const schemaObject = {
				id: vs.number({
					minValue: 1,
				}),
				name: vs.string({
					maxLength: {
						length: 16,
						trims: true,
					},
				}),
				email: vs.email(),
			};
			const input = {
				id: 0, // error! (>= 1)
				name: "", // error! (empty string is not allowed)
				email: "john@example.com", // OK
			};

			vs.applySchemaObject(schemaObject, input);
		}).toThrow(); // throw a first error if error handler is omitted

		try
		{
			const schemaObject = {
				id: vs.number({
					minValue: 1,
				}),
				name: vs.string({
					maxLength: {
						length: 4,
						trims: true,
					},
				}),
			};
			const input = {
				id: "0",
				name: "John Doe",
				dummy: true,
			};
			vs.object({
				schemaObject: schemaObject,
			}).applyTo(input);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(vs.ValueSchemaError.is(err)).toBeTruthy();
			if(!vs.ValueSchemaError.is(err))
			{
				return;
			}
			expect(err.rule).toEqual(vs.RULE.MIN_VALUE);
			expect(err.keyStack).toEqual(["id"]);
		}

		try
		{
			const schemaObject = {
				ids: vs.array({
					each: vs.number({
						minValue: 1,
					}),
				}),
			};
			const input = {
				ids: [true, "2", "+3", "four", 5],
			};
			vs.object({
				schemaObject: schemaObject,
			}).applyTo(input);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(vs.ValueSchemaError.is(err)).toBeTruthy();
			if(!vs.ValueSchemaError.is(err))
			{
				return;
			}
			expect(err.rule).toEqual(vs.RULE.TYPE);
			expect(err.keyStack).toEqual(["ids", 3]);
		}

		try
		{
			// complex schema
			const schemaObject = {
				infoList: vs.array({
					each: vs.object({
						schemaObject: {
							id: vs.number(),
							name: vs.string({
								maxLength: 8,
							}),
						},
					}),
				}),
			};
			const input = {
				infoList: [
					{
						id: "1",
						name: "John Doe",
					},
					{
						id: "two", // ERROR!
						name: "John Doe",
					},
					{
						id: 3,
						name: "John Doe 2", // ERROR!
					},
				],
			};
			vs.object({
				schemaObject: schemaObject,
			}).applyTo(input);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(vs.ValueSchemaError.is(err)).toBeTruthy();
			if(!vs.ValueSchemaError.is(err))
			{
				return;
			}
			expect(err.rule).toEqual(vs.RULE.TYPE);
			expect(err.keyStack).toEqual(["infoList", 1, "id"]);
		}
	});
}
