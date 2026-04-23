// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Request to trigger an automation action.
 */
export interface IAutomationTriggerRequest {
	/**
	 * The path parameters.
	 */
	pathParams: {
		/**
		 * The trigger for the actions.
		 */
		trigger: string;
	};

	/**
	 * The body parameters.
	 */
	body: {
		/**
		 * Optional data to be passed to the actions.
		 */
		data?: unknown;
	};
}
