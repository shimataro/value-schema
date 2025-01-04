import {describe, expect, it} from "@jest/globals";
import {hasMapRules} from "../../src/appliers/map";

{
	describe("hasMapRules", testHasMapRules);
}

/**
 * hasMapRules
 */
function testHasMapRules(): void
{
	it("should be truthy", () =>
	{
		expect(hasMapRules({map: "test"})).toBeTruthy();
		expect(hasMapRules({
			map: "test",
			another: 123,
		})).toBeTruthy();
	});
	it("should be falsy", () =>
	{
		expect(hasMapRules(undefined)).toBeFalsy();
		expect(hasMapRules(null)).toBeFalsy();
		expect(hasMapRules(true)).toBeFalsy();
		expect(hasMapRules(1)).toBeFalsy();
		expect(hasMapRules("abc")).toBeFalsy();
		expect(hasMapRules([1, 2, 3])).toBeFalsy();
		expect(hasMapRules({})).toBeFalsy();
		expect(hasMapRules({
			map: undefined,
		})).toBeFalsy();
		expect(hasMapRules({
			map: null,
		})).toBeFalsy();
		expect(hasMapRules({
			map: true,
		})).toBeFalsy();
		expect(hasMapRules({
			map: 1,
		})).toBeFalsy();
		expect(hasMapRules({
			map: [1, 2, 3],
		})).toBeFalsy();
		expect(hasMapRules({
			map: {},
		})).toBeFalsy();
	});
}
