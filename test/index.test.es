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
			limit: "0",
		};
		const adjusters = {
			id: adjuster.number().minValue(1),
			name: adjuster.string().maxLength(16, true),
			email: adjuster.email(),
			state: adjuster.string().in("active", "inactive"),
			limit: adjuster.number().default(10).minValue(1, true).maxValue(100, true),
			offset: adjuster.number().default(0).minValue(0, true),
		};
		const expected = {
			id: 1,
			name: "Pablo Diego José",
			email: "picasso@example.com",
			state: "active",
			limit: 1,
			offset: 0,
		};

		const adjusted = adjuster.adjustData(inputData, adjusters);
		expect(adjusted).toEqual(expected);
	});
}
