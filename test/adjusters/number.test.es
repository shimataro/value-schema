import adjuster from "index";

{
	describe("type", testType);
	describe("default", testDefault);
	describe("allowEmptyString", testAllowEmptyString);
	describe("only", testOnly);
	describe("minValue", testMinValue);
	describe("maxValue", testMaxValue);
}

/**
 * type
 */
function testType()
{
	it("should be OK", () =>
	{
		expect(adjuster.number()
			.adjust(0)).toEqual(0);

		expect(adjuster.number()
			.adjust(1)).toEqual(1);
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.number()
			.adjust("123")).toEqual(123);

		expect(adjuster.number()
			.adjust("+456")).toEqual(456);

		expect(adjuster.number()
			.adjust("-789")).toEqual(-789);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.number()
				.adjust("abc");
		}).toThrow(adjuster.CAUSE.TYPE);
	});
}

/**
 * default value
 */
function testDefault()
{
	it("should be OK", () =>
	{
		expect(adjuster.number().default(10)
			.adjust(1)).toEqual(1);
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.number().default(10)
			.adjust(undefined)).toEqual(10);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.number()
				.adjust(undefined);
		}).toThrow(adjuster.CAUSE.REQUIRED);
	});
}

/**
 * empty string
 */
function testAllowEmptyString()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.number().allowEmptyString(123)
			.adjust("")).toEqual(123);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.number()
				.adjust("");
		}).toThrow(adjuster.CAUSE.EMPTY);
	});
}

/**
 * set
 */
function testOnly()
{
	it("should be OK", () =>
	{
		expect(adjuster.number().only(1, 3, 5)
			.adjust(1)).toEqual(1);

		expect(adjuster.number().only(1, 3, 5)
			.adjust(3)).toEqual(3);

		expect(adjuster.number().only(1, 3, 5)
			.adjust(5)).toEqual(5);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.number().only(1, 3, 5)
				.adjust(2);
		}).toThrow(adjuster.CAUSE.ONLY);
	});
}

/**
 * minimum value
 */
function testMinValue()
{
	it("should be OK", () =>
	{
		expect(adjuster.number().minValue(10)
			.adjust(10)).toEqual(10);
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.number().minValue(10, true)
			.adjust(9)).toEqual(10);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.number().minValue(10)
				.adjust(9);
		}).toThrow(adjuster.CAUSE.MIN_VALUE);
	});
}

/**
 * maximum value
 */
function testMaxValue()
{
	it("should be OK", () =>
	{
		expect(adjuster.number().maxValue(100)
			.adjust(100)).toEqual(100);
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.number().maxValue(100, true)
			.adjust(101)).toEqual(100);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.number().maxValue(100)
				.adjust(101);
		}).toThrow(adjuster.CAUSE.MAX_VALUE);
	});
}
