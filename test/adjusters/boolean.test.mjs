import adjuster from "index";

{
	describe("type", testType);
	describe("default", testDefault);
	describe("acceptNull", testAcceptNull);
	describe("acceptEmptyString", testAcceptEmptyString);
}

/**
 * type
 * @return {void}
 */
function testType()
{
	it("should be OK", () =>
	{
		expect(adjuster.boolean()
			.adjust(true)).toEqual(true);
		expect(adjuster.boolean()
			.adjust(false)).toEqual(false);

		expect(adjuster.boolean().strict()
			.adjust(true)).toEqual(true);
		expect(adjuster.boolean().strict()
			.adjust(false)).toEqual(false);
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.boolean()
			.adjust(1)).toEqual(true);
		expect(adjuster.boolean()
			.adjust(-1)).toEqual(true);
		expect(adjuster.boolean()
			.adjust(0)).toEqual(false);

		expect(adjuster.boolean()
			.adjust("1")).toEqual(true);
		expect(adjuster.boolean()
			.adjust("-1")).toEqual(true);

		// "0" is truthy in JavaScript, but node-adjuster adjusts it to false!
		expect(adjuster.boolean()
			.adjust("0")).toEqual(false);

		// "true" is true, "false" is false!
		expect(adjuster.boolean()
			.adjust("true")).toEqual(true);
		expect(adjuster.boolean()
			.adjust("TRUE")).toEqual(true);
		expect(adjuster.boolean()
			.adjust(" \ttrue\r\n")).toEqual(true);
		expect(adjuster.boolean()
			.adjust("false")).toEqual(false);
		expect(adjuster.boolean()
			.adjust("FALSE")).toEqual(false);
		expect(adjuster.boolean()
			.adjust(" \rfalse\r\n")).toEqual(false);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.boolean()
				.adjust("abc");
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.boolean()
				.adjust({});
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.boolean()
				.adjust([]);
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.boolean().strict()
				.adjust(0);
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.boolean().strict()
				.adjust("0");
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.boolean().strict()
				.adjust("true");
		}).toThrow(adjuster.CAUSE.TYPE);
	});
}

/**
 * default value
 * @return {void}
 */
function testDefault()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.boolean().default(true)
			.adjust(undefined)).toEqual(true);

		expect(adjuster.boolean().default(true).strict()
			.adjust(undefined)).toEqual(true);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.boolean()
				.adjust(undefined);
		}).toThrow(adjuster.CAUSE.REQUIRED);
	});
}

/**
 * null
 * @return {void}
 */
function testAcceptNull()
{
	it("should be OK", () =>
	{
		expect(adjuster.boolean().acceptNull(false)
			.adjust(null)).toEqual(false);

		expect(adjuster.boolean().acceptNull(false).strict()
			.adjust(null)).toEqual(false);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.boolean()
				.adjust(null);
		}).toThrow(adjuster.CAUSE.NULL);
	});
}

/**
 * empty string
 * @return {void}
 */
function testAcceptEmptyString()
{
	it("should be OK", () =>
	{
		expect(adjuster.boolean().acceptEmptyString(false)
			.adjust("")).toEqual(false);

		expect(adjuster.boolean().acceptEmptyString(false).strict()
			.adjust("")).toEqual(false);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.boolean()
				.adjust("");
		}).toThrow(adjuster.CAUSE.EMPTY);
	});
}
