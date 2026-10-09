// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@3sixty/core";
import type { IAutomationActionEntry } from "./IAutomationActionEntry.js";

/**
 * Interface describing an automation contract.
 */
export interface IAutomationComponent extends IComponent {
	/**
	 * Create an action with the trigger and configuration.
	 * @param actionType The type of action to create.
	 * @param trigger The trigger to create the action for.
	 * @param config Configuration to be passed to the actions.
	 * @returns The id of the created action.
	 */
	actionCreate(actionType: string, trigger: string, config?: unknown): Promise<string>;

	/**
	 * Remove an action by its id.
	 * @param actionId The id of the action to remove.
	 * @returns A promise that resolves when the action is removed.
	 */
	actionRemove(actionId: string): Promise<void>;

	/**
	 * Get an action by its id.
	 * @param actionId The id of the action to get.
	 * @returns The action with the given id.
	 */
	actionGet(actionId: string): Promise<IAutomationActionEntry>;

	/**
	 * Query the actions with the given parameters.
	 * @param options The options to query the actions with.
	 * @param options.trigger The trigger to query the actions for.
	 * @param options.actionType The type of action to query for.
	 * @param cursor The cursor to continue the query from.
	 * @param limit The maximum number of actions to return.
	 * @returns The actions matching the query and a cursor to continue the query if there are more results.
	 */
	actionsQuery(
		options:
			| {
					trigger?: string;
					actionType?: string;
			  }
			| undefined,
		cursor?: string,
		limit?: number
	): Promise<{
		entries: IAutomationActionEntry[];
		cursor?: string;
	}>;

	/**
	 * Locate automation actions which match the given trigger and execute them.
	 * @param trigger The trigger to find the actions for.
	 * @param data Optional data to be passed to the actions.
	 * @returns A promise that resolves when all matching actions have executed.
	 */
	trigger(trigger: string, data?: unknown): Promise<void>;
}
