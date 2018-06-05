import adjuster from "index";

{
	describe("type", testType);
	describe("default", testDefault);
	describe("allowNull", testAllowNull);
	describe("allowEmptyString", testAllowEmptyString);
	describe("separatedBy", testSeparatedBy);
	describe("toArray", testToArray);
	describe("minLength", testMinLength);
	describe("maxLength", testMaxLength);
	describe("ignoreEachErrors", testIgnoreEachErrors);
	describe("eachDefault", testEachDefault);
	describe("eachAllowNull", testEachAllowNull);
	describe("eachAllowEmptyString", testEachAllowEmptyString);
	describe("eachTrim", testEachTrim);
	describe("eachOnly", testEachOnly);
	describe("eachMinLength", testEachMinLength);
	describe("eachMaxLength", testEachMaxLength);
	describe("eachPattern", testEachPattern);
}

/**
 * type
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
 */
function testAllowNull()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.stringArray().allowNull(["a", "b", "c"])
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
 */
function testAllowEmptyString()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.stringArray().allowEmptyString(["a", "b"])
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
 * each elements; default value
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
 */
function testEachAllowNull()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.stringArray().eachAllowNull("z")
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
			adjuster.stringArray().eachAllowNull("z")
				.adjust(["a", undefined, "b"]);
		}).toThrow(adjuster.CAUSE.EACH_REQUIRED);
	});
}

/**
 * each elements; empty string
 */
function testEachAllowEmptyString()
{
	it("should be adjusted", () =>
	{
		expect(adjuster.stringArray().eachAllowEmptyString("z")
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
			adjuster.stringArray().eachAllowEmptyString("z")
				.adjust(["a", undefined, "b"]);
		}).toThrow(adjuster.CAUSE.EACH_REQUIRED);
	});
}

/**
 * each elements; trim
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
