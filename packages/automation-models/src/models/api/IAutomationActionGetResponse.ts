// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IAutomationActionEntry } from "../IAutomationActionEntry.js";

/**
 * Response for getting an automation action.
 */
export interface IAutomationActionGetResponse {
	/**
	 * The automation action entry corresponding to the requested id.
	 */
	body: IAutomationActionEntry;
}
