import vs from "value-schema";

{
	describe("type", testType);
	describe("integer", testInteger);
	describe("ifUndefined", testIfUndefined);
	describe("ifNull", testIfNull);
	describe("ifEmptyString", testIfEmptyString);
	describe("only", testOnly);
	describe("minValue", testMinValue);
	describe("maxValue", testMaxValue);
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
			vs.number().applyTo(0)
		).toEqual(0);

		expect(
			vs.number().applyTo(3.14)
		).toEqual(3.14);

		expect(
			vs.number({
				strictType: true,
			}).applyTo(0)
		).toEqual(0);

		expect(
			vs.number({
				strictType: true,
			}).applyTo(3.14)
		).toEqual(3.14);
	});
	it("should be adjusted", () =>
	{
		expect(
			vs.number().applyTo("123")
		).toEqual(123);

		expect(
			vs.number().applyTo("+456")
		).toEqual(456);

		expect(
			vs.number().applyTo("-789")
		).toEqual(-789);

		expect(
			vs.number().applyTo(true)
		).toEqual(1);

		expect(
			vs.number().applyTo(false)
		).toEqual(0);

		expect(
			vs.number({
				acceptsSpecialFormats: true,
			}).applyTo("1e+2")
		).toEqual(100);

		expect(
			vs.number({
				acceptsSpecialFormats: true,
			}).applyTo("0x100")
		).toEqual(256);

		expect(
			vs.number({
				acceptsSpecialFormats: true,
			}).applyTo("0o100")
		).toEqual(64);

		expect(
			vs.number({
				acceptsSpecialFormats: true,
			}).applyTo("0b100")
		).toEqual(4);

		expect(
			vs.number({
				acceptsFullWidth: true,
			}).applyTo("＋１２３４．５")
		).toEqual(1234.5);

		expect(
			vs.number({
				acceptsFullWidth: true,
			}).applyTo("－1２3４．5")
		).toEqual(-1234.5);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.number().applyTo("true");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number().applyTo("false");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number({
				acceptsSpecialFormats: true,
			}).applyTo("true");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number().applyTo("1e+2");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number().applyTo("0x100");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number().applyTo("0o100");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number().applyTo("0b100");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number().applyTo("１２３４．５");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number().applyTo([]);
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number().applyTo({});
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number({
				strictType: true,
			}).applyTo("1");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number({
				strictType: true,
			}).applyTo(true);
		}).toThrow(vs.CAUSE.TYPE);
	});
}

/**
 * integer
 */
function testInteger(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.number({
				integer: false,
			}).applyTo(0)
		).toEqual(0);
		expect(
			vs.number({
				integer: vs.NUMBER.INTEGER.NO,
			}).applyTo(0)
		).toEqual(0);

		expect(
			vs.number({
				integer: false,
			}).applyTo(0.5)
		).toEqual(0.5);

		expect(
			vs.number({
				integer: true,
			}).applyTo(0)
		).toEqual(0);
	});
	describe("rounding", () =>
	{
		it("floor", () =>
		{
			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.FLOOR,
				}).applyTo(3.14)
			).toEqual(3);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.FLOOR,
				}).applyTo("3.14")
			).toEqual(3);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.FLOOR,
				}).applyTo(-3.14)
			).toEqual(-4);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.FLOOR,
				}).applyTo("-3.14")
			).toEqual(-4);
		});

		it("floor (toward zero)", () =>
		{
			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.FLOOR_RZ,
				}).applyTo(3.14)
			).toEqual(3);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.FLOOR_RZ,
				}).applyTo(-3.14)
			).toEqual(-3);
		});

		it("ceil", () =>
		{
			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.CEIL,
				}).applyTo(3.14)
			).toEqual(4);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.CEIL,
				}).applyTo(-3.14)
			).toEqual(-3);
		});

		it("ceil (toward zero)", () =>
		{
			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.CEIL_RI,
				}).applyTo(3.14)
			).toEqual(4);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.CEIL_RI,
				}).applyTo(-3.14)
			).toEqual(-4);
		});

		it("half up", () =>
		{
			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.HALF_UP,
				}).applyTo(3.49)
			).toEqual(3);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.HALF_UP,
				}).applyTo(3.5)
			).toEqual(4);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.HALF_UP,
				}).applyTo(-3.49)
			).toEqual(-3);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.HALF_UP,
				}).applyTo(-3.5)
			).toEqual(-3);
		});

		it("half up (toward zero)", () =>
		{
			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.HALF_UP_RZ,
				}).applyTo(3.49)
			).toEqual(3);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.HALF_UP_RZ,
				}).applyTo(3.5)
			).toEqual(4);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.HALF_UP_RZ,
				}).applyTo(-3.49)
			).toEqual(-3);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.HALF_UP_RZ,
				}).applyTo(-3.5)
			).toEqual(-4);
		});

		it("half down", () =>
		{
			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.HALF_DOWN,
				}).applyTo(3.5)
			).toEqual(3);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.HALF_DOWN,
				}).applyTo(3.51)
			).toEqual(4);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.HALF_DOWN,
				}).applyTo(-3.5)
			).toEqual(-4);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.HALF_DOWN,
				}).applyTo(-3.49)
			).toEqual(-3);
		});

		it("half down (toward zero)", () =>
		{
			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.HALF_DOWN_RZ,
				}).applyTo(3.5)
			).toEqual(3);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.HALF_DOWN_RZ,
				}).applyTo(3.51)
			).toEqual(4);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.HALF_DOWN_RZ,
				}).applyTo(-3.5)
			).toEqual(-3);

			expect(
				vs.number({
					integer: vs.NUMBER.INTEGER.HALF_DOWN_RZ,
				}).applyTo(-3.51)
			).toEqual(-4);
		});
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.number({
				integer: true,
			}).applyTo(3.14);
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number({
				integer: true,
			}).applyTo("3.14");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number({
				integer: true,
			}).applyTo("3.");
		}).toThrow(vs.CAUSE.TYPE);

		expect(() =>
		{
			vs.number({
				integer: -1,
			}).applyTo(0.1);
		}).toThrow(vs.CAUSE.TYPE);
	});
}

/**
 * if undefined
 */
function testIfUndefined(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.number({
				ifUndefined: 10,
			}).applyTo(1)
		).toEqual(1);
	});
	it("should be adjusted", () =>
	{
		expect(
			vs.number({
				ifUndefined: 10,
			}).applyTo(undefined)
		).toEqual(10);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.number().applyTo(undefined);
		}).toThrow(vs.CAUSE.UNDEFINED);
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
			vs.number({
				ifNull: 123,
			}).applyTo(null)
		).toEqual(123);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.number().applyTo(null);
		}).toThrow(vs.CAUSE.NULL);
	});
}

/**
 * if empty string
 */
function testIfEmptyString(): void
{
	it("should be adjusted", () =>
	{
		expect(
			vs.number({
				ifEmptyString: 123,
			}).applyTo("")
		).toEqual(123);

		expect(
			vs.number({
				ifEmptyString: null,
			}).applyTo("")
		).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.number().applyTo("");
		}).toThrow(vs.CAUSE.EMPTY_STRING);
	});
}

/**
 * only
 */
function testOnly(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.number({
				only: [1, 3, 5],
			}).applyTo(1)
		).toEqual(1);

		expect(
			vs.number({
				only: [1, 3, 5],
			}).applyTo(3)
		).toEqual(3);

		expect(
			vs.number({
				only: [1, 3, 5],
			}).applyTo(5)
		).toEqual(5);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.number({
				only: [1, 3, 5],
			}).applyTo(2);
		}).toThrow(vs.CAUSE.ONLY);
	});
}

/**
 * minimum value
 */
function testMinValue(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.number().applyTo(Number.MIN_SAFE_INTEGER)
		).toEqual(Number.MIN_SAFE_INTEGER);
		expect(
			vs.number({
				minValue: 1,
			}).applyTo(10)
		).toEqual(10);
	});
	it("should be adjusted", () =>
	{
		expect(
			vs.number({
				minValue: {
					value: 10,
					adjusts: true,
				},
			}).applyTo(9)
		).toEqual(10);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.number().applyTo(Number.MIN_SAFE_INTEGER - 1);
		}).toThrow(vs.CAUSE.MIN_VALUE);
		expect(() =>
		{
			vs.number({
				minValue: 10,
			}).applyTo(9);
		}).toThrow(vs.CAUSE.MIN_VALUE);
	});
}

/**
 * maximum value
 */
function testMaxValue(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.number().applyTo(Number.MAX_SAFE_INTEGER)
		).toEqual(Number.MAX_SAFE_INTEGER);
		expect(
			vs.number({
				maxValue: 100,
			}).applyTo(100)
		).toEqual(100);
	});
	it("should be adjusted", () =>
	{
		expect(
			vs.number({
				maxValue: {
					value: 100,
					adjusts: true,
				},
			}).applyTo(101)
		).toEqual(100);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.number().applyTo(Number.MAX_SAFE_INTEGER + 1);
		}).toThrow(vs.CAUSE.MAX_VALUE);
		expect(() =>
		{
			vs.number({
				maxValue: 100,
			}).applyTo(101);
		}).toThrow(vs.CAUSE.MAX_VALUE);
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
			vs.number({
				converter: (value) =>
				{
					return value * 2;
				},
			}).applyTo("1")
		).toEqual(2);
	});
}
