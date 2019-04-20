import vs from "value-schema"; // eslint-disable-line import/no-unresolved

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
		expect(vs.boolean()
			.fit(true)).toEqual(true);
		expect(vs.boolean()
			.fit(false)).toEqual(false);

		expect(vs.boolean().strict()
			.fit(true)).toEqual(true);
		expect(vs.boolean().strict()
			.fit(false)).toEqual(false);
	});
	it("should be fitted", () =>
	{
		expect(vs.boolean()
			.fit(1)).toEqual(true);
		expect(vs.boolean()
			.fit(0)).toEqual(false);

		expect(vs.boolean()
			.fit("1")).toEqual(true);
		expect(vs.boolean()
			.fit("0")).toEqual(false); // "0" is truthy in JavaScript, but value-schema adjusts it to false!

		expect(vs.boolean().acceptAllNumbers()
			.fit(1)).toEqual(true);
		expect(vs.boolean().acceptAllNumbers()
			.fit(0)).toEqual(false);
		expect(vs.boolean().acceptAllNumbers()
			.fit(-1)).toEqual(true);
		expect(vs.boolean().acceptAllNumbers()
			.fit("1")).toEqual(true);
		expect(vs.boolean().acceptAllNumbers()
			.fit("0")).toEqual(false);
		expect(vs.boolean().acceptAllNumbers()
			.fit("-1")).toEqual(true);

		// "true" is true, "false" is false!
		expect(vs.boolean()
			.fit("true")).toEqual(true);
		expect(vs.boolean()
			.fit("TRUE")).toEqual(true);
		expect(vs.boolean()
			.fit(" \ttrue\r\n")).toEqual(true);
		expect(vs.boolean()
			.fit("false")).toEqual(false);
		expect(vs.boolean()
			.fit("FALSE")).toEqual(false);
		expect(vs.boolean()
			.fit(" \rfalse\r\n")).toEqual(false);

		// "yes" is true, "no" is false!
		expect(vs.boolean()
			.fit("yes")).toEqual(true);
		expect(vs.boolean()
			.fit("YES")).toEqual(true);
		expect(vs.boolean()
			.fit("no")).toEqual(false);
		expect(vs.boolean()
			.fit("NO")).toEqual(false);

		// "on" is true, "off" is false!
		expect(vs.boolean()
			.fit("on")).toEqual(true);
		expect(vs.boolean()
			.fit("ON")).toEqual(true);
		expect(vs.boolean()
			.fit("off")).toEqual(false);
		expect(vs.boolean()
			.fit("OFF")).toEqual(false);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.boolean()
				.fit(-1);
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.boolean()
				.fit("-1");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.boolean()
				.fit("abc");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.boolean()
				.fit({});
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.boolean()
				.fit([]);
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.boolean().strict()
				.fit(0);
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.boolean().strict()
				.fit("0");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.boolean().strict()
				.fit("true");
		}).toThrow(vs.CAUSE.TYPE);
	});
}

/**
 * default value
 * @returns {void}
 */
function testDefault()
{
	it("should be fitted", () =>
	{
		expect(vs.boolean().default(true)
			.fit(undefined)).toEqual(true);

		expect(vs.boolean().default(true).strict()
			.fit(undefined)).toEqual(true);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.boolean()
				.fit(undefined);
		}).toThrow(vs.CAUSE.REQUIRED);
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
		expect(vs.boolean().acceptNull(false)
			.fit(null)).toEqual(false);

		expect(vs.boolean().acceptNull(false).strict()
			.fit(null)).toEqual(false);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.boolean()
				.fit(null);
		}).toThrow(vs.CAUSE.NULL);
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
		expect(vs.boolean().acceptEmptyString(false)
			.fit("")).toEqual(false);

		expect(vs.boolean().acceptEmptyString(false).strict()
			.fit("")).toEqual(false);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.boolean()
				.fit("");
		}).toThrow(vs.CAUSE.EMPTY);
	});
}
