import vs from "value-schema"; // eslint-disable-line import/no-unresolved

{
	describe("type", testType);
	describe("default", testDefault);
	describe("acceptNull", testAcceptNull);
	describe("acceptEmptyString", testAcceptEmptyString);
	describe("separatedBy", testSeparatedBy);
	describe("toArray", testToArray);
	describe("minLength", testMinLength);
	describe("maxLength", testMaxLength);
	describe("number", testNumber);
	describe("string", testString);
}

/**
 * type
 * @returns {void}
 */
function testType()
{
	it("should be OK", () =>
	{
		expect(vs.array()
			.fit([])).toEqual([]);

		expect(vs.array()
			.fit([1, 2])).toEqual([1, 2]);

		expect(vs.array()
			.fit(["a", "b"])).toEqual(["a", "b"]);

		expect(vs.array()
			.fit([1, "a"])).toEqual([1, "a"]);
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
		expect(vs.array().default([1, "a"])
			.fit(undefined)).toEqual([1, "a"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.array()
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
		expect(vs.array().acceptNull([1, "a"])
			.fit(null)).toEqual([1, "a"]);

		expect(vs.array().acceptNull()
			.fit(null)).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.array()
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
		expect(vs.array().acceptEmptyString([1, "a"])
			.fit("")).toEqual([1, "a"]);

		expect(vs.array().acceptEmptyString()
			.fit("")).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.array()
				.fit("");
		}).toThrow(vs.CAUSE.EMPTY);
	});
}

/**
 * separator
 * @returns {void}
 */
function testSeparatedBy()
{
	it("should be fitted", () =>
	{
		expect(vs.array().separatedBy(",")
			.fit("1,a")).toEqual(["1", "a"]);
	});
}

/**
 * convert to array
 * @returns {void}
 */
function testToArray()
{
	it("should be fitted", () =>
	{
		expect(vs.array().toArray()
			.fit("abc")).toEqual(["abc"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.array()
				.fit("abc");
		}).toThrow(vs.CAUSE.TYPE);
	});
}

/**
 * minimum length of elements
 * @returns {void}
 */
function testMinLength()
{
	it("should be OK", () =>
	{
		expect(vs.array().minLength(1)
			.fit(["a"])).toEqual(["a"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.array().minLength(1)
				.fit([]);
		}).toThrow(vs.CAUSE.MIN_LENGTH);
	});
}

/**
 * maximum length of elements
 * @returns {void}
 */
function testMaxLength()
{
	it("should be OK", () =>
	{
		expect(vs.array().maxLength(1)
			.fit([1])).toEqual([1]);

		expect(vs.array().maxLength(1, true)
			.fit([1])).toEqual([1]);
	});
	it("should be fitted", () =>
	{
		expect(vs.array().maxLength(1, true)
			.fit([1, 2])).toEqual([1]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.array().maxLength(1)
				.fit([1, 2]);
		}).toThrow(vs.CAUSE.MAX_LENGTH);
	});
}

/**
 * array of number
 * @returns {void}
 */
function testNumber()
{
	it("should be OK", () =>
	{
		expect(vs.array().each(vs.number())
			.fit([3.14, 2.71])).toEqual([3.14, 2.71]);

		expect(vs.array().each(vs.number().integer())
			.fit([1, 2, 3])).toEqual([1, 2, 3]);

		expect(vs.array().each(vs.number().only(1, 2, 3))
			.fit([1, 2, 3])).toEqual([1, 2, 3]);

		expect(vs.array().each(vs.number().minValue(10))
			.fit([10, 11, 12])).toEqual([10, 11, 12]);
		expect(vs.array().each(vs.number().maxValue(10))
			.fit([8, 9, 10])).toEqual([8, 9, 10]);
	});
	it("should be fitted", () =>
	{
		expect(vs.array().each(vs.number())
			.fit([false, true, 2, "+3", "-4"])).toEqual([0, 1, 2, 3, -4]);

		expect(vs.array().each(vs.number(), true)
			.fit([false, "abc", true, "+2"])).toEqual([0, 1, 2]);

		expect(vs.array().separatedBy(",").each(vs.number())
			.fit("1,2,3")).toEqual([1, 2, 3]);

		expect(vs.array().each(vs.number().default(999))
			.fit(["1", undefined, 3])).toEqual([1, 999, 3]);
		expect(vs.array().each(vs.number().acceptNull(999))
			.fit(["1", null, 3])).toEqual([1, 999, 3]);
		expect(vs.array().each(vs.number().acceptEmptyString(999))
			.fit(["1", "", 3])).toEqual([1, 999, 3]);

		expect(vs.array().each(vs.number().acceptSpecialFormats())
			.fit(["1e+2", "0x100", "0o100", "0b100"])).toEqual([100, 256, 64, 4]);

		expect(vs.array().each(vs.number().integer(true))
			.fit([3.14, -3.14, "3.14"])).toEqual([3, -3, 3]);

		expect(vs.array().each(vs.number().minValue(10, true))
			.fit([9, 10, 11])).toEqual([10, 10, 11]);
		expect(vs.array().each(vs.number().maxValue(10, true))
			.fit([9, 10, 11])).toEqual([9, 10, 10]);
	});
	it("should cause error(s)", () =>
	{
		try
		{
			vs.array().each(vs.number())
				.fit([false, "abc", true, "+2"]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.TYPE);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array().each(vs.number())
				.fit([1, undefined, 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.REQUIRED);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array().each(vs.number())
				.fit([1, null, 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.NULL);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array().each(vs.number())
				.fit([1, "", 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.EMPTY);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array().each(vs.number().default(999))
				.fit([1, null, 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.NULL);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array().each(vs.number().default(999))
				.fit([1, "", 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.EMPTY);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array().each(vs.number().acceptNull(999))
				.fit([1, undefined, 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.REQUIRED);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array().each(vs.number().acceptNull(999))
				.fit([1, "", 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.EMPTY);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array().each(vs.number().acceptEmptyString(999))
				.fit([1, undefined, 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.REQUIRED);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array().each(vs.number().acceptEmptyString(999))
				.fit([1, null, 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.NULL);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array().each(vs.number())
				.fit(["1e+2", "0x100", "0o100", "0b100"]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.TYPE);
			expect(err.keyStack).toEqual([0]);
		}

		try
		{
			vs.array().each(vs.number().integer())
				.fit([3.14]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.TYPE);
			expect(err.keyStack).toEqual([0]);
		}

		try
		{
			vs.array().each(vs.number().only(1, 2, 3))
				.fit([0, 1, 2]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.ONLY);
			expect(err.keyStack).toEqual([0]);
		}

		try
		{
			vs.array().each(vs.number().minValue(10))
				.fit([9, 10, 11]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.MIN_VALUE);
			expect(err.keyStack).toEqual([0]);
		}

		try
		{
			vs.array().each(vs.number().maxValue(10))
				.fit([9, 10, 11]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.MAX_VALUE);
			expect(err.keyStack).toEqual([2]);
		}
	});
}

/**
 * array of string
 * @returns {void}
 */
function testString()
{
	it("should be OK", () =>
	{
		expect(vs.array().each(vs.string().only("a", "b", "c"))
			.fit(["a", "b", "c"])).toEqual(["a", "b", "c"]);

		expect(vs.array().each(vs.string().minLength(3))
			.fit(["abc", "xyz"])).toEqual(["abc", "xyz"]);

		expect(vs.array().each(vs.string().maxLength(3))
			.fit(["abc", "xyz"])).toEqual(["abc", "xyz"]);
		expect(vs.array().each(vs.string().maxLength(3, true))
			.fit(["abc", "xyz"])).toEqual(["abc", "xyz"]);

		expect(vs.array().each(vs.string().pattern(/^Go+gle$/))
			.fit(["Gogle", "Google", "Gooogle"])).toEqual(["Gogle", "Google", "Gooogle"]);
	});
	it("should be fitted", () =>
	{
		expect(vs.array().each(vs.string())
			.fit([false, true, 2, "+3", "-4"])).toEqual(["false", "true", "2", "+3", "-4"]);

		expect(vs.array().each(vs.string().trim())
			.fit([" a", "b\t", "\rc\n"])).toEqual(["a", "b", "c"]);

		expect(vs.array().each(vs.string().only("a", "b", "c"))
			.fit(["a", "b", "c"])).toEqual(["a", "b", "c"]);

		expect(vs.array().each(vs.string().maxLength(3, true))
			.fit(["abcd", "xyz0"])).toEqual(["abc", "xyz"]);
	});
	it("should cause error(s)", () =>
	{
		try
		{
			vs.array().each(vs.string().only("a", "b", "c"))
				.fit(["a", "b", "x"]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.ONLY);
			expect(err.keyStack).toEqual([2]);
		}

		try
		{
			vs.array().each(vs.string().minLength(3))
				.fit(["ab", "xy"]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.MIN_LENGTH);
			expect(err.keyStack).toEqual([0]);
		}

		try
		{
			vs.array().each(vs.string().maxLength(3))
				.fit(["abc", "xyz0"]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.MAX_LENGTH);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array().each(vs.string().pattern(/^Go+gle$/))
				.fit(["google", "Ggle"]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err.cause).toEqual(vs.CAUSE.PATTERN);
			expect(err.keyStack).toEqual([0]);
		}
	});
}
