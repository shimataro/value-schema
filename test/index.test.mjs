import adjuster from "index";

{
	describe("adjust", testAdjust);
	describe("error", testError);
}

/**
 * test for adjust multiple variables
 * @returns {void}
 */
function testAdjust()
{
	it("should be adjusted", () =>
	{
		const constraints = {
			id: adjuster.number().minValue(1),
			name: adjuster.string().maxLength(16, true),
			age: adjuster.number().integer(true).minValue(0),
			email: adjuster.email(),
			state: adjuster.string().only("active", "inactive"),
			classes: adjuster.array().separatedBy(",").each(adjuster.number(), true),
			skills: adjuster.array().separatedBy(",").each(adjuster.string(), true),
			credit_card: adjuster.numericString().separatedBy("-").checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.CREDIT_CARD),
			remote_addr: adjuster.ipv4(),
			remote_addr_ipv6: adjuster.ipv6(),
			limit: adjuster.number().integer().default(10).minValue(1, true).maxValue(100, true),
			offset: adjuster.number().integer().default(0).minValue(0, true),
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

		const adjusted = adjuster.adjust(input, constraints);
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
		const constraints = {
			id: adjuster.number().minValue(1),
			name: adjuster.string().maxLength(16, true),
			email: adjuster.email(),
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

		const adjusted = adjuster.adjust(input, constraints, (err) =>
		{
			if(err === null)
			{
				// adjustment finished
				return;
			}

			switch(err.key)
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
			const constraints = {};
			const input = 0;

			adjuster.adjust(input, constraints);
		}).toThrow(adjuster.CAUSE.TYPE); // input must be an object

		expect(() =>
		{
			const constraints = {};
			const input = null;

			adjuster.adjust(input, constraints);
		}).toThrow(adjuster.CAUSE.TYPE); // input must be an object; typeof null === "object"

		expect(() =>
		{
			const constraints = {};
			const input = [];

			adjuster.adjust(input, constraints);
		}).toThrow(adjuster.CAUSE.TYPE); // input must be an object; typeof [] === "object"

		expect(() =>
		{
			const constraints = {
				id: adjuster.number().minValue(1),
				name: adjuster.string().maxLength(16, true),
				email: adjuster.email(),
			};
			const input = {
				id: 0, // error! (>= 1)
				name: "", // error! (empty string is not allowed)
				email: "john@example.com", // OK
			};

			adjuster.adjust(input, constraints, generateErrorHandler());

			/**
			 * error handler generator
			 * @returns {AdjusterBase.OnError} error handler
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

					// append key name
					messages.push(err.key);
				};
			}
		}).toThrow("id,name");

		expect(() =>
		{
			const constraints = {
				id: adjuster.number().minValue(1),
				name: adjuster.string().maxLength(16, true),
				email: adjuster.email(),
			};
			const input = {
				id: 0, // error! (>= 1)
				name: "", // error! (empty string is not allowed)
				email: "john@example.com", // OK
			};

			adjuster.adjust(input, constraints);
		}).toThrow(); // throw a first error if error handler is omitted
	});
}
