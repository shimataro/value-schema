import assert from "assert";
import {CAUSE} from "libs/constants";
import NumberAdjuster from "libs/NumberAdjuster";

describe("libs/NumberAdjuster", () =>
{
	describe("type", testType);
	describe("required", testRequired);
	describe("default", testDefault);
	describe("empty", testEmpty);
	describe("allowEmpty", testAllowEmpty);
	describe("in", testIn);
	describe("minValue", testMinValue);
	describe("minValue (adjusted)", testMinValueAdjusted);
	describe("maxValue", testMaxValue);
	describe("maxValue (adjusted)", testMaxValueAdjusted);
});

function testType()
{
	const objNumberAdjuster = new NumberAdjuster();
	it("should be OK", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objNumberAdjuster.adjust(1), 1);
		});
	});
	it("should be adjusted", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objNumberAdjuster.adjust("123"), 123);
			assert.strictEqual(objNumberAdjuster.adjust("+456"), 456);
			assert.strictEqual(objNumberAdjuster.adjust("-789"), -789);
		});
	});
	it("should cause error(s)", () =>
	{
		assert.throws(() =>
		{
			objNumberAdjuster.adjust("abc")
		}, (err) =>
		{
			return (err.cause === CAUSE.TYPE);
		});
	});
}

function testRequired()
{
	const objNumberAdjuster = new NumberAdjuster();
	it("should be OK", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objNumberAdjuster.adjust(0), 0);
		});
	});
	it("should cause error(s)", () =>
	{
		assert.throws(() =>
		{
			objNumberAdjuster.adjust(undefined)
		}, (err) =>
		{
			return (err.cause === CAUSE.REQUIRED);
		});
	});
}

function testDefault()
{
	const objNumberAdjuster = new NumberAdjuster().default(10);
	it("should be OK", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objNumberAdjuster.adjust(1), 1);
		});
	});
	it("should be adjusted", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objNumberAdjuster.adjust(undefined), 10);
		});
	});
}

function testEmpty()
{
	const objNumberAdjuster = new NumberAdjuster();
	it("should cause error(s)", () =>
	{
		assert.throws(() =>
		{
			objNumberAdjuster.adjust("");
		}, (err) =>
		{
			return (err.cause === CAUSE.EMPTY);
		});
	});
}

function testAllowEmpty()
{
	const objNumberAdjuster = new NumberAdjuster().allowEmpty();
	it("should be adjusted", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objNumberAdjuster.adjust(""), 0);
		});
	});
}

function testIn()
{
	const objNumberAdjuster = new NumberAdjuster().in(1, 3, 5);
	it("should be OK", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objNumberAdjuster.adjust(1), 1);
			assert.strictEqual(objNumberAdjuster.adjust(3), 3);
			assert.strictEqual(objNumberAdjuster.adjust(5), 5);
		});
	});
	it("should cause error(s)", () =>
	{
		assert.throws(() =>
		{
			objNumberAdjuster.adjust(2);
		}, (err) =>
		{
			return (err.cause === CAUSE.IN);
		});
	});
}

function testMinValue()
{
	const objNumberAdjuster = new NumberAdjuster().minValue(10);
	it("should be OK", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objNumberAdjuster.adjust(10), 10);
		});
	});
	it("should cause error(s)", () =>
	{
		assert.throws(() =>
		{
			objNumberAdjuster.adjust(9);
		}, (err) =>
		{
			return (err.cause === CAUSE.MIN_VALUE);
		});
	});
}

function testMinValueAdjusted()
{
	const objNumberAdjuster = new NumberAdjuster().minValue(10, true);
	it("should be adjusted", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objNumberAdjuster.adjust(9), 10);
		});
	});
}

function testMaxValue()
{
	const objNumberAdjuster = new NumberAdjuster().maxValue(100);
	it("should be OK", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objNumberAdjuster.adjust(100), 100);
		});
	});
	it("should cause error(s)", () =>
	{
		assert.throws(() =>
		{
			objNumberAdjuster.adjust(101);
		}, (err) =>
		{
			return (err.cause === CAUSE.MAX_VALUE);
		});
	});
}

function testMaxValueAdjusted()
{
	const objNunmberAdjuster = new NumberAdjuster().maxValue(100, true);
	it("should be adjusted", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objNunmberAdjuster.adjust(101), 100);
		});
	});
}
