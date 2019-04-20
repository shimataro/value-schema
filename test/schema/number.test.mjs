import valueSchema from "value-schema"; // eslint-disable-line import/no-unresolved

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
		expect(valueSchema.number()
			.fit(0)).toEqual(0);

		expect(valueSchema.number()
			.fit(3.14)).toEqual(3.14);

		expect(valueSchema.number().strict()
			.fit(0)).toEqual(0);

		expect(valueSchema.number().strict()
			.fit(3.14)).toEqual(3.14);
	});
	it("should be adjusted", () =>
	{
		expect(valueSchema.number()
			.fit("123")).toEqual(123);

		expect(valueSchema.number()
			.fit("+456")).toEqual(456);

		expect(valueSchema.number()
			.fit("-789")).toEqual(-789);

		expect(valueSchema.number().integer(true)
			.fit(3.14)).toEqual(3);

		expect(valueSchema.number().integer(true)
			.fit("3.14")).toEqual(3);

		expect(valueSchema.number().integer(true)
			.fit(-3.14)).toEqual(-3);

		expect(valueSchema.number().integer(true)
			.fit("-3.14")).toEqual(-3);

		expect(valueSchema.number()
			.fit(true)).toEqual(1);

		expect(valueSchema.number()
			.fit(false)).toEqual(0);

		expect(valueSchema.number().acceptSpecialFormats()
			.fit("1e+2")).toEqual(100);

		expect(valueSchema.number().acceptSpecialFormats()
			.fit("0x100")).toEqual(256);

		expect(valueSchema.number().acceptSpecialFormats()
			.fit("0o100")).toEqual(64);

		expect(valueSchema.number().acceptSpecialFormats()
			.fit("0b100")).toEqual(4);

		expect(valueSchema.number().acceptFullWidth()
			.fit("＋１２３４．５")).toEqual(1234.5);

		expect(valueSchema.number().acceptFullWidth()
			.fit("－1２3４．5")).toEqual(-1234.5);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.number()
				.fit("true");
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.number()
				.fit("false");
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.number().acceptSpecialFormats()
				.fit("true");
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.number().integer()
				.fit(3.14);
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.number().integer()
				.fit("3.14");
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.number().integer()
				.fit("3.");
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.number()
				.fit("1e+2");
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.number()
				.fit("0x100");
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.number()
				.fit("0o100");
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.number()
				.fit("0b100");
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.number()
				.fit("１２３４．５");
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.number()
				.fit([]);
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.number()
				.fit({});
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.number().strict()
				.fit("1");
		}).toThrow(valueSchema.CAUSE.TYPE);

		expect(() =>
		{
			valueSchema.number().strict()
				.fit(true);
		}).toThrow(valueSchema.CAUSE.TYPE);
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
		expect(valueSchema.number().default(10)
			.fit(1)).toEqual(1);
	});
	it("should be adjusted", () =>
	{
		expect(valueSchema.number().default(10)
			.fit(undefined)).toEqual(10);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.number()
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
	it("should be adjusted", () =>
	{
		expect(valueSchema.number().acceptNull(123)
			.fit(null)).toEqual(123);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.number()
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
	it("should be adjusted", () =>
	{
		expect(valueSchema.number().acceptEmptyString(123)
			.fit("")).toEqual(123);

		expect(valueSchema.number().acceptEmptyString()
			.fit("")).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.number()
				.fit("");
		}).toThrow(valueSchema.CAUSE.EMPTY);
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
		expect(valueSchema.number().only(1, 3, 5)
			.fit(1)).toEqual(1);

		expect(valueSchema.number().only(1, 3, 5)
			.fit(3)).toEqual(3);

		expect(valueSchema.number().only(1, 3, 5)
			.fit(5)).toEqual(5);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.number().only(1, 3, 5)
				.fit(2);
		}).toThrow(valueSchema.CAUSE.ONLY);
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
		expect(valueSchema.number()
			.fit(Number.MIN_SAFE_INTEGER)).toEqual(Number.MIN_SAFE_INTEGER);
		expect(valueSchema.number().minValue(10)
			.fit(10)).toEqual(10);
	});
	it("should be adjusted", () =>
	{
		expect(valueSchema.number().minValue(10, true)
			.fit(9)).toEqual(10);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.number()
				.fit(Number.MIN_SAFE_INTEGER - 1);
		}).toThrow(valueSchema.CAUSE.MIN_VALUE);
		expect(() =>
		{
			valueSchema.number().minValue(10)
				.fit(9);
		}).toThrow(valueSchema.CAUSE.MIN_VALUE);
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
		expect(valueSchema.number()
			.fit(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);
		expect(valueSchema.number().maxValue(100)
			.fit(100)).toEqual(100);
	});
	it("should be adjusted", () =>
	{
		expect(valueSchema.number().maxValue(100, true)
			.fit(101)).toEqual(100);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			valueSchema.number()
				.fit(Number.MAX_SAFE_INTEGER + 1);
		}).toThrow(valueSchema.CAUSE.MAX_VALUE);
		expect(() =>
		{
			valueSchema.number().maxValue(100)
				.fit(101);
		}).toThrow(valueSchema.CAUSE.MAX_VALUE);
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
		expect(valueSchema.number().convert(converter)
			.fit(100)).toEqual(101);

		expect(valueSchema.number().convert(converter)
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
			valueSchema.number().convert(converter)
				.fit(100);
		}).toThrow(valueSchema.CAUSE.CONVERT);

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
