import assert from "assert";
import {CAUSE} from "libs/constants";
import EmailAdjuster from "libs/EmailAdjuster";

describe("libs/EmailAdjuster", () =>
{
	describe("required", testRequired);
	describe("default", testDefault);
	describe("empty", testEmpty);
	describe("allowEmpty", testAllowEmpty);
	describe("pattern", testPattern);
});

function testRequired()
{
	const objEmailAdjuster = new EmailAdjuster();
	it("should cause error(s)", () =>
	{
		assert.throws(() =>
		{
			objEmailAdjuster.adjust(undefined);
		}, (err) =>
		{
			return (err.cause === CAUSE.REQUIRED);
		});
	});
}

function testDefault()
{
	const objEmailAdjuster = new EmailAdjuster().default("user@example.com");
	it("should be adjusted", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objEmailAdjuster.adjust(undefined), "user@example.com");
		});
	});
}

function testEmpty()
{
	const objEmailAdjuster = new EmailAdjuster();
	it("should cause error(s)", () =>
	{
		assert.throws(() =>
		{
			objEmailAdjuster.adjust("");
		}, (err) =>
		{
			return (err.cause === CAUSE.EMPTY);
		});
	});
}

function testAllowEmpty()
{
	const objEmailAdjuster = new EmailAdjuster().allowEmpty();
	it("should be OK", () =>
	{
		assert.doesNotThrow(() =>
		{
			assert.strictEqual(objEmailAdjuster.adjust(""), "");
		});
	});
}

function testPattern()
{
	const objEmailAdjuster = new EmailAdjuster();
	it("should be OK", () =>
	{
		assert.doesNotThrow(() =>
		{
			let value;

			// dot-string
			value = "Abc@example.com";
			assert.strictEqual(objEmailAdjuster.adjust(value), value);

			value = "user+mailbox/department=shipping@example.com";
			assert.strictEqual(objEmailAdjuster.adjust(value), value);

			value = "!#$%&'*+-/=?^_`.{|}~@example.com";
			assert.strictEqual(objEmailAdjuster.adjust(value), value);

			// quoted-pair
			value = "\"Fred\\\"Bloggs\"@example.com";
			assert.strictEqual(objEmailAdjuster.adjust(value), value);

			value = "\"Joe.\\\\Blow\"@example.com";
			assert.strictEqual(objEmailAdjuster.adjust(value), value);

			// domain
			value = "user@example-domain.com";
			assert.strictEqual(objEmailAdjuster.adjust(value), value);

			value = "user@example2.com";
			assert.strictEqual(objEmailAdjuster.adjust(value), value);
		});
	});
	it("should cause error(s)", () =>
	{
		assert.throws(() =>
		{
			objEmailAdjuster.adjust("@example.com");
		}, (err) =>
		{
			return (err.cause === CAUSE.EMAIL);
		});

		assert.throws(() =>
		{
			objEmailAdjuster.adjust(".a@example.com");
		}, (err) =>
		{
			return (err.cause === CAUSE.EMAIL);
		});

		assert.throws(() =>
		{
			objEmailAdjuster.adjust("a.@example.com");
		}, (err) =>
		{
			return (err.cause === CAUSE.EMAIL);
		});

		assert.throws(() =>
		{
			objEmailAdjuster.adjust("a..a@example.com");
		}, (err) =>
		{
			return (err.cause === CAUSE.EMAIL);
		});

		assert.throws(() =>
		{
			objEmailAdjuster.adjust("user@example@com");
		}, (err) =>
		{
			return (err.cause === CAUSE.EMAIL);
		});

		assert.throws(() =>
		{
			objEmailAdjuster.adjust("user-example-com");
		}, (err) =>
		{
			return (err.cause === CAUSE.EMAIL);
		});

		assert.throws(() =>
		{
			objEmailAdjuster.adjust("user@example_domain.com");
		}, (err) =>
		{
			return (err.cause === CAUSE.EMAIL);
		});

		assert.throws(() =>
		{
			objEmailAdjuster.adjust("user@example.com2");
		}, (err) =>
		{
			return (err.cause === CAUSE.EMAIL);
		});
	});
}
