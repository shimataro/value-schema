import adjuster from "adjuster"; // eslint-disable-line import/no-unresolved

{
	describe("type", testType);
	describe("default", testDefault);
	describe("acceptNull", testAcceptNull);
	describe("acceptEmptyString", testAcceptEmptyString);
	describe("only", testOnly);
	describe("minValue", testMinValue);
	describe("maxValue", testMaxValue);
	describe("map", testMap);
}

/**
 * type
 * @returns {void}
 */
function testType()
{
	it("should be OK", () =>
	{
		expect(adjuster.number()
			.adjust(0)).toEqual(0);

		expect(adjuster.number()
			.adjust(3.14)).toEqual(3.14);

		expect(adjuster.number().strict()
			.adjust(0)).toEqual(0);

		expect(adjuster.number().strict()
			.adjust(3.14)).toEqual(3.14);
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.number()
			.adjust("123")).toEqual(123);

		expect(adjuster.number()
			.adjust("+456")).toEqual(456);

		expect(adjuster.number()
			.adjust("-789")).toEqual(-789);

		expect(adjuster.number().integer(true)
			.adjust(3.14)).toEqual(3);

		expect(adjuster.number().integer(true)
			.adjust("3.14")).toEqual(3);

		expect(adjuster.number().integer(true)
			.adjust(-3.14)).toEqual(-3);

		expect(adjuster.number().integer(true)
			.adjust("-3.14")).toEqual(-3);

		expect(adjuster.number()
			.adjust(true)).toEqual(1);

		expect(adjuster.number()
			.adjust(false)).toEqual(0);

		expect(adjuster.number().acceptSpecialFormats()
			.adjust("1e+2")).toEqual(100);

		expect(adjuster.number().acceptSpecialFormats()
			.adjust("0x100")).toEqual(256);

		expect(adjuster.number().acceptSpecialFormats()
			.adjust("0o100")).toEqual(64);

		expect(adjuster.number().acceptSpecialFormats()
			.adjust("0b100")).toEqual(4);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.number()
				.adjust("true");
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.number()
				.adjust("false");
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.number().acceptSpecialFormats()
				.adjust("true");
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.number().integer()
				.adjust(3.14);
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.number().integer()
				.adjust("3.14");
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.number().integer()
				.adjust("3.");
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.number()
				.adjust("1e+2");
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.number()
				.adjust("0x100");
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.number()
				.adjust("0o100");
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.number()
				.adjust("0b100");
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.number()
				.adjust([]);
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.number()
				.adjust({});
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.number().strict()
				.adjust("1");
		}).toThrow(adjuster.CAUSE.TYPE);

		expect(() =>
		{
			adjuster.number().strict()
				.adjust(true);
		}).toThrow(adjuster.CAUSE.TYPE);
	});
}

/**
 * default value
 * @returns {void}
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
 * null
 * @returns {void}
 */
function testAcceptNull()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.number().acceptNull(123)
			.adjust(null)).toEqual(123);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.number()
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
	it("should be adjusted", () =>
	{
		expect(adjuster.number().acceptEmptyString(123)
			.adjust("")).toEqual(123);

		expect(adjuster.number().acceptEmptyString()
			.adjust("")).toEqual(null);
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
 * @returns {void}
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
 * @returns {void}
 */
function testMinValue()
{
	it("should be OK", () =>
	{
		expect(adjuster.number()
			.adjust(Number.MIN_SAFE_INTEGER)).toEqual(Number.MIN_SAFE_INTEGER);
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
			adjuster.number()
				.adjust(Number.MIN_SAFE_INTEGER - 1);
		}).toThrow(adjuster.CAUSE.MIN_VALUE);
		expect(() =>
		{
			adjuster.number().minValue(10)
				.adjust(9);
		}).toThrow(adjuster.CAUSE.MIN_VALUE);
	});
}

/**
 * maximum value
 * @returns {void}
 */
function testMaxValue()
{
	it("should be OK", () =>
	{
		expect(adjuster.number()
			.adjust(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);
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
			adjuster.number()
				.adjust(Number.MAX_SAFE_INTEGER + 1);
		}).toThrow(adjuster.CAUSE.MAX_VALUE);
		expect(() =>
		{
			adjuster.number().maxValue(100)
				.adjust(101);
		}).toThrow(adjuster.CAUSE.MAX_VALUE);
	});
}

/**
 * mapping
 * @returns {void}
 */
function testMap()
{
	it("should be incremented", () =>
	{
		expect(adjuster.number().map(mapper)
			.adjust(100)).toEqual(101);

		expect(adjuster.number().map(mapper)
			.adjust("1")).toEqual(2);

		/**
		 * mapping function
		 * @param {number} value value to map
		 * @returns {number} mapped value
		 */
		function mapper(value)
		{
			return value + 1;
		}
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.number().map(mapper)
				.adjust(100);
		}).toThrow(adjuster.CAUSE.MAP);

		/**
		 * mapping function
		 * @param {number} value value to map
		 * @param {Function} fail callback on fail
		 * @returns {number} mapped value
		 */
		function mapper(value, fail)
		{
			fail();
		}
	});
}
