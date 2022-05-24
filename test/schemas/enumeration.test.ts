import vs from "value-schema";
import {describe, expect, it} from "@jest/globals";

// enum
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

// const enum
const enum ConstStringEnum
{
	a = "a",
	b = "b",
}

// union
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
			const val: ConstStringEnum | null = vs.enumeration({
				ifUndefined: null,
				only: [ConstStringEnum.a, ConstStringEnum.b],
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
			const val: ConstStringEnum | null = vs.enumeration({
				ifUndefined: null,
				only: [ConstStringEnum.a, ConstStringEnum.b],
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
			const val: NumberEnum = vs.enumeration({
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(undefined);

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.UNDEFINED);

		expect(() =>
		{
			const val: StringEnum = vs.enumeration({
				only: Object.values(StringEnum),
			}).applyTo(undefined);

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.UNDEFINED);

		expect(() =>
		{
			const val: ConstStringEnum = vs.enumeration({
				only: [ConstStringEnum.a, ConstStringEnum.b],
			}).applyTo(undefined);

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.UNDEFINED);

		expect(() =>
		{
			const val: NumberAndStringEnum = vs.enumeration({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(undefined);

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.UNDEFINED);
	});
	it("should cause error(s) (union)", () =>
	{
		expect(() =>
		{
			const val: NumberUnion = vs.enumeration({
				only: [0, 1] as const,
			}).applyTo(undefined);

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.UNDEFINED);

		expect(() =>
		{
			const val: StringUnion = vs.enumeration({
				only: ["a", "b"] as const,
			}).applyTo(undefined);

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.UNDEFINED);

		expect(() =>
		{
			const val: NumberAndStringUnion = vs.enumeration({
				only: [0, 1, "a", "b"] as const,
			}).applyTo(undefined);

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.UNDEFINED);
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
			const val: ConstStringEnum | null = vs.enumeration({
				ifNull: null,
				only: [ConstStringEnum.a, ConstStringEnum.b],
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
			const val: ConstStringEnum | null = vs.enumeration({
				ifNull: null,
				only: [ConstStringEnum.a, ConstStringEnum.b],
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
			const val: NumberEnum = vs.enumeration({
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(null);

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.NULL);

		expect(() =>
		{
			const val: StringEnum = vs.enumeration({
				only: Object.values(StringEnum),
			}).applyTo(null);

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.NULL);

		expect(() =>
		{
			const val: ConstStringEnum = vs.enumeration({
				only: [ConstStringEnum.a, ConstStringEnum.b],
			}).applyTo(null);

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.NULL);

		expect(() =>
		{
			const val: NumberAndStringEnum = vs.enumeration({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo(null);

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.NULL);
	});
	it("should cause error(s) (union)", () =>
	{
		expect(() =>
		{
			const val: NumberUnion = vs.enumeration({
				only: [0, 1] as const,
			}).applyTo(null);

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.NULL);

		expect(() =>
		{
			const val: StringUnion = vs.enumeration({
				only: ["a", "b"] as const,
			}).applyTo(null);

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.NULL);

		expect(() =>
		{
			// generics version
			const val: NumberAndStringUnion = vs.enumeration<NumberAndStringUnion>({
				only: [0, 1, "a", "b"],
			}).applyTo(null);

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.NULL);
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
			const val: ConstStringEnum | null = vs.enumeration({
				ifEmptyString: null,
				only: [ConstStringEnum.a, ConstStringEnum.b],
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
			const val: ConstStringEnum | null = vs.enumeration({
				ifEmptyString: null,
				only: [ConstStringEnum.a, ConstStringEnum.b],
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
			const val: NumberEnum = vs.enumeration({
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo("");

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.EMPTY_STRING);

		expect(() =>
		{
			const val: StringEnum = vs.enumeration({
				only: Object.values(StringEnum),
			}).applyTo("");

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.EMPTY_STRING);

		expect(() =>
		{
			const val: ConstStringEnum = vs.enumeration({
				only: [ConstStringEnum.a, ConstStringEnum.b],
			}).applyTo("");

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.EMPTY_STRING);

		expect(() =>
		{
			const val: NumberAndStringEnum = vs.enumeration({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo("");

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.EMPTY_STRING);
	});
	it("should cause error(s) (union)", () =>
	{
		expect(() =>
		{
			const val: NumberUnion = vs.enumeration({
				only: [0, 1] as const,
			}).applyTo("");

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.EMPTY_STRING);

		expect(() =>
		{
			const val: StringUnion = vs.enumeration({
				only: ["a", "b"] as const,
			}).applyTo("");

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.EMPTY_STRING);

		expect(() =>
		{
			const val: NumberAndStringUnion = vs.enumeration({
				only: [0, 1, "a", "b"] as const,
			}).applyTo("");

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.EMPTY_STRING);
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
			const val: ConstStringEnum = vs.enumeration({
				only: [ConstStringEnum.a, ConstStringEnum.b],
			}).applyTo("a");
			expect(val).toEqual("a");
		}
		{
			const val: ConstStringEnum = vs.enumeration({
				only: [ConstStringEnum.a, ConstStringEnum.b],
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
			const val: NumberEnum = vs.enumeration({
				only: [NumberEnum.zero, NumberEnum.one],
			}).applyTo(2);

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.ONLY);

		expect(() =>
		{
			const val: StringEnum = vs.enumeration({
				only: Object.values(StringEnum),
			}).applyTo("c");

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.ONLY);

		expect(() =>
		{
			const val: ConstStringEnum = vs.enumeration({
				only: [ConstStringEnum.a, ConstStringEnum.b],
			}).applyTo("c");

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.ONLY);

		expect(() =>
		{
			const val: NumberAndStringEnum = vs.enumeration({
				only: [NumberAndStringEnum.zero, NumberAndStringEnum.one, NumberAndStringEnum.a, NumberAndStringEnum.b],
			}).applyTo("x");

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.ONLY);
	});
	it("should cause error(s) (union)", () =>
	{
		expect(() =>
		{
			const val: NumberUnion = vs.enumeration({
				only: [0, 1] as const,
			}).applyTo(2);

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.ONLY);

		expect(() =>
		{
			const val: StringUnion = vs.enumeration({
				only: ["a", "b"] as const,
			}).applyTo("c");

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.ONLY);

		expect(() =>
		{
			const val: NumberAndStringUnion = vs.enumeration<NumberAndStringUnion>({
				only: [0, 1, "a", "b"],
			}).applyTo("x");

			// unreachable
			expect(val).toBeNaN();
		}).toThrow(vs.RULE.ONLY);
	});
}
