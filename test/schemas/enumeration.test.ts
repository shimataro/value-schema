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
		{
			const val: NumberEnum | null = vs.enumeration({
				ifUndefined: null,
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(0);
			expect(val).toEqual(0);
		}
		{
			const val: StringEnum | null = vs.enumeration({
				ifUndefined: null,
				only: Object.values(StringEnum), // string elements can be extracted by "Object.values()"
			}).applyTo("a");
			expect(val).toEqual("a");
		}
		{
			const val: NumberAndStringEnum | null = vs.enumeration({
				ifUndefined: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(0);
			expect(val).toEqual(0);
		}
		{
			// "as const" version
			const val: NumberAndStringEnum | null = vs.enumeration({
				ifUndefined: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b] as const,
			}).applyTo("a");
			expect(val).toEqual("a");
		}
	});
	it("should be OK (union)", () =>
	{
		{
			const val: NumberUnion | null = vs.enumeration({
				ifUndefined: null,
				only: [0, 1] as const,
			}).applyTo(0);
			expect(val).toEqual(0);
		}
		{
			const val: StringUnion | null = vs.enumeration({
				ifUndefined: null,
				only: ["a", "b"] as const,
			}).applyTo("a");
			expect(val).toEqual("a");
		}
		{
			const val: NumberAndStringUnion | null = vs.enumeration({
				ifUndefined: null,
				only: [0, 1, "a", "b"] as const,
			}).applyTo(0);
			expect(val).toEqual(0);
		}
		{
			// generics version
			const val: NumberAndStringUnion | null = vs.enumeration<NumberAndStringUnion>({
				ifUndefined: null,
				only: [0, 1, "a", "b"],
			}).applyTo("a");
			expect(val).toEqual("a");
		}
	});

	it("should be adjusted (enum)", () =>
	{
		{
			const val: NumberEnum | null = vs.enumeration({
				ifUndefined: null,
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(undefined);
			expect(val).toEqual(null);
		}
		{
			const val: StringEnum | null = vs.enumeration({
				ifUndefined: null,
				only: Object.values(StringEnum),
			}).applyTo(undefined);
			expect(val).toEqual(null);
		}
		{
			const val: NumberAndStringEnum | null = vs.enumeration({
				ifUndefined: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(undefined);
			expect(val).toEqual(null);
		}
	});
	it("should be adjusted (union)", () =>
	{
		{
			const val: NumberUnion | null = vs.enumeration({
				ifUndefined: null,
				only: [0, 1] as const,
			}).applyTo(undefined);
			expect(val).toEqual(null);
		}
		{
			const val: StringUnion | null = vs.enumeration({
				ifUndefined: null,
				only: ["a", "b"] as const,
			}).applyTo(undefined);
			expect(val).toEqual(null);
		}
		{
			const val: NumberAndStringUnion | null = vs.enumeration({
				ifUndefined: null,
				only: [0, 1, "a", "b"] as const,
			}).applyTo(undefined);
			expect(val).toEqual(null);
		}
	});

	it("should cause error(s) (enum)", () =>
	{
		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: NumberEnum = vs.enumeration({
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(undefined);
		}).toThrow(vs.CAUSE.UNDEFINED);

		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: StringEnum = vs.enumeration({
				only: Object.values(StringEnum),
			}).applyTo(undefined);
		}).toThrow(vs.CAUSE.UNDEFINED);

		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: NumberAndStringEnum = vs.enumeration({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(undefined);
		}).toThrow(vs.CAUSE.UNDEFINED);
	});
	it("should cause error(s) (union)", () =>
	{
		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: NumberUnion = vs.enumeration({
				only: [0, 1] as const,
			}).applyTo(undefined);
		}).toThrow(vs.CAUSE.UNDEFINED);

		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: StringUnion = vs.enumeration({
				only: ["a", "b"] as const,
			}).applyTo(undefined);
		}).toThrow(vs.CAUSE.UNDEFINED);

		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: NumberAndStringUnion = vs.enumeration({
				only: [0, 1, "a", "b"] as const,
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
		{
			const val: NumberEnum | null = vs.enumeration({
				ifNull: null,
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(0);
			expect(val).toEqual(0);
		}
		{
			const val: StringEnum | null = vs.enumeration({
				ifNull: null,
				only: Object.values(StringEnum),
			}).applyTo("a");
			expect(val).toEqual("a");
		}
		{
			const val: NumberAndStringEnum | null = vs.enumeration({
				ifNull: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(0);
			expect(val).toEqual(0);
		}
		{
			// "as const" version
			const val: NumberAndStringEnum | null = vs.enumeration({
				ifNull: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b] as const,
			}).applyTo("a");
			expect(val).toEqual("a");
		}
	});
	it("should be OK (union)", () =>
	{
		{
			const val: NumberUnion | null = vs.enumeration({
				ifNull: null,
				only: [0, 1] as const,
			}).applyTo(0);
			expect(val).toEqual(0);
		}
		{
			const val: StringUnion | null = vs.enumeration({
				ifNull: null,
				only: ["a", "b"] as const,
			}).applyTo("a");
			expect(val).toEqual("a");
		}
		{
			const val: NumberAndStringUnion | null = vs.enumeration({
				ifNull: null,
				only: [0, 1, "a", "b"] as const,
			}).applyTo(0);
			expect(val).toEqual(0);
		}
		{
			// generics version
			const val: NumberAndStringUnion | null = vs.enumeration<NumberAndStringUnion>({
				ifNull: null,
				only: [0, 1, "a", "b"],
			}).applyTo("a");
			expect(val).toEqual("a");
		}
	});

	it("should be adjusted (enum)", () =>
	{
		{
			const val: NumberEnum | null = vs.enumeration({
				ifNull: null,
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(null);
			expect(val).toEqual(null);
		}
		{
			const val: StringEnum | null = vs.enumeration({
				ifNull: null,
				only: Object.values(StringEnum),
			}).applyTo(null);
			expect(val).toEqual(null);
		}
		{
			const val: NumberAndStringEnum | null = vs.enumeration({
				ifNull: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(null);
			expect(val).toEqual(null);
		}
	});
	it("should be adjusted (union)", () =>
	{
		{
			const val: NumberUnion | null = vs.enumeration({
				ifNull: null,
				only: [0, 1] as const,
			}).applyTo(null);
			expect(val).toEqual(null);
		}
		{
			const val: StringUnion | null = vs.enumeration({
				ifNull: null,
				only: ["a", "b"] as const,
			}).applyTo(null);
			expect(val).toEqual(null);
		}
		{
			const val: NumberAndStringUnion | null = vs.enumeration({
				ifNull: null,
				only: [0, 1, "a", "b"] as const,
			}).applyTo(null);
			expect(val).toEqual(null);
		}
	});

	it("should cause error(s) (enum)", () =>
	{
		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: NumberEnum = vs.enumeration({
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(null);
		}).toThrow(vs.CAUSE.NULL);

		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: StringEnum = vs.enumeration({
				only: Object.values(StringEnum),
			}).applyTo(null);
		}).toThrow(vs.CAUSE.NULL);

		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: NumberAndStringEnum = vs.enumeration({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(null);
		}).toThrow(vs.CAUSE.NULL);
	});
	it("should cause error(s) (union)", () =>
	{
		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: NumberUnion = vs.enumeration({
				only: [0, 1] as const,
			}).applyTo(null);
		}).toThrow(vs.CAUSE.NULL);

		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: StringUnion = vs.enumeration({
				only: ["a", "b"] as const,
			}).applyTo(null);
		}).toThrow(vs.CAUSE.NULL);

		expect(() =>
		{
			// generics version
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: NumberAndStringUnion = vs.enumeration<NumberAndStringUnion>({
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
		{
			const val: NumberEnum | null = vs.enumeration({
				ifEmptyString: null,
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(0);
			expect(val).toEqual(0);
		}
		{
			const val: StringEnum | null = vs.enumeration({
				ifEmptyString: null,
				only: Object.values(StringEnum), // string elements can be extracted by "Object.values()"
			}).applyTo("a");
			expect(val).toEqual("a");
		}
		{
			const val: NumberAndStringEnum | null = vs.enumeration({
				ifEmptyString: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(0);
			expect(val).toEqual(0);
		}
		{
			// "as const" version
			const val: NumberAndStringEnum | null = vs.enumeration({
				ifEmptyString: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b] as const,
			}).applyTo("a");
			expect(val).toEqual("a");
		}
	});
	it("should be OK (union)", () =>
	{
		{
			const val: NumberUnion | null = vs.enumeration({
				ifEmptyString: null,
				only: [0, 1] as const,
			}).applyTo(0);
			expect(val).toEqual(0);
		}
		{
			const val: StringUnion | null = vs.enumeration({
				ifEmptyString: null,
				only: ["a", "b"] as const,
			}).applyTo("a");
			expect(val).toEqual("a");
		}
		{
			const val: NumberAndStringUnion | null = vs.enumeration({
				ifEmptyString: null,
				only: [0, 1, "a", "b"] as const,
			}).applyTo(0);
			expect(val).toEqual(0);
		}
		{
			// generics version
			const val: NumberAndStringUnion | null = vs.enumeration<NumberAndStringUnion>({
				ifEmptyString: null,
				only: [0, 1, "a", "b"],
			}).applyTo("a");
			expect(val).toEqual("a");
		}
	});

	it("should be adjusted (enum)", () =>
	{
		{
			const val: NumberEnum | null = vs.enumeration({
				ifEmptyString: null,
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo("");
			expect(val).toEqual(null);
		}
		{
			const val: StringEnum | null = vs.enumeration({
				ifEmptyString: null,
				only: Object.values(StringEnum),
			}).applyTo("");
			expect(val).toEqual(null);
		}
		{
			const val: NumberAndStringEnum | null = vs.enumeration({
				ifEmptyString: null,
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo("");
			expect(val).toEqual(null);
		}
	});
	it("should be adjusted (union)", () =>
	{
		{
			const val: NumberUnion | null = vs.enumeration({
				ifEmptyString: null,
				only: [0, 1] as const,
			}).applyTo("");
			expect(val).toEqual(null);
		}
		{
			const val: StringUnion | null = vs.enumeration({
				ifEmptyString: null,
				only: ["a", "b"] as const,
			}).applyTo("");
			expect(val).toEqual(null);
		}
		{
			const val: NumberAndStringUnion | null = vs.enumeration({
				ifEmptyString: null,
				only: [0, 1, "a", "b"] as const,
			}).applyTo("");
			expect(val).toEqual(null);
		}
	});

	it("should cause error(s) (enum)", () =>
	{
		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: NumberEnum = vs.enumeration({
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo("");
		}).toThrow(vs.CAUSE.EMPTY_STRING);

		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: StringEnum = vs.enumeration({
				only: Object.values(StringEnum),
			}).applyTo("");
		}).toThrow(vs.CAUSE.EMPTY_STRING);

		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: NumberAndStringEnum = vs.enumeration({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo("");
		}).toThrow(vs.CAUSE.EMPTY_STRING);
	});
	it("should cause error(s) (union)", () =>
	{
		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: NumberUnion = vs.enumeration({
				only: [0, 1] as const,
			}).applyTo("");
		}).toThrow(vs.CAUSE.EMPTY_STRING);

		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: StringUnion = vs.enumeration({
				only: ["a", "b"] as const,
			}).applyTo("");
		}).toThrow(vs.CAUSE.EMPTY_STRING);

		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: NumberAndStringUnion = vs.enumeration({
				only: [0, 1, "a", "b"] as const,
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
		{
			const val: NumberEnum = vs.enumeration({
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(0);
			expect(val).toEqual(0);
		}
		{
			const val: NumberEnum = vs.enumeration({
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(1);
			expect(val).toEqual(1);
		}

		{
			const val: StringEnum = vs.enumeration({
				only: Object.values(StringEnum),
			}).applyTo("a");
			expect(val).toEqual("a");
		}
		{
			const val: StringEnum = vs.enumeration({
				only: Object.values(StringEnum),
			}).applyTo("b");
			expect(val).toEqual("b");
		}

		{
			const val: NumberAndStringEnum = vs.enumeration({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(0);
			expect(val).toEqual(0);
		}
		{
			const val: NumberAndStringEnum = vs.enumeration({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(1);
			expect(val).toEqual(1);
		}
		{
			const val: NumberAndStringEnum = vs.enumeration({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo("a");
			expect(val).toEqual("a");
		}
		{
			const val: NumberAndStringEnum = vs.enumeration({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo("b");
			expect(val).toEqual("b");
		}
	});
	it("should be OK (union)", () =>
	{
		{
			const val: NumberUnion = vs.enumeration({
				only: [0, 1] as const,
			}).applyTo(0);
			expect(val).toEqual(0);
		}
		{
			const val: NumberUnion = vs.enumeration({
				only: [0, 1] as const,
			}).applyTo(1);
			expect(val).toEqual(1);
		}

		{
			const val: StringUnion = vs.enumeration({
				only: ["a", "b"] as const,
			}).applyTo("a");
			expect(val).toEqual("a");
		}
		{
			const val: StringUnion = vs.enumeration({
				only: ["a", "b"] as const,
			}).applyTo("b");
			expect(val).toEqual("b");
		}

		{
			const val: NumberAndStringUnion = vs.enumeration({
				only: [0, 1, "a", "b"] as const,
			}).applyTo(0);
			expect(val).toEqual(0);
		}
		{
			const val: NumberAndStringUnion = vs.enumeration({
				only: [0, 1, "a", "b"] as const,
			}).applyTo(1);
			expect(val).toEqual(1);
		}
		{
			// generics version
			const val: NumberAndStringUnion = vs.enumeration<NumberAndStringUnion>({
				only: [0, 1, "a", "b"],
			}).applyTo("a");
			expect(val).toEqual("a");
		}
		{
			// generics version
			const val: NumberAndStringUnion = vs.enumeration<NumberAndStringUnion>({
				only: [0, 1, "a", "b"],
			}).applyTo("b");
			expect(val).toEqual("b");
		}

		{
			const only = [0, 1] as const;
			const val: NumberUnion = vs.enumeration({
				only: only,
			}).applyTo(1);
			expect(val).toEqual(1);
		}
	});

	it("should cause error(s) (enum)", () =>
	{
		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: NumberEnum = vs.enumeration({
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(2);
		}).toThrow(vs.CAUSE.ONLY);

		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: StringEnum = vs.enumeration({
				only: Object.values(StringEnum),
			}).applyTo("c");
		}).toThrow(vs.CAUSE.ONLY);

		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: NumberAndStringEnum = vs.enumeration({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo("x");
		}).toThrow(vs.CAUSE.ONLY);
	});
	it("should cause error(s) (union)", () =>
	{
		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: NumberUnion = vs.enumeration({
				only: [0, 1] as const,
			}).applyTo(2);
		}).toThrow(vs.CAUSE.ONLY);

		expect(() =>
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: StringUnion = vs.enumeration({
				only: ["a", "b"] as const,
			}).applyTo("c");
		}).toThrow(vs.CAUSE.ONLY);

		expect(() =>
		{
			// generics version
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore TS6133: 'val' is declared but its value is never read.
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const val: NumberAndStringUnion = vs.enumeration<NumberAndStringUnion>({
				only: [0, 1, "a", "b"],
			}).applyTo("x");
		}).toThrow(vs.CAUSE.ONLY);
	});
}
