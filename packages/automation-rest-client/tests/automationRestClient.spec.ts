// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { AutomationRestClient } from "../src/automationRestClient.js";

describe("AutomationRestClient", () => {
	test("Can create an instance", async () => {
		const client = new AutomationRestClient({ endpoint: "http://localhost:8080" });
		expect(client).toBeDefined();
	});

	test("actionCreate calls fetch and returns location", async () => {
		const client = new AutomationRestClient({ endpoint: "http://localhost:8080" });
		const location = "action-123";
		client.fetch = vi.fn().mockResolvedValue({ headers: { Location: location, location } });
		const result = await client.actionCreate("typeA", "triggerA", { foo: 1 });
		expect(result).toBe(location);
		expect(client.fetch).toHaveBeenCalledWith(
			"/",
			"POST",
			expect.objectContaining({
				body: expect.objectContaining({
					actionType: "typeA",
					trigger: "triggerA",
					configuration: { foo: 1 }
				})
			})
		);
	});

	test("actionRemove calls fetch with DELETE", async () => {
		const client = new AutomationRestClient({ endpoint: "http://localhost:8080" });
		client.fetch = vi.fn().mockResolvedValue({});
		await client.actionRemove("action-456");
		expect(client.fetch).toHaveBeenCalledWith(
			"/:actionId",
			"DELETE",
			expect.objectContaining({ pathParams: { actionId: "action-456" } })
		);
	});

	test("actionGet calls fetch and returns body", async () => {
		const client = new AutomationRestClient({ endpoint: "http://localhost:8080" });
		const entry = { id: "id1", actionType: "t", trigger: "tr", configuration: { x: 1 } };
		client.fetch = vi.fn().mockResolvedValue({ body: entry });
		const result = await client.actionGet("id1");
		expect(result).toEqual(entry);
		expect(client.fetch).toHaveBeenCalledWith(
			"/:actionId",
			"GET",
			expect.objectContaining({ pathParams: { actionId: "id1" } })
		);
	});

	test("actionsQuery calls fetch and returns entries/cursor", async () => {
		const client = new AutomationRestClient({ endpoint: "http://localhost:8080" });
		const response = { entries: [{ id: "a" }], cursor: "next-cursor" };
		client.fetch = vi.fn().mockResolvedValue({ body: response });
		const result = await client.actionsQuery({ trigger: "t1", actionType: "a1" }, "cur", 5);
		expect(result).toEqual(response);
		expect(client.fetch).toHaveBeenCalledWith(
			"/",
			"GET",
			expect.objectContaining({
				query: expect.objectContaining({
					trigger: "t1",
					actionType: "a1",
					cursor: "cur",
					limit: "5"
				})
			})
		);
	});

	test("trigger calls fetch with correct params", async () => {
		const client = new AutomationRestClient({ endpoint: "http://localhost:8080" });
		client.fetch = vi.fn().mockResolvedValue({});
		await client.trigger("trig", { foo: "bar" });
		expect(client.fetch).toHaveBeenCalledWith(
			"/trigger/:trigger",
			"POST",
			expect.objectContaining({
				pathParams: { trigger: "trig" },
				body: { data: { foo: "bar" } }
			})
		);
	});
});
