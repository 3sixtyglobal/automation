// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { EntitySchemaFactory, EntitySchemaHelper } from "@3sixty/entity";
import { nameof } from "@3sixty/nameof";
import { AutomationActionEntry } from "./entities/automationActionEntry.js";

/**
 * Initialize the schema for the automation service.
 */
export function initSchema(): void {
	EntitySchemaFactory.register(nameof<AutomationActionEntry>(), () =>
		EntitySchemaHelper.getSchema(AutomationActionEntry)
	);
}
