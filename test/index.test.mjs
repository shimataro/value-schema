import valueSchema from "value-schema"; // eslint-disable-line import/no-unresolved

{
	describe("fit", testFit);
	describe("error", testError);
}

/**
 * test fit()
 * @returns {void}
 */
function testFit()
{
	it("should be adjusted", () =>
	{
		const schemaObject = {
			id: valueSchema.number().minValue(1),
			name: valueSchema.string().maxLength(16, true),
			age: valueSchema.number().integer(true).minValue(0),
			email: valueSchema.email(),
			state: valueSchema.string().only("active", "inactive"),
			classes: valueSchema.array().separatedBy(",").each(valueSchema.number(), true),
			skills: valueSchema.array().separatedBy(",").each(valueSchema.string(), true),
			credit_card: valueSchema.numericString().separatedBy("-").checksum(valueSchema.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD),
			remote_addr: valueSchema.string().pattern(valueSchema.STRING.PATTERN.IPV4),
			remote_addr_ipv6: valueSchema.string().pattern(valueSchema.STRING.PATTERN.IPV6),
			limit: valueSchema.number().integer().default(10).minValue(1, true).maxValue(100, true),
			offset: valueSchema.number().integer().default(0).minValue(0, true),
		};
		const input = {
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
		const expected = {
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

		const adjusted = valueSchema.fit(input, schemaObject);
		expect(adjusted).toEqual(expected);
	});
}

/**
 * error handling
 * @returns {void}
 */
function testError()
{
	it("should be adjusted", () =>
	{
		const schemaObject = {
			id: valueSchema.number().minValue(1),
			name: valueSchema.string().maxLength(16, true),
			email: valueSchema.email(),
		};
		const input = {
			id: 0, // error! (>= 1)
			name: "", // error! (empty string is not allowed)
			email: "john@example.com", // OK
		};
		const expected = {
			id: 100,
			email: "john@example.com",
		};

		const adjusted = valueSchema.fit(input, schemaObject, (err) =>
		{
			if(err === null)
			{
				// adjustment finished
				return;
			}

			switch(err.keyStack.shift())
			{
			case "id":
				return 100;
			}
		});
		expect(adjusted).toEqual(expected);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			const schemaObject = {};
			const input = 0;

			valueSchema.fit(input, schemaObject);
		}).toThrow(valueSchema.CAUSE.TYPE); // input must be an object

		expect(() =>
		{
			const schemaObject = {};
			const input = null;

			valueSchema.fit(input, schemaObject);
		}).toThrow(valueSchema.CAUSE.TYPE); // input must be an object; typeof null === "object"

		expect(() =>
		{
			const schemaObject = {};
			const input = [];

			valueSchema.fit(input, schemaObject);
		}).toThrow(valueSchema.CAUSE.TYPE); // input must be an object; typeof [] === "object"

		expect(() =>
		{
			const schemaObject = {
				id: valueSchema.number().minValue(1),
				name: valueSchema.string().maxLength(16, true),
				email: valueSchema.email(),
			};
			const input = {
				id: 0, // error! (>= 1)
				name: "", // error! (empty string is not allowed)
				email: "john@example.com", // OK
			};

			valueSchema.fit(input, schemaObject, generateErrorHandler());

			/**
			 * error handler generator
			 * @returns {ErrorHandler} error handler
			 */
			function generateErrorHandler()
			{
				const messages = [];
				return (err) =>
				{
					if(err === null)
					{
						// adjustment finished; join key name as message
						throw new Error(messages.join(","));
					}

					if(err.keyStack.length === 0)
					{
						return;
					}
					// append key name
					messages.push(err.keyStack[0]);
				};
			}
		}).toThrow("id,name");

		expect(() =>
		{
			const schemaObject = {
				id: valueSchema.number().minValue(1),
				name: valueSchema.string().maxLength(16, true),
				email: valueSchema.email(),
			};
			const input = {
				id: 0, // error! (>= 1)
				name: "", // error! (empty string is not allowed)
				email: "john@example.com", // OK
			};

			valueSchema.fit(input, schemaObject);
		}).toThrow(); // throw a first error if error handler is omitted

		try
		{
			const schemaObject = {
				id: valueSchema.number().minValue(1),
				name: valueSchema.string().maxLength(4, true),
			};
			const input = {
				id: "0",
				name: "John Doe",
				dummy: true,
			};
			valueSchema.object().schema(schemaObject)
				.fit(input);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(valueSchema.CAUSE.MIN_VALUE);
			expect(err.keyStack).toEqual(["id"]);
		}

		try
		{
			const schemaObject = {
				ids: valueSchema.array().each(valueSchema.number().minValue(1)),
			};
			const input = {
				ids: [true, "2", "+3", "four", 5],
			};
			valueSchema.object().schema(schemaObject)
				.fit(input);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(valueSchema.CAUSE.TYPE);
			expect(err.keyStack).toEqual(["ids", 3]);
		}

		try
		{
			// complex schema
			const schemaObject = {
				infoList: valueSchema.array().each(valueSchema.object().schema({
					id: valueSchema.number(),
					name: valueSchema.string().maxLength(8),
				})),
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
			valueSchema.object().schema(schemaObject)
				.fit(input);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(valueSchema.CAUSE.TYPE);
			expect(err.keyStack).toEqual(["infoList", 1, "id"]);
		}
	});
}
