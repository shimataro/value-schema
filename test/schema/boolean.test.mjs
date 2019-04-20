import valueSchema from "value-schema"; // eslint-disable-line import/no-unresolved

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
		expect(valueSchema.boolean()
			.fit(true)).toEqual(true);
		expect(valueSchema.boolean()
			.fit(false)).toEqual(false);

		expect(valueSchema.boolean().strict()
			.fit(true)).toEqual(true);
		expect(valueSchema.boolean().strict()
			.fit(false)).toEqual(false);
	});
	it("should be adjusted", () =>
	{
		expect(valueSchema.boolean()
			.fit(1)).toEqual(true);
		expect(valueSchema.boolean()
			.fit(0)).toEqual(false);

		expect(valueSchema.boolean()
			.fit("1")).toEqual(true);
		expect(valueSchema.boolean()
			.fit("0")).toEqual(false); // "0" is truthy in JavaScript, but value-schema adjusts it to false!

		expect(valueSchema.boolean().acceptAllNumbers()
			.fit(1)).toEqual(true);
		expect(valueSchema.boolean().acceptAllNumbers()
			.fit(0)).toEqual(false);
		expect(valueSchema.boolean().acceptAllNumbers()
			.fit(-1)).toEqual(true);
		expect(valueSchema.boolean().acceptAllNumbers()
			.fit("1")).toEqual(true);
		expect(valueSchema.boolean().acceptAllNumbers()
			.fit("0")).toEqual(false);
		expect(valueSchema.boolean().acceptAllNumbers()
			.fit("-1")).toEqual(true);

		// "true" is true, "false" is false!
		expect(valueSchema.boolean()
			.fit("true")).toEqual(true);
		expect(valueSchema.boolean()
			.fit("TRUE")).toEqual(true);
		expect(valueSchema.boolean()
			.fit(" \ttrue\r\n")).toEqual(true);
		expect(valueSchema.boolean()
			.fit("false")).toEqual(false);
		expect(valueSchema.boolean()
			.fit("FALSE")).toEqual(false);
		expect(valueSchema.boolean()
			.fit(" \rfalse\r\n")).toEqual(false);

		// "yes" is true, "no" is false!
		expect(valueSchema.boolean()
			.fit("yes")).toEqual(true);
		expect(valueSchema.boolean()
			.fit("YES")).toEqual(true);
		expect(valueSchema.boolean()
			.fit("no")).toEqual(false);
		expect(valueSchema.boolean()
			.fit("NO")).toEqual(false);

		// "on" is true, "off" is false!
		expect(valueSchema.boolean()
			.fit("on")).toEqual(true);
		expect(valueSchema.boolean()
			.fit("ON")).toEqual(true);
		expect(valueSchema.boolean()
			.fit("off")).toEqual(false);
		expect(valueSchema.boolean()
			.fit("OFF")).toEqual(false);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.boolean()
				.fit(-1);
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.boolean()
				.fit("-1");
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.boolean()
				.fit("abc");
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.boolean()
				.fit({});
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.boolean()
				.fit([]);
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.boolean().strict()
				.fit(0);
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.boolean().strict()
				.fit("0");
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.boolean().strict()
				.fit("true");
		}).toThrow(valueSchema.CAUSE.TYPE);
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
		expect(valueSchema.boolean().default(true)
			.fit(undefined)).toEqual(true);

		expect(valueSchema.boolean().default(true).strict()
			.fit(undefined)).toEqual(true);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.boolean()
				.fit(undefined);
		}).toThrow(valueSchema.CAUSE.REQUIRED);
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
		expect(valueSchema.boolean().acceptNull(false)
			.fit(null)).toEqual(false);

		expect(valueSchema.boolean().acceptNull(false).strict()
			.fit(null)).toEqual(false);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.boolean()
				.fit(null);
		}).toThrow(valueSchema.CAUSE.NULL);
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
		expect(valueSchema.boolean().acceptEmptyString(false)
			.fit("")).toEqual(false);

		expect(valueSchema.boolean().acceptEmptyString(false).strict()
			.fit("")).toEqual(false);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.boolean()
				.fit("");
		}).toThrow(valueSchema.CAUSE.EMPTY);
	});
}
