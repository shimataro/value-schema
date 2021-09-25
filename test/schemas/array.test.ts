import vs from "value-schema";

{
	describe("type", testType);
	describe("ifUndefined", testIfUndefined);
	describe("ifNull", testIfNull);
	describe("ifEmptyString", testIfEmptyString);
	describe("separatedBy", testSeparatedBy);
	describe("toArray", testToArray);
	describe("minLength", testMinLength);
	describe("maxLength", testMaxLength);
	describe("converter", testConverter);
	describe("number", testNumber);
	describe("string", testString);
}

/**
 * type
 */
function testType(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.array().applyTo([])
		).toEqual([]);

		expect(
			vs.array().applyTo([1, 2])
		).toEqual([1, 2]);

		expect(
			vs.array().applyTo(["a", "b"])
		).toEqual(["a", "b"]);

		expect(
			vs.array().applyTo([1, "a"])
		).toEqual([1, "a"]);
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
			vs.array({
				ifUndefined: [1, "a"],
			}).applyTo(undefined)
		).toEqual([1, "a"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.array().applyTo(undefined);
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
			vs.array({
				ifNull: [1, "a"],
			}).applyTo(null)
		).toEqual([1, "a"]);

		expect(
			vs.array({
				ifNull: null,
			}).applyTo(null)
		).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.array().applyTo(null);
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
			vs.array({
				ifEmptyString: [1, "a"],
			}).applyTo("")
		).toEqual([1, "a"]);

		expect(
			vs.array({
				ifEmptyString: null,
			}).applyTo("")
		).toEqual(null);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.array().applyTo("");
		}).toThrow(vs.CAUSE.EMPTY_STRING);
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
			vs.array({
				separatedBy: ",",
			}).applyTo("1,a")
		).toEqual(["1", "a"]);
	});
}

/**
 * convert to array
 */
function testToArray(): void
{
	it("should be adjusted", () =>
	{
		expect(
			vs.array({
				toArray: true,
			}).applyTo("abc")
		).toEqual(["abc"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.array().applyTo("abc");
		}).toThrow(vs.CAUSE.TYPE);
	});
}

/**
 * minimum length of elements
 */
function testMinLength(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.array({
				minLength: 1,
			}).applyTo(["a"])
		).toEqual(["a"]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.array({
				minLength: 1,
			}).applyTo([]);
		}).toThrow(vs.CAUSE.MIN_LENGTH);
	});
}

/**
 * maximum length of elements
 */
function testMaxLength(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.array({
				maxLength: 1,
			}).applyTo([1])
		).toEqual([1]);

		expect(
			vs.array({
				maxLength: {
					length: 1,
					trims: true,
				},
			}).applyTo([1])
		).toEqual([1]);
	});
	it("should be adjusted", () =>
	{
		expect(
			vs.array({
				maxLength: {
					length: 1,
					trims: true,
				},
			}).applyTo([1, 2])
		).toEqual([1]);
	});
	it("should cause error(s)", () =>
	{
		expect(() =>
		{
			vs.array({
				maxLength: 1,
			}).applyTo([1, 2]);
		}).toThrow(vs.CAUSE.MAX_LENGTH);
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
			vs.array({
				each: vs.number(),
				separatedBy: ",",
				converter: (values) =>
				{
					return values.sort();
				},
			}).applyTo("4,1,5,2")
		).toEqual([1, 2, 4, 5]);
	});
}

/**
 * array of number
 */
function testNumber(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.array({
				each: vs.number(),
			}).applyTo([3.14, 2.71])
		).toEqual([3.14, 2.71]);

		expect(
			vs.array({
				each: vs.number({
					integer: true,
				}),
			}).applyTo([1, 2, 3])
		).toEqual([1, 2, 3]);

		expect(
			vs.array({
				each: vs.number({
					only: [1, 2, 3],
				}),
			}).applyTo([1, 2, 3])
		).toEqual([1, 2, 3]);

		expect(
			vs.array({
				each: vs.number({
					minValue: 10,
				}),
			}).applyTo([10, 11, 12])
		).toEqual([10, 11, 12]);

		expect(
			vs.array({
				each: vs.number({
					maxValue: 10,
				}),
			}).applyTo([8, 9, 10])
		).toEqual([8, 9, 10]);
	});
	it("should be adjusted", () =>
	{
		expect(
			vs.array({
				each: vs.number(),
			}).applyTo([false, true, 2, "+3", "-4"])
		).toEqual([0, 1, 2, 3, -4]);

		expect(
			vs.array({
				each: {
					schema: vs.number(),
					ignoresErrors: true,
				},
			}).applyTo([false, "abc", true, "+2"])
		).toEqual([0, 1, 2]);

		expect(
			vs.array({
				separatedBy: ",",
				each: vs.number(),
			}).applyTo("1,2,3")
		).toEqual([1, 2, 3]);

		expect(
			vs.array({
				each: vs.number({
					ifUndefined: 999,
				}),
			}).applyTo(["1", undefined, 3])
		).toEqual([1, 999, 3]);

		expect(
			vs.array({
				each: vs.number({
					ifNull: 999,
				}),
			}).applyTo(["1", null, 3])
		).toEqual([1, 999, 3]);

		expect(
			vs.array({
				each: vs.number({
					ifEmptyString: 999,
				}),
			}).applyTo(["1", "", 3])
		).toEqual([1, 999, 3]);

		expect(
			vs.array({
				each: vs.number({
					acceptsSpecialFormats: true,
				}),
			}).applyTo(["1e+2", "0x100", "0o100", "0b100"])
		).toEqual([100, 256, 64, 4]);

		expect(
			vs.array({
				each: vs.number({
					integer: vs.NUMBER.INTEGER.FLOOR_RZ,
				}),
			}).applyTo([3.14, -3.14, "3.14"])
		).toEqual([3, -3, 3]);

		expect(
			vs.array({
				each: vs.number({
					minValue: {
						value: 10,
						adjusts: true,
					},
				}),
			}).applyTo([9, 10, 11])
		).toEqual([10, 10, 11]);

		expect(
			vs.array({
				each: vs.number({
					maxValue: {
						value: 10,
						adjusts: true,
					},
				}),
			}).applyTo([9, 10, 11])
		).toEqual([9, 10, 10]);
	});

	it("should cause error(s)", () =>
	{
		try
		{
			vs.array({
				each: vs.number(),
			}).applyTo([false, "abc", true, "+2"]);

			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.TYPE);
			expect(err.keyStack).toEqual([1]);
		}
	});
	it("should cause error(s)", () =>
	{
		try
		{
			vs.array({
				each: vs.number(),
			}).applyTo([1, undefined, 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.UNDEFINED);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array({
				each: vs.number(),
			}).applyTo([1, null, 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.NULL);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array({
				each: vs.number(),
			}).applyTo([1, "", 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.EMPTY_STRING);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array({
				each: vs.number({
					ifUndefined: 999,
				}),
			}).applyTo([1, null, 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.NULL);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array({
				each: vs.number({
					ifUndefined: 999,
				}),
			}).applyTo([1, "", 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.EMPTY_STRING);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array({
				each: vs.number({
					ifNull: 999,
				}),
			}).applyTo([1, undefined, 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.UNDEFINED);
			expect(err.keyStack).toEqual([1]);
		}
	});
	it("should cause error(s)", () =>
	{
		try
		{
			vs.array({
				each: vs.number({
					ifNull: 999,
				}),
			}).applyTo([1, "", 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.EMPTY_STRING);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array({
				each: vs.number({
					ifEmptyString: 999,
				}),
			}).applyTo([1, undefined, 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.UNDEFINED);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array({
				each: vs.number({
					ifEmptyString: 999,
				}),
			}).applyTo([1, null, 3]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.NULL);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array({
				each: vs.number(),
			}).applyTo(["1e+2", "0x100", "0o100", "0b100"]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.TYPE);
			expect(err.keyStack).toEqual([0]);
		}

		try
		{
			vs.array({
				each: vs.number({
					integer: true,
				}),
			}).applyTo([3.14]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.TYPE);
			expect(err.keyStack).toEqual([0]);
		}

		try
		{
			vs.array({
				each: vs.number({
					only: [1, 2, 3],
				}),
			}).applyTo([0, 1, 2]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.ONLY);
			expect(err.keyStack).toEqual([0]);
		}
	});
	it("should cause error(s)", () =>
	{
		try
		{
			vs.array({
				each: vs.number({
					minValue: 10,
				}),
			}).applyTo([9, 10, 11]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.MIN_VALUE);
			expect(err.keyStack).toEqual([0]);
		}

		try
		{
			vs.array({
				each: vs.number({
					maxValue: 10,
				}),
			}).applyTo([9, 10, 11]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.MAX_VALUE);
			expect(err.keyStack).toEqual([2]);
		}
	});
}

/**
 * array of string
 */
function testString(): void
{
	it("should be OK", () =>
	{
		expect(
			vs.array({
				each: vs.string({
					only: ["a", "b", "c"],
				}),
			}).applyTo(["a", "b", "c"])
		).toEqual(["a", "b", "c"]);

		expect(
			vs.array({
				each: vs.string({
					minLength: 3,
				}),
			}).applyTo(["abc", "xyz"])
		).toEqual(["abc", "xyz"]);

		expect(
			vs.array({
				each: vs.string({
					maxLength: 3,
				}),
			}).applyTo(["abc", "xyz"])
		).toEqual(["abc", "xyz"]);

		expect(
			vs.array({
				each: vs.string({
					maxLength: {
						length: 3,
						trims: true,
					},
				}),
			}).applyTo(["abc", "xyz"])
		).toEqual(["abc", "xyz"]);

		expect(
			vs.array({
				each: vs.string({
					pattern: /^Go+gle$/,
				}),
			}).applyTo(["Gogle", "Google", "Gooogle"])
		).toEqual(["Gogle", "Google", "Gooogle"]);
	});
	it("should be adjusted", () =>
	{
		expect(
			vs.array({
				each: vs.string(),
			}).applyTo([false, true, 2, "+3", "-4"])
		).toEqual(["false", "true", "2", "+3", "-4"]);

		expect(
			vs.array({
				each: vs.string({
					trims: true,
				}),
			}).applyTo([" a", "b\t", "\rc\n"])
		).toEqual(["a", "b", "c"]);

		expect(
			vs.array({
				each: vs.string({
					only: ["a", "b", "c"],
				}),
			}).applyTo(["a", "b", "c"])
		).toEqual(["a", "b", "c"]);

		expect(
			vs.array({
				each: vs.string({
					maxLength: {
						length: 3,
						trims: true,
					},
				}),
			}).applyTo(["abcd", "xyz0"])
		).toEqual(["abc", "xyz"]);
	});
	it("should cause error(s)", () =>
	{
		try
		{
			vs.array({
				each: vs.string({
					only: ["a", "b", "c"],
				}),
			}).applyTo(["a", "b", "x"]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.ONLY);
			expect(err.keyStack).toEqual([2]);
		}

		try
		{
			vs.array({
				each: vs.string({
					minLength: 3,
				}),
			}).applyTo(["ab", "xy"]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.MIN_LENGTH);
			expect(err.keyStack).toEqual([0]);
		}

		try
		{
			vs.array({
				each: vs.string({
					maxLength: 3,
				}),
			}).applyTo(["abc", "xyz0"]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.MAX_LENGTH);
			expect(err.keyStack).toEqual([1]);
		}

		try
		{
			vs.array({
				each: vs.string({
					pattern: /^Go+gle$/,
				}),
			}).applyTo(["google", "Ggle"]);
			expect(true).toEqual(false);
		}
		catch(err)
		{
			expect(err instanceof vs.ValueSchemaError).toBeTruthy();
			if(!(err instanceof vs.ValueSchemaError))
			{
				return;
			}
			expect(err.cause).toEqual(vs.CAUSE.PATTERN);
			expect(err.keyStack).toEqual([0]);
		}
	});
}
