// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Interface describing an automation action entry.
 */
export interface IAutomationActionEntry {
	/**
	 * The id of the automation action.
	 */
	id: string;

	/**
	 * The type of the automation action.
	 */
	actionType: string;

	/**
	 * The trigger of the automation action.
	 */
	trigger: string;

	/**
	 * The configuration of the automation action.
	 */
	configuration?: unknown;
}
