// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Request to get an automation action by id.
 */
export interface IAutomationActionGetRequest {
	/**
	 * The path parameters for the request.
	 */
	pathParams: {
		/**
		 * The unique identifier of the action to get.
		 */
		actionId: string;
	};
}
