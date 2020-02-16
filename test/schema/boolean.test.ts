import vs from "value-schema";

{
	describe("type", testType);
	describe("ifUndefined", testIfUndefined);
	describe("ifNull", testIfNull);
	describe("ifEmptyString", testIfEmptyString);
}

/**
 * type
 */
function testType(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.boolean().applyTo(true)
		).toEqual(true);
		expect(
			vs.boolean().applyTo(false)
		).toEqual(false);

		expect(
			vs.boolean({
				strictType: true,
			}).applyTo(true)
		).toEqual(true);
		expect(
			vs.boolean({
				strictType: true,
			}).applyTo(false)
		).toEqual(false);
	});
	it("should be adjusted", () =>
	{
		expect(
			vs.boolean().applyTo(1)
		).toEqual(true);
		expect(
			vs.boolean().applyTo(0)
		).toEqual(false);

		expect(
			vs.boolean().applyTo("1")
		).toEqual(true);
		expect(
			vs.boolean().applyTo("0")
		).toEqual(false); // "0" is truthy in JavaScript, but value-schema converts that to false!

		expect(
			vs.boolean({
				acceptsAllNumbers: true,
			}).applyTo(1)
		).toEqual(true);
		expect(
			vs.boolean({
				acceptsAllNumbers: true,
			}).applyTo(0)
		).toEqual(false);
		expect(
			vs.boolean({
				acceptsAllNumbers: true,
			}).applyTo(-1)
		).toEqual(true);
		expect(
			vs.boolean({
				acceptsAllNumbers: true,
			}).applyTo("1")
		).toEqual(true);
		expect(
			vs.boolean({
				acceptsAllNumbers: true,
			}).applyTo("0")
		).toEqual(false);
		expect(
			vs.boolean({
				acceptsAllNumbers: true,
			}).applyTo("-1")
		).toEqual(true);

		// "true" is true, "false" is false!
		expect(
			vs.boolean().applyTo("true")
		).toEqual(true);
		expect(
			vs.boolean().applyTo("TRUE")
		).toEqual(true);
		expect(
			vs.boolean().applyTo(" \ttrue\r\n")
		).toEqual(true);
		expect(
			vs.boolean().applyTo("false")
		).toEqual(false);
		expect(
			vs.boolean().applyTo("FALSE")
		).toEqual(false);
		expect(
			vs.boolean().applyTo(" \rfalse\r\n")
		).toEqual(false);

		// "yes" is true, "no" is false!
		expect(
			vs.boolean().applyTo("yes")
		).toEqual(true);
		expect(
			vs.boolean().applyTo("YES")
		).toEqual(true);
		expect(
			vs.boolean().applyTo("no")
		).toEqual(false);
		expect(
			vs.boolean().applyTo("NO")
		).toEqual(false);

		// "on" is true, "off" is false!
		expect(
			vs.boolean().applyTo("on")
		).toEqual(true);
		expect(
			vs.boolean().applyTo("ON")
		).toEqual(true);
		expect(
			vs.boolean().applyTo("off")
		).toEqual(false);
		expect(
			vs.boolean().applyTo("OFF")
		).toEqual(false);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.boolean().applyTo(-1);
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.boolean().applyTo("-1");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.boolean().applyTo("abc");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.boolean().applyTo({});
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.boolean().applyTo([]);
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.boolean({
				strictType: true,
			}).applyTo(0);
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.boolean({
				strictType: true,
			}).applyTo("0");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.boolean({
				strictType: true,
			}).applyTo("true");
		}).toThrow(vs.CAUSE.TYPE);
	});
}

/**
 * if undefined
 */
function testIfUndefined(): void
{
	it("should be adjusted", () =>
	{
		expect(
			vs.boolean({
				ifUndefined: true,
			}).applyTo(undefined)
		).toEqual(true);

		expect(
			vs.boolean({
				ifUndefined: true,
				strictType: true,
			}).applyTo(undefined)
		).toEqual(true);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.boolean().applyTo(undefined);
		}).toThrow(vs.CAUSE.UNDEFINED);
	});
}

/**
 * if null
 */
function testIfNull(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.boolean({
				ifNull: false,
			}).applyTo(null)
		).toEqual(false);

		expect(
			vs.boolean({
				ifNull: false,
				strictType: true,
			}).applyTo(null)
		).toEqual(false);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.boolean().applyTo(null);
		}).toThrow(vs.CAUSE.NULL);
	});
}

/**
 * if empty string
 */
function testIfEmptyString(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.boolean({
				ifEmptyString: false,
			}).applyTo("")
		).toEqual(false);

		expect(
			vs.boolean({
				ifEmptyString: false,
				strictType: true,
			}).applyTo("")
		).toEqual(false);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.boolean().applyTo("");
		}).toThrow(vs.CAUSE.EMPTY_STRING);
	});
}
