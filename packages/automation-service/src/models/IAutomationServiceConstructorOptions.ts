// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IAutomationServiceConfig } from "./IAutomationServiceConfig.js";

/**
 * Options for the automation Service constructor.
 */
export interface IAutomationServiceConstructorOptions {
	/**
	 * The type of the logging component.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * The entity storage for the automation action entries.
	 * @default automation-action-entry
	 */
	automationActionEntryStorageType?: string;

	/**
	 * The configuration for the service.
	 */
	config?: IAutomationServiceConfig;
}
