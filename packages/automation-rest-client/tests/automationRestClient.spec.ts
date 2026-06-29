// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IAutomationActionEntry } from "@twin.org/automation-models";
import { GuardError } from "@twin.org/core";
import { HttpMethod } from "@twin.org/web";
import { AutomationRestClient } from "../src/automationRestClient.js";
import {
	createdResponse,
	jsonResponse,
	noContentResponse,
	setupFetchMock,
	teardownFetchMock
} from "./helpers/restClientTestHelpers.js";

// OpenAPI spec: ../../automation-service/docs/open-api/spec.json
const ENDPOINT = "http://localhost:8080";
const PREFIX = "automation";

const ACTION_ID = "action-001";
const ACTION_TYPE = "send-email";
const TRIGGER = "on-document-created";
const LOCATION = `${ENDPOINT}/${PREFIX}/${ACTION_ID}`;

const TEST_ACTION_ENTRY: IAutomationActionEntry = {
	id: ACTION_ID,
	actionType: ACTION_TYPE,
	trigger: TRIGGER,
	configuration: { recipient: "test@example.com" }
};

const TEST_ACTION_ENTRY_2: IAutomationActionEntry = {
	id: "action-002",
	actionType: "webhook",
	trigger: "on-document-updated"
};

const TEST_ACTIONS_QUERY_RESPONSE = {
	entries: [TEST_ACTION_ENTRY, TEST_ACTION_ENTRY_2]
};

const TEST_ACTIONS_QUERY_RESPONSE_WITH_CURSOR = {
	entries: [TEST_ACTION_ENTRY],
	cursor: "next-page-cursor"
};

const fetchMock = vi.fn();

describe("AutomationRestClient", () => {
	let client: AutomationRestClient;

	beforeEach(() => {
		setupFetchMock(fetchMock);
		client = new AutomationRestClient({ endpoint: ENDPOINT });
	});

	afterEach(() => {
		teardownFetchMock(fetchMock);
	});

	describe("actionCreate", () => {
		test("throws when actionType is empty", async () => {
			await expect(client.actionCreate("", TRIGGER)).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("throws when trigger is empty", async () => {
			await expect(client.actionCreate(ACTION_TYPE, "")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends POST to /{prefix}", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));

			await client.actionCreate(ACTION_TYPE, TRIGGER);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}`);
			expect(options.method).toBe(HttpMethod.POST);
		});

		test("sends actionType and trigger in the request body", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));

			await client.actionCreate(ACTION_TYPE, TRIGGER);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.actionType).toBe(ACTION_TYPE);
			expect(body.trigger).toBe(TRIGGER);
		});

		test("sends configuration in the request body when provided", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));
			const config = { recipient: "test@example.com", subject: "Hello" };

			await client.actionCreate(ACTION_TYPE, TRIGGER, config);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.configuration).toEqual(config);
		});

		test("sends undefined configuration in the request body when not provided", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));

			await client.actionCreate(ACTION_TYPE, TRIGGER);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.configuration).toBeUndefined();
		});

		test("returns the Location header value as the new action id", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));

			const result = await client.actionCreate(ACTION_TYPE, TRIGGER);

			expect(result).toBe(LOCATION);
		});
	});

	describe("actionRemove", () => {
		test("throws when actionId is empty", async () => {
			await expect(client.actionRemove("")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends DELETE to /{prefix}/:actionId", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await client.actionRemove(ACTION_ID);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/${ACTION_ID}`);
			expect(options.method).toBe(HttpMethod.DELETE);
		});

		test("resolves without a return value", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			const result = await client.actionRemove(ACTION_ID);

			expect(result).toBeUndefined();
		});
	});

	describe("actionGet", () => {
		test("throws when actionId is empty", async () => {
			await expect(client.actionGet("")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends GET to /{prefix}/:actionId", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_ACTION_ENTRY));

			await client.actionGet(ACTION_ID);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/${ACTION_ID}`);
			expect(options.method).toBe(HttpMethod.GET);
		});

		test("returns the action entry from the response body", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_ACTION_ENTRY));

			const result = await client.actionGet(ACTION_ID);

			expect(result).toEqual(TEST_ACTION_ENTRY);
		});
	});

	describe("actionsQuery", () => {
		test("sends GET to /{prefix}", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_ACTIONS_QUERY_RESPONSE));

			await client.actionsQuery();

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}`);
			expect(options.method).toBe(HttpMethod.GET);
		});

		test("includes trigger as a query parameter when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_ACTIONS_QUERY_RESPONSE));

			await client.actionsQuery({ trigger: TRIGGER });

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain(`trigger=${encodeURIComponent(TRIGGER)}`);
		});

		test("includes actionType as a query parameter when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_ACTIONS_QUERY_RESPONSE));

			await client.actionsQuery({ actionType: ACTION_TYPE });

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain(`actionType=${encodeURIComponent(ACTION_TYPE)}`);
		});

		test("includes cursor as a query parameter when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_ACTIONS_QUERY_RESPONSE));

			await client.actionsQuery(undefined, "page1");

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain("cursor=page1");
		});

		test("includes limit as a query parameter when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_ACTIONS_QUERY_RESPONSE));

			await client.actionsQuery(undefined, undefined, 10);

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain("limit=10");
		});

		test("returns the entries from the response body", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_ACTIONS_QUERY_RESPONSE));

			const result = await client.actionsQuery();

			expect(result.entries).toEqual(TEST_ACTIONS_QUERY_RESPONSE.entries);
		});

		test("returns undefined cursor when not present in response body", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_ACTIONS_QUERY_RESPONSE));

			const result = await client.actionsQuery();

			expect(result.cursor).toBeUndefined();
		});

		test("returns cursor when present in response body", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_ACTIONS_QUERY_RESPONSE_WITH_CURSOR));

			const result = await client.actionsQuery();

			expect(result.cursor).toBe("next-page-cursor");
		});
	});

	describe("trigger", () => {
		test("throws when trigger is empty", async () => {
			await expect(client.trigger("")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringEmpty"
			});
		});

		test("sends POST to /{prefix}/trigger/:trigger", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await client.trigger(TRIGGER);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/trigger/${TRIGGER}`);
			expect(options.method).toBe(HttpMethod.POST);
		});

		test("sends data in the request body when provided", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());
			const triggerData = { documentId: "doc-001", eventType: "created" };

			await client.trigger(TRIGGER, triggerData);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.data).toEqual(triggerData);
		});

		test("sends undefined data in the request body when not provided", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await client.trigger(TRIGGER);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.data).toBeUndefined();
		});

		test("resolves without a return value", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			const result = await client.trigger(TRIGGER);

			expect(result).toBeUndefined();
		});
	});
});
