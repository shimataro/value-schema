import adjuster from "index"; // eslint-disable-line import/no-unresolved

{
	describe("type", testType);
	describe("default", testDefault);
	describe("acceptNull", testAcceptNull);
	describe("acceptEmptyString", testAcceptEmptyString);
}

/**
 * type
 * @returns {void}
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
			.adjust(0)).toEqual(false);

		expect(adjuster.boolean()
			.adjust("1")).toEqual(true);
		expect(adjuster.boolean()
			.adjust("0")).toEqual(false); // "0" is truthy in JavaScript, but node-adjuster adjusts it to false!

		expect(adjuster.boolean().acceptAllNumbers()
			.adjust(1)).toEqual(true);
		expect(adjuster.boolean().acceptAllNumbers()
			.adjust(0)).toEqual(false);
		expect(adjuster.boolean().acceptAllNumbers()
			.adjust(-1)).toEqual(true);
		expect(adjuster.boolean().acceptAllNumbers()
			.adjust("1")).toEqual(true);
		expect(adjuster.boolean().acceptAllNumbers()
			.adjust("0")).toEqual(false);
		expect(adjuster.boolean().acceptAllNumbers()
			.adjust("-1")).toEqual(true);

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

		// "yes" is true, "no" is false!
		expect(adjuster.boolean()
			.adjust("yes")).toEqual(true);
		expect(adjuster.boolean()
			.adjust("YES")).toEqual(true);
		expect(adjuster.boolean()
			.adjust("no")).toEqual(false);
		expect(adjuster.boolean()
			.adjust("NO")).toEqual(false);

		// "on" is true, "off" is false!
		expect(adjuster.boolean()
			.adjust("on")).toEqual(true);
		expect(adjuster.boolean()
			.adjust("ON")).toEqual(true);
		expect(adjuster.boolean()
			.adjust("off")).toEqual(false);
		expect(adjuster.boolean()
			.adjust("OFF")).toEqual(false);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.boolean()
				.adjust(-1);
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.boolean()
				.adjust("-1");
		}).toThrow(adjuster.CAUSE.TYPE);

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
 * @returns {void}
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
 * @returns {void}
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
 * @returns {void}
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
