import vs from "value-schema";

enum NumberEnum
{
	zero,
	one,
}
enum StringEnum
{
	a = "a",
	b = "b",
}
enum NumberAndStringEnum
{
	zero,
	one,
	a = "a",
	b = "b",
}
type NumberUnion = 0 | 1;
type StringUnion = "a" | "b";
type NumberAndStringUnion = 0 | 1 | "a" | "b";

{
	describe("ifUndefined", testIfUndefined);
	describe("ifNull", testIfNull);
	describe("ifEmptyString", testIfEmptyString);
	describe("only", testOnly);
}

/**
 * if undefined
 */
function testIfUndefined(): void
{
	it("should be OK (enum)", () =>
	{
		expect(
			vs.enumerate({
				ifUndefined: null,
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(0)
		).toEqual(0);

		expect(
			vs.enumerate({
				ifUndefined: null,
				only: Object.values(StringEnum), // string elements can be extracted by "Object.values()"
			}).applyTo("a")
		).toEqual("a");

		expect(
			vs.enumerate({
				ifUndefined: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(0)
		).toEqual(0);
		expect(
			vs.enumerate({
				ifUndefined: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo("a")
		).toEqual("a");
	});
	it("should be OK (union)", () =>
	{
		expect(
			vs.enumerate<NumberUnion>({
				ifUndefined: null,
				only: [0, 1],
			}).applyTo(0)
		).toEqual(0);

		expect(
			vs.enumerate<StringUnion>({
				ifUndefined: null,
				only: ["a", "b"],
			}).applyTo("a")
		).toEqual("a");

		expect(
			vs.enumerate<NumberAndStringUnion>({
				ifUndefined: null,
				only: [0, 1, "a", "b"],
			}).applyTo(0)
		).toEqual(0);
		expect(
			vs.enumerate<NumberAndStringUnion>({
				ifUndefined: null,
				only: [0, 1, "a", "b"],
			}).applyTo("a")
		).toEqual("a");
	});

	it("should be adjusted (enum)", () =>
	{
		expect(
			vs.enumerate({
				ifUndefined: null,
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(undefined)
		).toEqual(null);

		expect(
			vs.enumerate({
				ifUndefined: null,
				only: Object.values(StringEnum),
			}).applyTo(undefined)
		).toEqual(null);

		expect(
			vs.enumerate({
				ifUndefined: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(undefined)
		).toEqual(null);
	});
	it("should be adjusted (union)", () =>
	{
		expect(
			vs.enumerate<NumberUnion>({
				ifUndefined: null,
				only: [0, 1],
			}).applyTo(undefined)
		).toEqual(null);

		expect(
			vs.enumerate<StringUnion>({
				ifUndefined: null,
				only: ["a", "b"],
			}).applyTo(undefined)
		).toEqual(null);

		expect(
			vs.enumerate<NumberAndStringUnion>({
				ifUndefined: null,
				only: [0, 1, "a", "b"],
			}).applyTo(undefined)
		).toEqual(null);
	});

	it("should cause error(s) (enum)", () =>
	{
		expect(() =>
		{
			vs.enumerate({
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(undefined);
		}).toThrow(vs.CAUSE.UNDEFINED);

		expect(() =>
		{
			vs.enumerate({
				only: Object.values(StringEnum),
			}).applyTo(undefined);
		}).toThrow(vs.CAUSE.UNDEFINED);

		expect(() =>
		{
			vs.enumerate({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(undefined);
		}).toThrow(vs.CAUSE.UNDEFINED);
	});
	it("should cause error(s) (union)", () =>
	{
		expect(() =>
		{
			vs.enumerate<NumberUnion>({
				only: [0, 1],
			}).applyTo(undefined);
		}).toThrow(vs.CAUSE.UNDEFINED);

		expect(() =>
		{
			vs.enumerate<StringUnion>({
				only: ["a", "b"],
			}).applyTo(undefined);
		}).toThrow(vs.CAUSE.UNDEFINED);

		expect(() =>
		{
			vs.enumerate<NumberAndStringUnion>({
				only: [0, 1, "a", "b"],
			}).applyTo(undefined);
		}).toThrow(vs.CAUSE.UNDEFINED);
	});
}

/**
 * if null
 */
function testIfNull(): void
{
	it("should be OK (enum)", () =>
	{
		expect(
			vs.enumerate({
				ifNull: null,
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(0)
		).toEqual(0);

		expect(
			vs.enumerate({
				ifNull: null,
				only: Object.values(StringEnum),
			}).applyTo("a")
		).toEqual("a");

		expect(
			vs.enumerate({
				ifNull: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(0)
		).toEqual(0);
		expect(
			vs.enumerate({
				ifNull: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo("a")
		).toEqual("a");
	});
	it("should be OK (union)", () =>
	{
		expect(
			vs.enumerate<NumberUnion>({
				ifNull: null,
				only: [0, 1],
			}).applyTo(0)
		).toEqual(0);

		expect(
			vs.enumerate<StringUnion>({
				ifNull: null,
				only: ["a", "b"],
			}).applyTo("a")
		).toEqual("a");

		expect(
			vs.enumerate<NumberAndStringUnion>({
				ifNull: null,
				only: [0, 1, "a", "b"],
			}).applyTo(0)
		).toEqual(0);
		expect(
			vs.enumerate<NumberAndStringUnion>({
				ifNull: null,
				only: [0, 1, "a", "b"],
			}).applyTo("a")
		).toEqual("a");
	});

	it("should be adjusted (enum)", () =>
	{
		expect(
			vs.enumerate({
				ifNull: null,
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(null)
		).toEqual(null);

		expect(
			vs.enumerate({
				ifNull: null,
				only: Object.values(StringEnum),
			}).applyTo(null)
		).toEqual(null);

		expect(
			vs.enumerate({
				ifNull: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(null)
		).toEqual(null);
	});
	it("should be adjusted (union)", () =>
	{
		expect(
			vs.enumerate<NumberUnion>({
				ifNull: null,
				only: [0, 1],
			}).applyTo(null)
		).toEqual(null);

		expect(
			vs.enumerate<StringUnion>({
				ifNull: null,
				only: ["a", "b"],
			}).applyTo(null)
		).toEqual(null);

		expect(
			vs.enumerate<NumberAndStringUnion>({
				ifNull: null,
				only: [0, 1, "a", "b"],
			}).applyTo(null)
		).toEqual(null);
	});

	it("should cause error(s) (enum)", () =>
	{
		expect(() =>
		{
			vs.enumerate({
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(null);
		}).toThrow(vs.CAUSE.NULL);

		expect(() =>
		{
			vs.enumerate({
				only: Object.values(StringEnum),
			}).applyTo(null);
		}).toThrow(vs.CAUSE.NULL);

		expect(() =>
		{
			vs.enumerate({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(null);
		}).toThrow(vs.CAUSE.NULL);
	});
	it("should cause error(s) (union)", () =>
	{
		expect(() =>
		{
			vs.enumerate<NumberUnion>({
				only: [0, 1],
			}).applyTo(null);
		}).toThrow(vs.CAUSE.NULL);

		expect(() =>
		{
			vs.enumerate<StringUnion>({
				only: ["a", "b"],
			}).applyTo(null);
		}).toThrow(vs.CAUSE.NULL);

		expect(() =>
		{
			vs.enumerate<NumberAndStringUnion>({
				only: [0, 1, "a", "b"],
			}).applyTo(null);
		}).toThrow(vs.CAUSE.NULL);
	});
}

/**
 * if empty string
 */
function testIfEmptyString(): void
{
	it("should be OK (enum)", () =>
	{
		expect(
			vs.enumerate({
				ifEmptyString: null,
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(0)
		).toEqual(0);

		expect(
			vs.enumerate({
				ifEmptyString: null,
				only: Object.values(StringEnum),
			}).applyTo("a")
		).toEqual("a");

		expect(
			vs.enumerate({
				ifEmptyString: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(0)
		).toEqual(0);
		expect(
			vs.enumerate({
				ifEmptyString: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo("a")
		).toEqual("a");
	});
	it("should be OK (union)", () =>
	{
		expect(
			vs.enumerate<NumberUnion>({
				ifEmptyString: null,
				only: [0, 1],
			}).applyTo(0)
		).toEqual(0);

		expect(
			vs.enumerate<StringUnion>({
				ifEmptyString: null,
				only: ["a", "b"],
			}).applyTo("a")
		).toEqual("a");

		expect(
			vs.enumerate<NumberAndStringUnion>({
				ifEmptyString: null,
				only: [0, 1, "a", "b"],
			}).applyTo(0)
		).toEqual(0);
		expect(
			vs.enumerate<NumberAndStringUnion>({
				ifEmptyString: null,
				only: [0, 1, "a", "b"],
			}).applyTo("a")
		).toEqual("a");
	});

	it("should be adjusted (enum)", () =>
	{
		expect(
			vs.enumerate({
				ifEmptyString: null,
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo("")
		).toEqual(null);

		expect(
			vs.enumerate({
				ifEmptyString: null,
				only: Object.values(StringEnum),
			}).applyTo("")
		).toEqual(null);

		expect(
			vs.enumerate({
				ifEmptyString: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo("")
		).toEqual(null);
	});
	it("should be adjusted (union)", () =>
	{
		expect(
			vs.enumerate<NumberUnion>({
				ifEmptyString: null,
				only: [0, 1],
			}).applyTo("")
		).toEqual(null);

		expect(
			vs.enumerate<StringUnion>({
				ifEmptyString: null,
				only: ["a", "b"],
			}).applyTo("")
		).toEqual(null);

		expect(
			vs.enumerate<NumberAndStringUnion>({
				ifEmptyString: null,
				only: [0, 1, "a", "b"],
			}).applyTo("")
		).toEqual(null);
	});

	it("should cause error(s) (enum)", () =>
	{
		expect(() =>
		{
			vs.enumerate({
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo("");
		}).toThrow(vs.CAUSE.EMPTY_STRING);

		expect(() =>
		{
			vs.enumerate({
				only: Object.values(StringEnum),
			}).applyTo("");
		}).toThrow(vs.CAUSE.EMPTY_STRING);

		expect(() =>
		{
			vs.enumerate({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo("");
		}).toThrow(vs.CAUSE.EMPTY_STRING);
	});
	it("should cause error(s) (union)", () =>
	{
		expect(() =>
		{
			vs.enumerate<NumberUnion>({
				only: [0, 1],
			}).applyTo("");
		}).toThrow(vs.CAUSE.EMPTY_STRING);

		expect(() =>
		{
			vs.enumerate<StringUnion>({
				only: ["a", "b"],
			}).applyTo("");
		}).toThrow(vs.CAUSE.EMPTY_STRING);

		expect(() =>
		{
			vs.enumerate<NumberAndStringUnion>({
				only: [0, 1, "a", "b"],
			}).applyTo("");
		}).toThrow(vs.CAUSE.EMPTY_STRING);
	});
}

/**
 * only
 */
function testOnly(): void
{
	it("should be OK (enum)", () =>
	{
		expect(
			vs.enumerate({
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(0)
		).toEqual(0);
		expect(
			vs.enumerate({
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(1)
		).toEqual(1);

		expect(
			vs.enumerate({
				only: Object.values(StringEnum),
			}).applyTo("a")
		).toEqual("a");
		expect(
			vs.enumerate({
				only: Object.values(StringEnum),
			}).applyTo("b")
		).toEqual("b");

		expect(
			vs.enumerate({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(0)
		).toEqual(0);
		expect(
			vs.enumerate({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(1)
		).toEqual(1);
		expect(
			vs.enumerate({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo("a")
		).toEqual("a");
		expect(
			vs.enumerate({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo("b")
		).toEqual("b");
	});
	it("should be OK (union)", () =>
	{
		expect(
			vs.enumerate<NumberUnion>({
				only: [0, 1],
			}).applyTo(0)
		).toEqual(0);
		expect(
			vs.enumerate<NumberUnion>({
				only: [0, 1],
			}).applyTo(1)
		).toEqual(1);

		expect(
			vs.enumerate<StringUnion>({
				only: ["a", "b"],
			}).applyTo("a")
		).toEqual("a");
		expect(
			vs.enumerate<StringUnion>({
				only: ["a", "b"],
			}).applyTo("b")
		).toEqual("b");

		expect(
			vs.enumerate<NumberAndStringUnion>({
				only: [0, 1, "a", "b"],
			}).applyTo(0)
		).toEqual(0);
		expect(
			vs.enumerate<NumberAndStringUnion>({
				only: [0, 1, "a", "b"],
			}).applyTo(1)
		).toEqual(1);
		expect(
			vs.enumerate<NumberAndStringUnion>({
				only: [0, 1, "a", "b"],
			}).applyTo("a")
		).toEqual("a");
		expect(
			vs.enumerate<NumberAndStringUnion>({
				only: [0, 1, "a", "b"],
			}).applyTo("b")
		).toEqual("b");
	});

	it("should cause error(s) (enum)", () =>
	{
		expect(() =>
		{
			vs.enumerate({
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(2);
		}).toThrow(vs.CAUSE.ONLY);

		expect(() =>
		{
			vs.enumerate({
				only: Object.values(StringEnum),
			}).applyTo("c");
		}).toThrow(vs.CAUSE.ONLY);

		expect(() =>
		{
			vs.enumerate({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo("x");
		}).toThrow(vs.CAUSE.ONLY);
	});
	it("should cause error(s) (union)", () =>
	{
		expect(() =>
		{
			vs.enumerate<NumberUnion>({
				only: [0, 1],
			}).applyTo(2);
		}).toThrow(vs.CAUSE.ONLY);

		expect(() =>
		{
			vs.enumerate<StringUnion>({
				only: ["a", "b"],
			}).applyTo("c");
		}).toThrow(vs.CAUSE.ONLY);

		expect(() =>
		{
			vs.enumerate<NumberAndStringUnion>({
				only: [0, 1, "a", "b"],
			}).applyTo("x");
		}).toThrow(vs.CAUSE.ONLY);
	});
}
