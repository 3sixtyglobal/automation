// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Request to query automation actions.
 */
export interface IAutomationActionsQueryRequest {
	/**
	 * Optional query parameters for filtering and pagination.
	 */
	query?: {
		/**
		 * Filter by trigger type.
		 */
		trigger?: string;

		/**
		 * Filter by action type.
		 */
		actionType?: string;

		/**
		 * Cursor for pagination.
		 */
		cursor?: string;

		/**
		 * Limit the number of results returned.
		 */
		limit?: string;
	};
}
