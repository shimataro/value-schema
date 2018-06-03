import adjuster from "index";

{
	describe("adjust", testAdjust);
	describe("error", testError);
}

/**
 * test for adjust multiple variables
 */
function testAdjust()
{
	it("should be adjusted", () =>
	{
		const constraints = {
			id: adjuster.number().minValue(1),
			name: adjuster.string().maxLength(16, true),
			email: adjuster.email(),
			state: adjuster.string().only("active", "inactive"),
			classes: adjuster.numberArray().separatedBy(",").ignoreEachErrors(),
			skills: adjuster.stringArray().separatedBy(",").ignoreEachErrors(),
			credit_card: adjuster.numericString().separatedBy("-").checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.CREDIT_CARD),
			remote_addr: adjuster.ipv4(),
			remote_addr_ipv6: adjuster.ipv6(),
			limit: adjuster.number().default(10).minValue(1, true).maxValue(100, true),
			offset: adjuster.number().default(0).minValue(0, true),
		};
		const input = {
			id: "1",
			name: "Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Ciprin Cipriano de la Santísima Trinidad Ruiz y Picasso",
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
			switch(err.key)
			{
			case "id":
				return 100;
			default:
				return undefined;
			}
		});
		expect(adjusted).toEqual(expected);
	});
}
