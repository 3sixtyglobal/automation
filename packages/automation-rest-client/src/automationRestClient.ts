// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@3sixty/api-core";
import {
	HttpHeaderHelper,
	type IBaseRestClientConfig,
	type ICreatedResponse,
	type INoContentResponse
} from "@3sixty/api-models";
import type {
	IAutomationActionCreateRequest,
	IAutomationActionEntry,
	IAutomationActionGetRequest,
	IAutomationActionGetResponse,
	IAutomationActionRemoveRequest,
	IAutomationActionsQueryRequest,
	IAutomationActionsQueryResponse,
	IAutomationComponent,
	IAutomationTriggerRequest
} from "@3sixty/automation-models";
import { Coerce, Guards } from "@3sixty/core";
import { nameof } from "@3sixty/nameof";
import { HttpMethod } from "@3sixty/web";

/**
 * Client for performing automation through to REST endpoints.
 */
export class AutomationRestClient extends BaseRestClient implements IAutomationComponent {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<AutomationRestClient>();

	/**
	 * Create a new instance of AutomationRestClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(AutomationRestClient.CLASS_NAME, config, "automation");
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return AutomationRestClient.CLASS_NAME;
	}

	/**
	 * Create an action with the trigger and configuration.
	 * @param actionType The type of action to create.
	 * @param trigger The trigger to create the action for.
	 * @param config Configuration to be passed to the actions.
	 * @returns The id of the created action.
	 */
	public async actionCreate(
		actionType: string,
		trigger: string,
		config?: unknown
	): Promise<string> {
		Guards.stringValue(AutomationRestClient.CLASS_NAME, nameof(actionType), actionType);
		Guards.stringValue(AutomationRestClient.CLASS_NAME, nameof(trigger), trigger);

		const response = await this.fetch<IAutomationActionCreateRequest, ICreatedResponse>(
			"/",
			HttpMethod.POST,
			{
				body: {
					actionType,
					trigger,
					configuration: config
				}
			}
		);

		return HttpHeaderHelper.extractId(response.headers, `${this.getPathPrefix()}/:id`);
	}

	/**
	 * Remove an action by its id.
	 * @param actionId The id of the action to remove.
	 * @returns A promise that resolves when the action has been removed.
	 */
	public async actionRemove(actionId: string): Promise<void> {
		Guards.stringValue(AutomationRestClient.CLASS_NAME, nameof(actionId), actionId);

		await this.fetch<IAutomationActionRemoveRequest, INoContentResponse>(
			"/:actionId",
			HttpMethod.DELETE,
			{
				pathParams: {
					actionId
				}
			}
		);
	}

	/**
	 * Get an action by its id.
	 * @param actionId The id of the action to get.
	 * @returns The action with the given id.
	 */
	public async actionGet(actionId: string): Promise<IAutomationActionEntry> {
		Guards.stringValue(AutomationRestClient.CLASS_NAME, nameof(actionId), actionId);

		const response = await this.fetch<IAutomationActionGetRequest, IAutomationActionGetResponse>(
			"/:actionId",
			HttpMethod.GET,
			{
				pathParams: {
					actionId
				}
			}
		);

		return response.body;
	}

	/**
	 * Query the actions with the given parameters.
	 * @param options The options to query the actions with.
	 * @param options.trigger The trigger to filter the actions by.
	 * @param options.actionType The type of action to filter by.
	 * @param cursor The cursor to continue the query from.
	 * @param limit The maximum number of actions to return.
	 * @returns The actions matching the query and a cursor to continue the query if there are more results.
	 */
	public async actionsQuery(
		options?: { trigger?: string; actionType?: string },
		cursor?: string,
		limit?: number
	): Promise<{
		entries: IAutomationActionEntry[];
		cursor?: string;
	}> {
		const response = await this.fetch<
			IAutomationActionsQueryRequest,
			IAutomationActionsQueryResponse
		>("/", HttpMethod.GET, {
			query: {
				trigger: options?.trigger,
				actionType: options?.actionType,
				cursor,
				limit: Coerce.string(limit)
			}
		});

		return response.body;
	}

	/**
	 * Locate automation actions which match the given trigger and execute them.
	 * @param trigger The trigger to find the actions for.
	 * @param data Optional data to be passed to the actions.
	 * @returns A promise that resolves when all matching actions have been dispatched.
	 */
	public async trigger(trigger: string, data?: unknown): Promise<void> {
		Guards.stringValue(AutomationRestClient.CLASS_NAME, nameof(trigger), trigger);

		await this.fetch<IAutomationTriggerRequest, INoContentResponse>(
			"/trigger/:trigger",
			HttpMethod.POST,
			{
				pathParams: {
					trigger
				},
				body: {
					data
				}
			}
		);
	}
}
