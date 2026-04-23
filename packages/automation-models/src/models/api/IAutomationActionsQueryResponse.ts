// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IAutomationActionEntry } from "../IAutomationActionEntry.js";

/**
 * Response for querying automation actions.
 */
export interface IAutomationActionsQueryResponse {
	/**
	 * The body of the response.
	 */
	body: {
		/**
		 * List of automation action entries matching the query.
		 */
		entries: IAutomationActionEntry[];

		/**
		 * Optional cursor for pagination.
		 */
		cursor?: string;
	};
}
