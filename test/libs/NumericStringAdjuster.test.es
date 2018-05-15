import {CAUSE, NUMERIC_STRING_CHECKSUM} from "libs/constants";
import NumericStringAdjuster from "libs/NumericStringAdjuster";

{
	describe("separatedBy", testSeparatedBy);
	describe("minLength", testMinLength);
	describe("maxLength", testMaxLength);
	describe("checksum", testChecksum);
}

/**
 * separator
 */
function testSeparatedBy()
{
	const objAdjuster = new NumericStringAdjuster();
	it("should be adjusted", () =>
	{
		expect(objAdjuster.separatedBy("-").adjust("1111-2222-3333-4444")).toEqual("1111222233334444");
		expect(objAdjuster.separatedBy(/-/).adjust("5555-6666-7777-8888")).toEqual("5555666677778888");
	});
}

/**
 * min-length
 */
function testMinLength()
{
	const objAdjuster = new NumericStringAdjuster().minLength(4).separatedBy("-");
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust("1111")).toEqual("1111");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("111");
		}).toThrow(CAUSE.MIN_LENGTH);
		expect(() =>
		{
			objAdjuster.adjust("11-1");
		}).toThrow(CAUSE.MIN_LENGTH);
	});
}

/**
 * max-length
 */
function testMaxLength()
{
	const objAdjuster = new NumericStringAdjuster().maxLength(4).separatedBy("-");
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
		}).toThrow(CAUSE.MAX_LENGTH);
	});
}

/**
 * checksum
 */
function testChecksum()
{
	const objAdjuster = new NumericStringAdjuster().checksum(NUMERIC_STRING_CHECKSUM.CREDIT_CARD);
	it("should be OK", () =>
	{
		expect(objAdjuster.adjust("49927398716")).toBe("49927398716");
		expect(objAdjuster.adjust("049927398716")).toBe("049927398716");
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			objAdjuster.adjust("12345");
		}).toThrow(CAUSE.NUMERIC_STRING_CHECKSUM);
	});
}
