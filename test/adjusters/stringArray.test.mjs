import adjuster from "index";

{
	describe("type", testType);
	describe("default", testDefault);
	describe("acceptNull", testAcceptNull);
	describe("acceptEmptyString", testAcceptEmptyString);
	describe("separatedBy", testSeparatedBy);
	describe("toArray", testToArray);
	describe("minLength", testMinLength);
	describe("maxLength", testMaxLength);
	describe("ignoreEachErrors", testIgnoreEachErrors);
	describe("eachStrict", testEachStrict);
	describe("eachDefault", testEachDefault);
	describe("eachAcceptNull", testEachAcceptNull);
	describe("eachAcceptEmptyString", testEachAcceptEmptyString);
	describe("eachTrim", testEachTrim);
	describe("eachOnly", testEachOnly);
	describe("eachMinLength", testEachMinLength);
	describe("eachMaxLength", testEachMaxLength);
	describe("eachPattern", testEachPattern);
}

/**
 * type
 * @return {void}
 */
function testType()
{
	it("should be OK", () =>
	{
		expect(adjuster.stringArray()
			.adjust([])).toEqual([]);

		expect(adjuster.stringArray()
			.adjust(["a", "b"])).toEqual(["a", "b"]);
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.stringArray()
			.adjust(["a", 1, -2])).toEqual(["a", "1", "-2"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.stringArray()
				.adjust("abc");
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
		expect(adjuster.stringArray().default(["a", "b"])
			.adjust(undefined)).toEqual(["a", "b"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.stringArray()
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
	it("should be adjusted", () =>
	{
		expect(adjuster.stringArray().acceptNull(["a", "b", "c"])
			.adjust(null)).toEqual(["a", "b", "c"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.stringArray()
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
	it("should be adjusted", () =>
	{
		expect(adjuster.stringArray().acceptEmptyString(["a", "b"])
			.adjust("")).toEqual(["a", "b"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.stringArray()
				.adjust("");
		}).toThrow(adjuster.CAUSE.EMPTY);
	});
}

/**
 * separator
 * @return {void}
 */
function testSeparatedBy()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.stringArray().separatedBy(",")
			.adjust("a,b,c")).toEqual(["a", "b", "c"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.stringArray()
				.adjust("a,b,c");
		}).toThrow(adjuster.CAUSE.TYPE);
	});
}

/**
 * convert to array
 * @return {void}
 */
function testToArray()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.stringArray().toArray()
			.adjust("a")).toEqual(["a"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.stringArray()
				.adjust("a");
		}).toThrow(adjuster.CAUSE.TYPE);
	});
}

/**
 * minimum length of elements
 * @return {void}
 */
function testMinLength()
{
	it("should be OK", () =>
	{
		expect(adjuster.stringArray().minLength(1)
			.adjust(["a"])).toEqual(["a"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.stringArray().minLength(1)
				.adjust([]);
		}).toThrow(adjuster.CAUSE.MIN_LENGTH);
	});
}

/**
 * maximum length of elements
 * @return {void}
 */
function testMaxLength()
{
	it("should be OK", () =>
	{
		expect(adjuster.stringArray().maxLength(1)
			.adjust(["a"])).toEqual(["a"]);

		expect(adjuster.stringArray().maxLength(1, true)
			.adjust(["a"])).toEqual(["a"]);
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.stringArray().maxLength(1, true)
			.adjust(["a", "b"])).toEqual(["a"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.stringArray().maxLength(1)
				.adjust(["a", "b"]);
		}).toThrow(adjuster.CAUSE.MAX_LENGTH);
	});
}

/**
 * ignore elements' error
 * @return {void}
 */
function testIgnoreEachErrors()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.stringArray().ignoreEachErrors().separatedBy(",")
			.adjust([undefined, "a", "", 1])).toEqual(["a", "1"]);

		expect(adjuster.stringArray().ignoreEachErrors().separatedBy(",")
			.adjust("a,,b,c,")).toEqual(["a", "b", "c"]);
	});
}

/**
 * each elements; strict type check
 * @return {void}
 */
function testEachStrict()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.stringArray()
			.adjust([true, "2", 3])).toEqual(["true", "2", "3"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.stringArray().eachStrict()
				.adjust([true, "2", 3]);
		}).toThrow(adjuster.CAUSE.EACH_TYPE);
	});
}

/**
 * each elements; default value
 * @return {void}
 */
function testEachDefault()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.stringArray().eachDefault("z")
			.adjust(["a", undefined, "b"])).toEqual(["a", "z", "b"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.stringArray()
				.adjust(["a", undefined, "b"]);
		}).toThrow(adjuster.CAUSE.EACH_REQUIRED);

		expect(() =>
		{
			adjuster.stringArray().eachDefault("z")
				.adjust(["a", "", "b"]);
		}).toThrow(adjuster.CAUSE.EACH_EMPTY);
	});
}

/**
 * each elements; null
 * @return {void}
 */
function testEachAcceptNull()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.stringArray().eachAcceptNull("z")
			.adjust(["a", null, "b"])).toEqual(["a", "z", "b"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.stringArray()
				.adjust(["a", null, "b"]);
		}).toThrow(adjuster.CAUSE.EACH_NULL);
		expect(() =>
		{
			adjuster.stringArray().eachAcceptNull("z")
				.adjust(["a", undefined, "b"]);
		}).toThrow(adjuster.CAUSE.EACH_REQUIRED);
	});
}

/**
 * each elements; empty string
 * @return {void}
 */
function testEachAcceptEmptyString()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.stringArray().eachAcceptEmptyString("z")
			.adjust(["a", "", "b"])).toEqual(["a", "z", "b"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.stringArray()
				.adjust(["a", "", "b"]);
		}).toThrow(adjuster.CAUSE.EACH_EMPTY);
		expect(() =>
		{
			adjuster.stringArray().eachAcceptEmptyString("z")
				.adjust(["a", undefined, "b"]);
		}).toThrow(adjuster.CAUSE.EACH_REQUIRED);
	});
}

/**
 * each elements; trim
 * @return {void}
 */
function testEachTrim()
{
	it("should be OK", () =>
	{
		expect(adjuster.stringArray().eachTrim()
			.adjust([" a", "b\t", "\rc\n"])).toEqual(["a", "b", "c"]);
	});
}

/**
 * each elements; set
 * @return {void}
 */
function testEachOnly()
{
	it("should be OK", () =>
	{
		expect(adjuster.stringArray().eachOnly("a", "b", "c")
			.adjust(["a", "b", "c"])).toEqual(["a", "b", "c"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.stringArray().eachOnly("a", "b", "c")
				.adjust(["a", "b", "x"]);
		}).toThrow(adjuster.CAUSE.EACH_ONLY);
	});
}

/**
 * each elements; minimum length of string
 * @return {void}
 */
function testEachMinLength()
{
	it("should be OK", () =>
	{
		expect(adjuster.stringArray().eachMinLength(3)
			.adjust(["abc", "xyz"])).toEqual(["abc", "xyz"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.stringArray().eachMinLength(3)
				.adjust(["abc", "xy"]);
		}).toThrow(adjuster.CAUSE.EACH_MIN_LENGTH);
	});
}

/**
 * each elements; maximum length of string
 * @return {void}
 */
function testEachMaxLength()
{
	it("should be OK", () =>
	{
		expect(adjuster.stringArray().eachMaxLength(3)
			.adjust(["abc", "xyz"])).toEqual(["abc", "xyz"]);

		expect(adjuster.stringArray().eachMaxLength(3, true)
			.adjust(["abc", "xyz"])).toEqual(["abc", "xyz"]);
	});
	it("should be adjusted", () =>
	{
		expect(adjuster.stringArray().eachMaxLength(3, true)
			.adjust(["abcd", "xyz0"])).toEqual(["abc", "xyz"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.stringArray().eachMaxLength(3)
				.adjust(["abcd", "xyz0"]);
		}).toThrow(adjuster.CAUSE.EACH_MAX_LENGTH);
	});
}

/**
 * each elements; pattern
 * @return {void}
 */
function testEachPattern()
{
	it("should be OK", () =>
	{
		expect(adjuster.stringArray().eachPattern(/^Go+gle$/)
			.adjust(["Gogle", "Google", "Gooogle"])).toEqual(["Gogle", "Google", "Gooogle"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			adjuster.stringArray().eachPattern(/^Go+gle$/)
				.adjust(["google", "Ggle"]);
		}).toThrow(adjuster.CAUSE.EACH_PATTERN);
	});
}
