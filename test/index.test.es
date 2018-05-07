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
		const inputData = {
			id: "1",
			name: "Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Ciprin Cipriano de la Santísima Trinidad Ruiz y Picasso",
			email: "picasso@example.com",
			state: "active",
			classes: "1,3,abc,4",
			skills: "c,c++,javascript,python,,swift,kotlin",
			remote_addr: "127.0.0.1",
			remote_addr_ipv6: "::1",
			limit: "0",
		};
		const adjusters = {
			id: adjuster.number().minValue(1),
			name: adjuster.string().maxLength(16, true),
			email: adjuster.email(),
			state: adjuster.string().in("active", "inactive"),
			classes: adjuster.numberArray().separatedBy(",").ignoreEachErrors(),
			skills: adjuster.stringArray().separatedBy(",").ignoreEachErrors(),
			remote_addr: adjuster.ipv4(),
			remote_addr_ipv6: adjuster.ipv6(),
			limit: adjuster.number().default(10).minValue(1, true).maxValue(100, true),
			offset: adjuster.number().default(0).minValue(0, true),
		};
		const expected = {
			id: 1,
			name: "Pablo Diego José",
			email: "picasso@example.com",
			state: "active",
			classes: [1, 3, 4],
			skills: ["c", "c++", "javascript", "python", "swift", "kotlin"],
			remote_addr: "127.0.0.1",
			remote_addr_ipv6: "::1",
			limit: 1,
			offset: 0,
		};

		const adjusted = adjuster.adjustData(inputData, adjusters);
		expect(adjusted).toEqual(expected);
	});
}
