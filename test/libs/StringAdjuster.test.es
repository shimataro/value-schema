import assert from "assert";
import {CAUSE} from "libs/constants";
import StringAdjuster from "libs/StringAdjuster";

describe("libs/StringAdjuster", () =>
{
	describe("type", testType);
	describe("required", testRequired);
	describe("default", testDefault);
	describe("empty", testEmpty);
	describe("allowEmpty", testAllowEmpty);
	describe("in", testIn);
	describe("minLength", testMinLength);
	describe("maxLength", testMaxLength);
	describe("maxLength (adjusted)", testMaxLengthAdjusted);
	describe("pattern", testPattern);
});

function testType()
{
	const objStringAdjuster = new StringAdjuster();
	it("should be OK", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objStringAdjuster.adjust(0), "0");
			assert.strictEqual(objStringAdjuster.adjust(-1), "-1");
		});
	});
}

function testRequired()
{
	const objStringAdjuster = new StringAdjuster();
	it("should cause error(s)", () =>
	{
		assert.throws(() =>
		{
			objStringAdjuster.adjust(undefined)
		}, (err) =>
		{
			return (err.cause === CAUSE.REQUIRED);
		});
	});
}

function testDefault()
{
	const objStringAdjuster = new StringAdjuster().default("xyz");
	it("should be adjusted", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objStringAdjuster.adjust(undefined), "xyz");
		});
	});
}

function testEmpty()
{
	const objStringAdjuster = new StringAdjuster();
	it("should cause error(s)", () =>
	{
		assert.throws(() =>
		{
			objStringAdjuster.adjust("")
		}, (err) =>
		{
			return (err.cause === CAUSE.EMPTY);
		});
	});
}

function testAllowEmpty()
{
	const objStringAdjuster = new StringAdjuster().allowEmpty();
	it("should be OK", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objStringAdjuster.adjust(""), "");
		});
	});
}

function testIn()
{
	const objStringAdjuster = new StringAdjuster().in("", "eat", "sleep", "play");
	it("should be OK", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objStringAdjuster.adjust(""), "");
			assert.strictEqual(objStringAdjuster.adjust("eat"), "eat");
			assert.strictEqual(objStringAdjuster.adjust("sleep"), "sleep");
			assert.strictEqual(objStringAdjuster.adjust("play"), "play");
		});
	});
	it("should cause error(s)", () =>
	{
		assert.throws(() =>
		{
			objStringAdjuster.adjust("study");
		}, (err) =>
		{
			return (err.cause === CAUSE.IN)
		});
	});
}

function testMinLength()
{
	const objStringAdjuster = new StringAdjuster().minLength(4);
	it("should be OK", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objStringAdjuster.adjust("1234"), "1234");
		});
	});
	it("should cause error(s)", () =>
	{
		assert.throws(() =>
		{
			objStringAdjuster.adjust("abc");
		}, (err) =>
		{
			return (err.cause === CAUSE.MIN_LENGTH);
		});
	});
}

function testMaxLength()
{
	const objStringAdjuster = new StringAdjuster().maxLength(8);
	it("should be OK", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objStringAdjuster.adjust("12345678"), "12345678");
		});
	});
	it("should cause error(s)", () =>
	{
		assert.throws(() =>
		{
			objStringAdjuster.adjust("123456789");
		}, (err) =>
		{
			return (err.cause === CAUSE.MAX_LENGTH);
		});
	});
}

function testMaxLengthAdjusted()
{
	const objStringAdjuster = new StringAdjuster().maxLength(8, true);
	it("should be adjusted", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objStringAdjuster.adjust("123456789"), "12345678");
		});
	});
}

function testPattern()
{
	const objStringAdjuster = new StringAdjuster().pattern(/^Go+gle$/);
	it("should be OK", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objStringAdjuster.adjust("Gogle"), "Gogle");
			assert.strictEqual(objStringAdjuster.adjust("Google"), "Google");
			assert.strictEqual(objStringAdjuster.adjust("Gooogle"), "Gooogle");
		});
	});
	it("should cause error(s)", () =>
	{
		assert.throws(() =>
		{
			objStringAdjuster.adjust("Ggle");
		}, (err) =>
		{
			return (err.cause === CAUSE.PATTERN);
		});

		assert.throws(() =>
		{
			objStringAdjuster.adjust("google");
		}, (err) =>
		{
			return (err.cause === CAUSE.PATTERN);
		});
	});
}
