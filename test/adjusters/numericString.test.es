import adjuster from "index";

{
	describe("separatedBy", testSeparatedBy);
	describe("minLength", testMinLength);
	describe("maxLength", testMaxLength);
	describe("checksum (Luhn)", testChecksumLuhn);
	describe("checksum (Modulus 10 / Weight 3:1)", testChecksumModulus10Weight31);
}

/**
 * separator
 */
function testSeparatedBy()
{
	const objAdjuster = adjuster.numericString().separatedBy("-");
	it("should be adjusted", () =>
	{
		expect(objAdjuster.adjust("1111-2222-3333-4444")).toEqual("1111222233334444");
	});
}

/**
 * min-length
 */
function testMinLength()
{
	const objAdjuster = adjuster.numericString().minLength(4).separatedBy("-");
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust("1111")).toEqual("1111");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("111");
		}).toThrow(adjuster.CAUSE.MIN_LENGTH);
		expect(() =>
		{
			objAdjuster.adjust("11-1");
		}).toThrow(adjuster.CAUSE.MIN_LENGTH);
	});
}

/**
 * max-length
 */
function testMaxLength()
{
	const objAdjuster = adjuster.numericString().maxLength(4).separatedBy("-");
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust("1111")).toEqual("1111");
		expect(objAdjuster.adjust("11-11")).toEqual("1111");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("11111");
		}).toThrow(adjuster.CAUSE.MAX_LENGTH);
	});
}

/**
 * checksum - Luhn algorithm
 */
function testChecksumLuhn()
{
	const objAdjuster = adjuster.numericString().checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.CREDIT_CARD);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust("49927398716")).toEqual("49927398716");
		expect(objAdjuster.adjust("049927398716")).toEqual("049927398716");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("12345");
		}).toThrow(adjuster.CAUSE.NUMERIC_STRING_CHECKSUM);
	});
}

/**
 * checksum - Modulus 10 / Weight 3:1
 */
function testChecksumModulus10Weight31()
{
	const objAdjuster = adjuster.numericString().separatedBy("-").checksum(adjuster.NUMERIC_STRING_CHECKSUM_ALGORITHM.ISBN13);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust("978-4-10-109205-8")).toEqual("9784101092058"); // https://ja.wikipedia.org/wiki/ISBN
		expect(objAdjuster.adjust("978-0-306-40615-7")).toEqual("9780306406157"); // https://en.wikipedia.org/wiki/International_Standard_Book_Number
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("978-4-10-109205-1");
		}).toThrow(adjuster.CAUSE.NUMERIC_STRING_CHECKSUM);
	});
}
