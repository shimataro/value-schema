import vs from "value-schema";

{
	describe("type", testType);
	describe("ifUndefined", testIfUndefined);
	describe("ifNull", testIfNull);
	describe("joinArray", testJoinArray);
	describe("separatedBy", testSeparatedBy);
	describe("minLength", testMinLength);
	describe("maxLength", testMaxLength);
	describe("checksum (Luhn)", testChecksumLuhn);
	describe("checksum (Modulus 10 / Weight 3:1)", testChecksumModulus10Weight31);
	describe("checksum (Others)", testChecksumOthers);
	describe("converter", testConverter);
}

/**
 * type
 */
function testType(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.numericString().applyTo("1111222233334444")
		).toEqual("1111222233334444");
	});
	it("should be adjusted", () =>
	{
		expect(
			vs.numericString().applyTo(1111222233334444)
		).toEqual("1111222233334444");

		expect(
			vs.numericString({
				fullWidthToHalf: true,
			}).applyTo("1111２２２２3333４４４４")
		).toEqual("1111222233334444");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString().applyTo("1111２２２２3333４４４４");
		}).toThrow(vs.RULE.PATTERN);
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
			vs.numericString({
				ifUndefined: "12345",
			}).applyTo(undefined)
		).toEqual("12345");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString().applyTo(undefined);
		}).toThrow(vs.RULE.UNDEFINED);
	});
}

/**
 * if null
 */
function testIfNull(): void
{
	it("should be adjusted", () =>
	{
		expect(
			vs.numericString({
				ifNull: "123",
			}).applyTo(null)
		).toEqual("123");

		expect(
			vs.numericString({
				ifNull: null,
			}).applyTo(null)
		).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString().applyTo(null);
		}).toThrow(vs.RULE.NULL);
	});
}

/**
 * join array
 */
function testJoinArray(): void
{
	it("should be adjusted", () =>
	{
		expect(
			vs.numericString({
				joinsArray: true,
			}).applyTo(["1111", "2222", "3333", "4444"])
		).toEqual("1111222233334444");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString().applyTo(["1111", "2222", "3333", "4444"]);
		}).toThrow(vs.RULE.TYPE);
	});
}

/**
 * separator
 */
function testSeparatedBy(): void
{
	it("should be adjusted", () =>
	{
		expect(
			vs.numericString({
				separatedBy: "-",
			}).applyTo("1111-2222-3333-4444")
		).toEqual("1111222233334444");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString().applyTo("1111-2222-3333-4444");
		}).toThrow(vs.RULE.PATTERN);
	});
}

/**
 * min-length
 */
function testMinLength(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.numericString({
				minLength: 4,
				separatedBy: "-",
			}).applyTo("111-1")
		).toEqual("1111");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString({
				minLength: 4,
				separatedBy: "-",
			}).applyTo("111");
		}).toThrow(vs.RULE.MIN_LENGTH);
		expect(() =>
		{
			vs.numericString({
				minLength: 4,
				separatedBy: "-",
			}).applyTo("11-1");
		}).toThrow(vs.RULE.MIN_LENGTH);
	});
}

/**
 * max-length
 */
function testMaxLength(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.numericString({
				maxLength: 4,
			}).applyTo("1111")
		).toEqual("1111");
		expect(
			vs.numericString({
				maxLength: 4,
				separatedBy: "-",
			}).applyTo("11-22")
		).toEqual("1122");
	});
	it("should be adjusted", () =>
	{
		expect(
			vs.numericString({
				maxLength: {
					length: 4,
					trims: true,
				},
			}).applyTo("12345")
		).toEqual("1234");
		expect(
			vs.numericString({
				maxLength: {
					length: 4,
					trims: true,
				},
				separatedBy: "-",
			}).applyTo("123-456")
		).toEqual("1234");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString({
				maxLength: 4,
			}).applyTo("11111");
		}).toThrow(vs.RULE.MAX_LENGTH);
	});
}

/**
 * checksum - Luhn algorithm
 */
function testChecksumLuhn(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.numericString({
				checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD,
			}).applyTo("49927398716")
		).toEqual("49927398716");
		expect(
			vs.numericString({
				checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD,
			}).applyTo("049927398716")
		).toEqual("049927398716");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString({
				checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.CREDIT_CARD,
			}).applyTo("12345");
		}).toThrow(vs.RULE.CHECKSUM);
	});
}

/**
 * checksum - Modulus 10 / Weight 3:1
 */
function testChecksumModulus10Weight31(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.numericString({
				separatedBy: "-",
				checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13,
			}).applyTo("978-4-10-109205-8")
		).toEqual("9784101092058"); // https://ja.wikipedia.org/wiki/ISBN
		expect(
			vs.numericString({
				separatedBy: "-",
				checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13,
			}).applyTo("978-0-306-40615-7")
		).toEqual("9780306406157"); // https://en.wikipedia.org/wiki/International_Standard_Book_Number
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString({
				separatedBy: "-",
				checksum: vs.NUMERIC_STRING.CHECKSUM_ALGORITHM.ISBN13,
			}).applyTo("978-4-10-109205-1");
		}).toThrow(vs.RULE.CHECKSUM);
	});
}

/**
 * checksum - Others
 */
function testChecksumOthers(): void
{
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.numericString({
				checksum: -1 as any, // eslint-disable-line @typescript-eslint/no-explicit-any
			}).applyTo("0123456789");
		}).toThrow(vs.RULE.CHECKSUM);
	});
}

/**
 * converter
 */
function testConverter(): void
{
	it("should be adjusted", () =>
	{
		expect(
			vs.numericString({
				converter: (value, fail) =>
				{
					if(value.length >= 9)
					{
						fail();
					}
					return value.padStart(8, "0");
				},
			}).applyTo("1234")
		).toEqual("00001234");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.string({
				converter: (value, fail) =>
				{
					if(value.length >= 9)
					{
						fail();
					}
					return value.padStart(8, "0");
				},
			}).applyTo("123456789");
		}).toThrow(vs.RULE.CONVERTER);
	});
}
