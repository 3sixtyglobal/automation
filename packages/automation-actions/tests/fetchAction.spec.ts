// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import { HttpMethod, FetchHelper } from "@twin.org/web";
import { vi } from "vitest";
import { FetchAction } from "../src/fetchAction.js";

describe("fetch-action", () => {
	test("can create the fetch action", () => {
		const action = new FetchAction({ config: { url: "https://example.com" } });
		expect(action).toBeDefined();
	});

	test("returns correct class name", () => {
		const action = new FetchAction({ config: { url: "https://example.com" } });
		expect(action.className()).toBe(FetchAction.CLASS_NAME);
	});

	test("replaces path params in url", async () => {
		const fetchJson = vi.spyOn(FetchHelper, "fetchJson").mockResolvedValue(undefined);
		const action = new FetchAction({
			config: { url: "https://api.com/items/{id}", pathParams: { id: "42" } }
		});
		await action.trigger();
		expect(fetchJson).toHaveBeenCalledWith(
			FetchAction.CLASS_NAME,
			"https://api.com/items/42",
			HttpMethod.GET,
			undefined,
			expect.objectContaining({ headers: undefined })
		);
		fetchJson.mockRestore();
	});

	test("appends query params to url", async () => {
		const fetchJson = vi.spyOn(FetchHelper, "fetchJson").mockResolvedValue(undefined);
		const action = new FetchAction({
			config: { url: "https://api.com/items", query: { foo: "bar", n: "1" } }
		});
		await action.trigger();
		expect(fetchJson).toHaveBeenCalledWith(
			FetchAction.CLASS_NAME,
			expect.stringContaining("foo=bar"),
			HttpMethod.GET,
			undefined,
			expect.objectContaining({ headers: undefined })
		);
		fetchJson.mockRestore();
	});

	test("sends headers and method", async () => {
		const fetchJson = vi.spyOn(FetchHelper, "fetchJson").mockResolvedValue(undefined);
		const action = new FetchAction({
			config: { url: "https://api.com", method: HttpMethod.POST, headers: { "x-test": "1" } }
		});
		await action.trigger({ foo: "bar" });
		expect(fetchJson).toHaveBeenCalledWith(
			FetchAction.CLASS_NAME,
			"https://api.com",
			HttpMethod.POST,
			{ foo: "bar" },
			expect.objectContaining({ headers: { "x-test": "1" } })
		);
		fetchJson.mockRestore();
	});

	test("logs fetch action if logging component exists", async () => {
		const logMock = vi.fn();
		const fakeLogger = {
			log: logMock,
			className: () => "FakeLogger"
		};
		vi.spyOn(ComponentFactory, "getIfExists").mockReturnValue(fakeLogger);
		const fetchJson = vi.spyOn(FetchHelper, "fetchJson").mockResolvedValue(undefined);
		const action = new FetchAction({
			config: { url: "https://api.com" },
			loggingComponentType: "fake"
		});
		await action.trigger({ foo: "bar" });
		expect(logMock).toHaveBeenCalledWith(
			expect.objectContaining({
				source: FetchAction.CLASS_NAME,
				level: "info",
				message: "fetch"
			})
		);
		fetchJson.mockRestore();
	});

	test("combines config payload and trigger data", async () => {
		const fetchJson = vi.spyOn(FetchHelper, "fetchJson").mockResolvedValue(undefined);
		const configPayload = { a: 1, b: 2 };
		const triggerPayload = { b: 3, c: 4 };
		const action = new FetchAction({
			config: {
				url: "https://api.com/merge",
				method: HttpMethod.POST,
				payload: configPayload
			}
		});
		await action.trigger(triggerPayload);
		// config payload should override trigger data for overlapping keys
		expect(fetchJson).toHaveBeenCalledWith(
			FetchAction.CLASS_NAME,
			"https://api.com/merge",
			HttpMethod.POST,
			{ a: 1, b: 2, c: 4 },
			expect.objectContaining({ headers: undefined })
		);
		fetchJson.mockRestore();
	});
});
