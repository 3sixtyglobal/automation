// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";

/**
 * Interface describing an automation action.
 */
export interface IAutomationAction extends IComponent {
	/**
	 * Execute the automation action.
	 * @param data Optional data to be passed to the automation action.
	 * @returns A promise that resolves when the execution is complete.
	 */
	trigger(data?: unknown): Promise<void>;
}
