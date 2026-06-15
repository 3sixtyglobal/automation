// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { AutomationActionFactory } from "@twin.org/automation-models";
import { ComponentFactory, Factory } from "@twin.org/core";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import {
	EntityStorageLoggingConnector,
	initSchema as initSchemaLogging,
	type LogEntry
} from "@twin.org/logging-connector-entity-storage";
import { LoggingConnectorFactory } from "@twin.org/logging-models";
import { LoggingService } from "@twin.org/logging-service";
import { nameof } from "@twin.org/nameof";
import { AutomationService } from "../src/automationService.js";
import type { AutomationActionEntry } from "../src/entities/automationActionEntry.js";
import { initSchema } from "../src/schema.js";

let automationActionEntryEntityStorage: MemoryEntityStorageConnector<AutomationActionEntry>;
let logEntryEntityStorage: MemoryEntityStorageConnector<LogEntry>;
const triggered: { data: unknown; opts: unknown }[] = [];

describe("AutomationService", async () => {
	beforeEach(() => {
		initSchema();
		initSchemaLogging();

		automationActionEntryEntityStorage = new MemoryEntityStorageConnector<AutomationActionEntry>({
			entitySchema: nameof<AutomationActionEntry>(),
			config: { storageKey: "automation-action-entry" }
		});
		EntityStorageConnectorFactory.register(
			"automation-action-entry",
			() => automationActionEntryEntityStorage
		);

		logEntryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>(),
			config: { storageKey: "log-entry" }
		});
		EntityStorageConnectorFactory.register("log-entry", () => logEntryEntityStorage);
		ComponentFactory.register("platform", () => ({
			className: () => "MockPlatform",
			isMultiTenant: () => false,
			execute: async (method: () => Promise<void>) => method()
		}));
		LoggingConnectorFactory.register(
			"logging",
			() =>
				new EntityStorageLoggingConnector({
					config: {
						batchSize: 0,
						batchIntervalMs: 0
					}
				})
		);
		ComponentFactory.register("logging", () => new LoggingService());

		AutomationActionFactory.register("mock-action", (opts: unknown) => ({
			className: () => "MockAction",
			trigger: async (data?: unknown) => {
				triggered.push({ data, opts });
			}
		}));
		AutomationActionFactory.register("fail-action", (opts: unknown) => ({
			className: () => "FailAction",
			trigger: async () => {
				throw new Error("fail");
			}
		}));
	});

	afterEach(async () => {
		Factory.clearFactories();
		await automationActionEntryEntityStorage.teardown();
		await logEntryEntityStorage.teardown();
	});

	test("can create the service", async () => {
		const service = new AutomationService();
		expect(service).toBeDefined();
	});

	test("can add a new automation action", async () => {
		const service = new AutomationService();
		const id = await service.actionCreate("test-action", "test-trigger", { test: "config" });
		expect(id).toBeDefined();

		expect(await automationActionEntryEntityStorage.getStore()).toEqual([
			{
				id: expect.any(String),
				actionType: "test-action",
				trigger: "test-trigger",
				configuration: {
					test: "config"
				}
			}
		]);
	});

	test("can get an automation action by id", async () => {
		const service = new AutomationService();
		const id = await service.actionCreate("get-action", "get-trigger", { foo: "bar" });
		const entry = await service.actionGet(id);
		expect(entry).toEqual({
			id,
			actionType: "get-action",
			trigger: "get-trigger",
			configuration: { foo: "bar" }
		});
	});

	test("throws GeneralError when getting non-existent action", async () => {
		const service = new AutomationService();
		await expect(service.actionGet("does-not-exist")).rejects.toMatchObject({
			name: "GeneralError"
		});
	});

	test("can remove an automation action by id", async () => {
		const service = new AutomationService();
		const id = await service.actionCreate("remove-action", "remove-trigger", { foo: "bar" });
		await service.actionRemove(id);
		expect(await automationActionEntryEntityStorage.getStore()).toEqual([]);
	});

	test("removing non-existent action does not throw", async () => {
		const service = new AutomationService();
		await expect(service.actionRemove("does-not-exist")).resolves.toBeUndefined();
	});

	test("can query actions by trigger and actionType", async () => {
		const service = new AutomationService();
		await service.actionCreate("type1", "trigger1", { a: 1 });
		await service.actionCreate("type2", "trigger2", { b: 2 });
		await service.actionCreate("type1", "trigger2", { c: 3 });

		const { entries } = await service.actionsQuery({ trigger: "trigger2", actionType: "type1" });
		expect(entries).toHaveLength(1);
		expect(entries[0]).toMatchObject({
			actionType: "type1",
			trigger: "trigger2",
			configuration: { c: 3 }
		});
	});

	test("can query actions with no filters (returns all)", async () => {
		const service = new AutomationService();
		await service.actionCreate("type1", "trigger1", { a: 1 });
		await service.actionCreate("type2", "trigger2", { b: 2 });

		const { entries } = await service.actionsQuery(undefined);
		expect(entries).toHaveLength(2);
	});

	test("executes registered action and logs", async () => {
		const service = new AutomationService({ loggingComponentType: "logging" });
		await service.actionCreate("mock-action", "my-trigger", { foo: 42 });
		await service.trigger("my-trigger", { bar: 99 });

		expect(triggered).toEqual([
			{
				data: { bar: 99 },
				opts: { loggingComponentType: "logging", config: { foo: 42 } }
			}
		]);

		const logs = await logEntryEntityStorage.getStore();
		expect(logs.some(l => l.message === "trigger")).toBeTruthy();
		expect(logs.some(l => l.message === "actionTriggered")).toBeTruthy();
	});

	test("logs error if action type not found", async () => {
		const service = new AutomationService({ loggingComponentType: "logging" });
		await service.actionCreate("unknown-action", "missing-trigger");
		await service.trigger("missing-trigger");

		const logs = await logEntryEntityStorage.getStore();
		expect(logs.some(l => l.message === "actionTypeNotFound")).toBeTruthy();
	});

	test("logs error if action trigger throws", async () => {
		const service = new AutomationService({ loggingComponentType: "logging" });
		await service.actionCreate("fail-action", "fail-trigger");
		await service.trigger("fail-trigger");

		const logs = await logEntryEntityStorage.getStore();
		expect(logs.some(l => l.message === "actionFailed")).toBeTruthy();
	});

	test("actionsQuery paginates with cursor and limit", async () => {
		const service = new AutomationService();
		for (let i = 0; i < 5; i++) {
			await service.actionCreate("type", `trigger${i}`, { idx: i });
		}
		const first = await service.actionsQuery(undefined, undefined, 2);
		expect(first.entries).toHaveLength(2);
		expect(first.cursor).toBeDefined();
		const second = await service.actionsQuery(undefined, first.cursor, 2);
		expect(second.entries).toHaveLength(2);
		const third = await service.actionsQuery(undefined, second.cursor, 2);
		expect(third.entries).toHaveLength(1);
	});

	test("trigger executes all matching actions", async () => {
		const service = new AutomationService();
		await service.actionCreate("mock-action", "multi-trigger", { a: 1 });
		await service.actionCreate("mock-action", "multi-trigger", { b: 2 });
		triggered.length = 0;
		await service.trigger("multi-trigger", { foo: "bar" });
		expect(triggered.length).toBe(2);
		const configs = triggered.map(t => (t.opts as { config: unknown }).config);
		expect(configs).toEqual(expect.arrayContaining([{ a: 1 }, { b: 2 }]));
	});

	test("trigger with no matching actions does not throw or log error", async () => {
		const service = new AutomationService({ loggingComponentType: "logging" });
		await service.trigger("no-such-trigger");
		const logs = await logEntryEntityStorage.getStore();
		expect(logs.some(l => l.message === "trigger")).toBeTruthy();
		expect(
			logs.some(l => l.message === "actionTypeNotFound" || l.message === "actionFailed")
		).toBeFalsy();
	});

	test("configuration is propagated to action instance", async () => {
		const service = new AutomationService();
		triggered.length = 0;
		await service.actionCreate("mock-action", "config-trigger", { foo: "bar" });
		await service.trigger("config-trigger");
		expect((triggered[0].opts as { config: unknown }).config).toEqual({ foo: "bar" });
	});
});
