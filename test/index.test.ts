import vs from "value-schema";

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
			email: vs.email(),
			state: vs.string({
				only: ["active", "inactive"],
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
		const expected = {
			id: 1,
			name: "Pablo Diego José",
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

		const actual = vs.applySchemaObject(schemaObject, input);
		expect(actual).toEqual(expected);
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
			arrayOfArray: vs.array({each: vs.array({
				each: vs.number(),
			})}),
			arrayOfObject: vs.array({each: vs.object({
				schemaObject: {foo: vs.number()},
			})}),

			object: vs.object({
				schemaObject: {
					boolean: vs.boolean(),
					number: vs.number(),
					string: vs.string(),
					email: vs.email(),
					numericString: vs.numericString(),

					arrayOfBoolean: vs.array({each: vs.boolean()}),
					arrayOfNumber: vs.array({each: vs.number()}),
					arrayOfArray: vs.array({each: vs.array({
						each: vs.number(),
					})}),
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
			arrayOfArray: [[0, 1], [2], [3, 4, 5]],
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
				arrayOfArray: [[0, 1], [2], [3, 4, 5]],
			},
		};

		// property check
		const actual = vs.applySchemaObject(schemaObject, input);
		expect(actual.number).toEqual(0);
		expect(actual.string).toEqual("X");
		expect(actual.email).toEqual("user@example.com");
		expect(actual.numericString).toEqual("1234");

		expect(actual.arrayOfBoolean).toEqual([true, false]);
		expect(actual.arrayOfNumber).toEqual([0, 1, 2, 3]);
		expect(actual.arrayOfString).toEqual(["a", "b", "c"]);
		expect(actual.arrayOfArray).toEqual([[0, 1], [2], [3, 4, 5]]);
		expect(actual.arrayOfObject).toEqual([{foo: 1}, {foo: 2}, {foo: 3}]);

		expect(actual.object.boolean).toEqual(false);
		expect(actual.object.number).toEqual(0);
		expect(actual.object.string).toEqual("X");
		expect(actual.object.email).toEqual("user@example.com");
		expect(actual.object.numericString).toEqual("1234");
		expect(actual.object.arrayOfBoolean).toEqual([true, false]);
		expect(actual.object.arrayOfNumber).toEqual([0, 1, 2, 3]);
		expect(actual.object.arrayOfString).toEqual(["a", "b", "c"]);
		expect(actual.object.arrayOfArray).toEqual([[0, 1], [2], [3, 4, 5]]);

		// type-inference check
		actual.number.toExponential();
		actual.string.toUpperCase();
		actual.email.toUpperCase();
		actual.numericString.toUpperCase();

		actual.arrayOfBoolean.slice();
		actual.arrayOfNumber.slice()[0].toExponential();
		actual.arrayOfString.slice()[0].toUpperCase();
		actual.arrayOfArray.slice()[0].slice()[0].toExponential();
		actual.arrayOfObject.slice()[0].foo.toExponential();

		actual.object.number.toExponential();
		actual.object.string.toUpperCase();
		actual.object.email.toUpperCase();
		actual.object.numericString.toUpperCase();
		actual.object.arrayOfBoolean.slice();
		actual.object.arrayOfNumber.slice()[0].toExponential();
		actual.object.arrayOfString.slice()[0].toUpperCase();
		actual.object.arrayOfArray.slice()[0].slice()[0].toExponential();
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
				expect(err.cause).toEqual(vs.CAUSE.TYPE);
				return null;
			});
		}).toThrow(vs.CAUSE.TYPE);

		expect(
			// input must be an object
			vs.applySchemaObject({}, null, (err) =>
			{
				expect(err.cause).toEqual(vs.CAUSE.TYPE);
				return {};
			})
		).toEqual({});

		expect(() =>
		{
			const schemaObject = {};
			const input = 0;

			vs.applySchemaObject(schemaObject, input);
		}).toThrow(vs.CAUSE.TYPE); // input must be an object

		expect(() =>
		{
			const schemaObject = {};
			const input = null;

			vs.applySchemaObject(schemaObject, input);
		}).toThrow(vs.CAUSE.TYPE); // input must be an object; typeof null === "object"

		expect(() =>
		{
			const schemaObject = {};
			const input: number[] = [];

			vs.applySchemaObject(schemaObject, input);
		}).toThrow(vs.CAUSE.TYPE); // input must be an object; typeof [] === "object"

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
			expect(err.cause).toEqual(vs.CAUSE.MIN_VALUE);
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
			expect(err.cause).toEqual(vs.CAUSE.TYPE);
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
			expect(err.cause).toEqual(vs.CAUSE.TYPE);
			expect(err.keyStack).toEqual(["infoList", 1, "id"]);
		}
	});
}
