// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IAutomationActionEntry } from "../IAutomationActionEntry.js";

/**
 * Request to create an automation action.
 */
export interface IAutomationActionCreateRequest {
	/**
	 * The body parameters for the request.
	 */
	body: Omit<IAutomationActionEntry, "id">;
}
