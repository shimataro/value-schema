import vs from "value-schema";

{
	describe("type", testType);
}

/**
 * type
 */
function testType(): void
{
	it("should be OK", () =>
	{
		const schema = vs.union<number | string>(vs.number(), vs.string());
		expect(schema.applyTo(1)).toEqual(1);
		expect(schema.applyTo("a")).toEqual("a");
	});
	it("should be adjusted", () =>
	{
		const schema = vs.union<number | string>(vs.number(), vs.string());
		expect(schema.applyTo("1")).toEqual(1);
	});
	it("should cause error(s)", () =>
	{
		const schema = vs.union<number | string>(vs.number(), vs.string());
		expect(() =>
		{
			schema.applyTo({});
		}).toThrow(vs.CAUSE.TYPE);
	});
}
