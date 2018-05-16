import adjuster from "index";

{
	describe("data", testData);
}

/**
 * test for adjust multiple variables
 */
function testData()
{
	it("should be adjusted", () =>
	{
		const adjusters = {
			id: adjuster.number().minValue(1),
			name: adjuster.string().maxLength(16, true),
			email: adjuster.email(),
			state: adjuster.string().in("active", "inactive"),
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

		const adjusted = adjuster.adjust(input, adjusters);
		expect(adjusted).toEqual(expected);
	});
}
