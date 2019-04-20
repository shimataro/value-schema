import vs from "value-schema"; // eslint-disable-line import/no-unresolved

{
	describe("type", testType);
	describe("default", testDefault);
	describe("acceptNull", testAcceptNull);
	describe("acceptEmptyString", testAcceptEmptyString);
	describe("only", testOnly);
	describe("minValue", testMinValue);
	describe("maxValue", testMaxValue);
	describe("convert", testConvert);
}

/**
 * type
 * @returns {void}
 */
function testType()
{
	it("should be OK", () =>
	{
		expect(vs.number()
			.fit(0)).toEqual(0);

		expect(vs.number()
			.fit(3.14)).toEqual(3.14);

		expect(vs.number().strict()
			.fit(0)).toEqual(0);

		expect(vs.number().strict()
			.fit(3.14)).toEqual(3.14);
	});
	it("should be fitted", () =>
	{
		expect(vs.number()
			.fit("123")).toEqual(123);

		expect(vs.number()
			.fit("+456")).toEqual(456);

		expect(vs.number()
			.fit("-789")).toEqual(-789);

		expect(vs.number().integer(true)
			.fit(3.14)).toEqual(3);

		expect(vs.number().integer(true)
			.fit("3.14")).toEqual(3);

		expect(vs.number().integer(true)
			.fit(-3.14)).toEqual(-3);

		expect(vs.number().integer(true)
			.fit("-3.14")).toEqual(-3);

		expect(vs.number()
			.fit(true)).toEqual(1);

		expect(vs.number()
			.fit(false)).toEqual(0);

		expect(vs.number().acceptSpecialFormats()
			.fit("1e+2")).toEqual(100);

		expect(vs.number().acceptSpecialFormats()
			.fit("0x100")).toEqual(256);

		expect(vs.number().acceptSpecialFormats()
			.fit("0o100")).toEqual(64);

		expect(vs.number().acceptSpecialFormats()
			.fit("0b100")).toEqual(4);

		expect(vs.number().acceptFullWidth()
			.fit("＋１２３４．５")).toEqual(1234.5);

		expect(vs.number().acceptFullWidth()
			.fit("－1２3４．5")).toEqual(-1234.5);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.number()
				.fit("true");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number()
				.fit("false");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number().acceptSpecialFormats()
				.fit("true");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number().integer()
				.fit(3.14);
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number().integer()
				.fit("3.14");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number().integer()
				.fit("3.");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number()
				.fit("1e+2");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number()
				.fit("0x100");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number()
				.fit("0o100");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number()
				.fit("0b100");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number()
				.fit("１２３４．５");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number()
				.fit([]);
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number()
				.fit({});
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number().strict()
				.fit("1");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number().strict()
				.fit(true);
		}).toThrow(vs.CAUSE.TYPE);
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
		expect(vs.number().default(10)
			.fit(1)).toEqual(1);
	});
	it("should be fitted", () =>
	{
		expect(vs.number().default(10)
			.fit(undefined)).toEqual(10);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.number()
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
	it("should be fitted", () =>
	{
		expect(vs.number().acceptNull(123)
			.fit(null)).toEqual(123);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.number()
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
	it("should be fitted", () =>
	{
		expect(vs.number().acceptEmptyString(123)
			.fit("")).toEqual(123);

		expect(vs.number().acceptEmptyString()
			.fit("")).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.number()
				.fit("");
		}).toThrow(vs.CAUSE.EMPTY);
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
		expect(vs.number().only(1, 3, 5)
			.fit(1)).toEqual(1);

		expect(vs.number().only(1, 3, 5)
			.fit(3)).toEqual(3);

		expect(vs.number().only(1, 3, 5)
			.fit(5)).toEqual(5);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.number().only(1, 3, 5)
				.fit(2);
		}).toThrow(vs.CAUSE.ONLY);
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
		expect(vs.number()
			.fit(Number.MIN_SAFE_INTEGER)).toEqual(Number.MIN_SAFE_INTEGER);
		expect(vs.number().minValue(10)
			.fit(10)).toEqual(10);
	});
	it("should be fitted", () =>
	{
		expect(vs.number().minValue(10, true)
			.fit(9)).toEqual(10);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.number()
				.fit(Number.MIN_SAFE_INTEGER - 1);
		}).toThrow(vs.CAUSE.MIN_VALUE);
		expect(() =>
		{
			vs.number().minValue(10)
				.fit(9);
		}).toThrow(vs.CAUSE.MIN_VALUE);
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
		expect(vs.number()
			.fit(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);
		expect(vs.number().maxValue(100)
			.fit(100)).toEqual(100);
	});
	it("should be fitted", () =>
	{
		expect(vs.number().maxValue(100, true)
			.fit(101)).toEqual(100);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.number()
				.fit(Number.MAX_SAFE_INTEGER + 1);
		}).toThrow(vs.CAUSE.MAX_VALUE);
		expect(() =>
		{
			vs.number().maxValue(100)
				.fit(101);
		}).toThrow(vs.CAUSE.MAX_VALUE);
	});
}

/**
 * conversion
 * @returns {void}
 */
function testConvert()
{
	it("should be incremented", () =>
	{
		expect(vs.number().convert(converter)
			.fit(100)).toEqual(101);

		expect(vs.number().convert(converter)
			.fit("1")).toEqual(2);

		/**
		 * conversion function
		 * @param {number} value value to convert
		 * @returns {number} converted value
		 */
		function converter(value)
		{
			return value + 1;
		}
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.number().convert(converter)
				.fit(100);
		}).toThrow(vs.CAUSE.CONVERT);

		/**
		 * conversion function
		 * @param {number} value value to convert
		 * @param {Function} fail callback on fail
		 * @returns {number} converted value
		 */
		function converter(value, fail)
		{
			fail();
		}
	});
}
