import vs from "value-schema";

{
	describe("applySchema", testApplySchema);
	describe("error", testError);
}

/**
 * test applySchema()
 */
function testApplySchema(): void
{
	it("should be adjusted", () =>
	{
		const schemaObject: vs.SchemaObject = {
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

		const actual = vs.applySchema(input, schemaObject);
		expect(actual).toEqual(expected);
	});
}

/**
 * error handling
 */
function testError(): void
{
	it("should be adjusted", () =>
	{
		const schemaObject: vs.SchemaObject = {
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

		const actual = vs.applySchema(input, schemaObject, (err) =>
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
			vs.applySchema(null, {}, (err) =>
			{
				expect(err.cause).toEqual(vs.CAUSE.TYPE);
				return null;
			});
		}).toThrow(vs.CAUSE.TYPE);

		expect(
			// input must be an object
			vs.applySchema(null, {}, (err) =>
			{
				expect(err.cause).toEqual(vs.CAUSE.TYPE);
				return {};
			})
		).toEqual({});

		expect(() =>
		{
			const schemaObject: vs.SchemaObject = {};
			const input = 0;

			vs.applySchema(input, schemaObject);
		}).toThrow(vs.CAUSE.TYPE); // input must be an object

		expect(() =>
		{
			const schemaObject: vs.SchemaObject = {};
			const input = null;

			vs.applySchema(input, schemaObject);
		}).toThrow(vs.CAUSE.TYPE); // input must be an object; typeof null === "object"

		expect(() =>
		{
			const schemaObject: vs.SchemaObject = {};
			const input: number[] = [];

			vs.applySchema(input, schemaObject);
		}).toThrow(vs.CAUSE.TYPE); // input must be an object; typeof [] === "object"

		expect(() =>
		{
			const schemaObject: vs.SchemaObject = {
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
			vs.applySchema(input, schemaObject, (err) =>
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
			const schemaObject: vs.SchemaObject = {
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

			vs.applySchema(input, schemaObject);
		}).toThrow(); // throw a first error if error handler is omitted

		try
		{
			const schemaObject: vs.SchemaObject = {
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
			expect(err.cause).toEqual(vs.CAUSE.MIN_VALUE);
			expect(err.keyStack).toEqual(["id"]);
		}

		try
		{
			const schemaObject: vs.SchemaObject = {
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
			expect(err.cause).toEqual(vs.CAUSE.TYPE);
			expect(err.keyStack).toEqual(["ids", 3]);
		}

		try
		{
			// complex schema
			const schemaObject: vs.SchemaObject = {
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
			expect(err.cause).toEqual(vs.CAUSE.TYPE);
			expect(err.keyStack).toEqual(["infoList", 1, "id"]);
		}
	});
}
