// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	HttpContextIdKeys,
	HttpHeaderHelper,
	HttpUrlHelper,
	type ICreatedResponse,
	type IHttpRequestContext,
	type INoContentResponse,
	type IRestRoute,
	type ITag
} from "@3sixty/api-models";
import type {
	IAutomationActionCreateRequest,
	IAutomationActionGetRequest,
	IAutomationActionGetResponse,
	IAutomationActionRemoveRequest,
	IAutomationActionsQueryRequest,
	IAutomationActionsQueryResponse,
	IAutomationComponent,
	IAutomationTriggerRequest
} from "@3sixty/automation-models";
import { ContextIdStore } from "@3sixty/context";
import { Coerce, ComponentFactory, Guards } from "@3sixty/core";
import { nameof } from "@3sixty/nameof";
import { HttpStatusCode, type IHttpHeaders } from "@3sixty/web";

/**
 * The source used when communicating about these routes.
 */
const ROUTES_SOURCE = "automationRoutes";

/**
 * The tag to associate with the routes.
 */
export const tagsAutomation: ITag[] = [
	{
		name: "Automation",
		description: "Endpoints which are modelled to access an automation contract."
	}
];

/**
 * The REST routes for automation.
 * @param baseRouteName Prefix to prepend to the paths.
 * @param componentName The name of the component to use in the routes stored in the ComponentFactory.
 * @returns The generated routes.
 */
export function generateRestRoutesAutomation(
	baseRouteName: string,
	componentName: string
): IRestRoute[] {
	const automationCreateRoute: IRestRoute<IAutomationActionCreateRequest, ICreatedResponse> = {
		operationId: "AutomationActionCreate",
		summary: "Create an automation action.",
		tag: tagsAutomation[0].name,
		method: "POST",
		path: `${baseRouteName}/`,
		handler: async (httpRequestContext, request) =>
			automationActionCreate(httpRequestContext, componentName, request, baseRouteName),
		requestType: {
			type: nameof<IAutomationActionCreateRequest>(),
			examples: [
				{
					id: "AutomationActionCreateRequestExample",
					request: {
						body: {
							actionType: "log",
							trigger: "onCreate",
							configuration: { message: "Created!" }
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<ICreatedResponse>(),
				examples: [
					{
						id: "AutomationActionCreateResponseExample",
						response: { statusCode: 201, headers: { location: "action-123" } }
					}
				]
			}
		]
	};

	const automationRemoveRoute: IRestRoute<IAutomationActionRemoveRequest, INoContentResponse> = {
		operationId: "AutomationActionRemove",
		summary: "Remove an automation action.",
		tag: tagsAutomation[0].name,
		method: "DELETE",
		path: `${baseRouteName}/:actionId`,
		handler: async (httpRequestContext, request) =>
			automationActionRemove(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IAutomationActionRemoveRequest>(),
			examples: [
				{
					id: "AutomationActionRemoveRequestExample",
					request: {
						pathParams: { actionId: "action-123" }
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<INoContentResponse>(),
				examples: [
					{
						id: "AutomationActionRemoveResponseExample",
						response: { statusCode: 204 }
					}
				]
			}
		]
	};

	const automationGetRoute: IRestRoute<IAutomationActionGetRequest, IAutomationActionGetResponse> =
		{
			operationId: "AutomationActionGet",
			summary: "Get an automation action by id.",
			tag: tagsAutomation[0].name,
			method: "GET",
			path: `${baseRouteName}/:actionId`,
			handler: async (httpRequestContext, request) =>
				automationActionGet(httpRequestContext, componentName, request),
			requestType: {
				type: nameof<IAutomationActionGetRequest>(),
				examples: [
					{
						id: "AutomationActionGetRequestExample",
						request: {
							pathParams: { actionId: "action-123" }
						}
					}
				]
			},
			responseType: [
				{
					type: nameof<IAutomationActionGetResponse>(),
					examples: [
						{
							id: "AutomationActionGetResponseExample",
							response: {
								body: {
									id: "action-123",
									actionType: "log",
									trigger: "onCreate",
									configuration: { message: "Created!" }
								}
							}
						}
					]
				}
			]
		};

	const automationQueryRoute: IRestRoute<
		IAutomationActionsQueryRequest,
		IAutomationActionsQueryResponse
	> = {
		operationId: "AutomationActionsQuery",
		summary: "Query automation actions.",
		tag: tagsAutomation[0].name,
		method: "GET",
		path: `${baseRouteName}/`,
		handler: async (httpRequestContext, request) =>
			automationActionsQuery(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IAutomationActionsQueryRequest>(),
			examples: [
				{
					id: "AutomationActionsQueryRequestExample",
					request: {
						query: { trigger: "onCreate", actionType: "log", cursor: "abc", limit: "10" }
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<IAutomationActionsQueryResponse>(),
				examples: [
					{
						id: "AutomationActionsQueryResponseExample",
						response: {
							body: {
								entries: [
									{
										id: "action-123",
										actionType: "log",
										trigger: "onCreate",
										configuration: { message: "Created!" }
									}
								],
								cursor: "next-cursor"
							}
						}
					}
				]
			}
		]
	};

	const automationTriggerRoute: IRestRoute<IAutomationTriggerRequest, INoContentResponse> = {
		operationId: "AutomationTrigger",
		summary: "Trigger an automation process.",
		tag: tagsAutomation[0].name,
		method: "POST",
		path: `${baseRouteName}/trigger/:trigger`,
		handler: async (httpRequestContext, request) =>
			automationTrigger(httpRequestContext, componentName, request),
		requestType: {
			type: nameof<IAutomationTriggerRequest>(),
			examples: [
				{
					id: "AutomationTriggerRequestExample",
					request: {
						pathParams: {
							trigger: "my-trigger"
						},
						body: {
							data: {
								key: "value"
							}
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<INoContentResponse>(),
				examples: [
					{
						id: "AutomationTriggerResponseExample",
						response: {
							statusCode: HttpStatusCode.noContent
						}
					}
				]
			}
		]
	};

	return [
		automationTriggerRoute,
		automationCreateRoute,
		automationRemoveRoute,
		automationGetRoute,
		automationQueryRoute
	];
}

/**
 * Create an automation action.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request payload containing actionType, trigger, and configuration.
 * @param baseRouteName The base route name for the API.
 * @returns The created response with location header.
 */
export async function automationActionCreate(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IAutomationActionCreateRequest,
	baseRouteName: string
): Promise<ICreatedResponse> {
	Guards.object<IAutomationActionCreateRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IAutomationActionCreateRequest["body"]>(
		ROUTES_SOURCE,
		nameof(request.body),
		request.body
	);

	const component = ComponentFactory.get<IAutomationComponent>(componentName);
	const id = await component.actionCreate(
		request.body.actionType,
		request.body.trigger,
		request.body.configuration
	);

	const contextIds = await ContextIdStore.getContextIds();
	const publicOrigin = contextIds?.[HttpContextIdKeys.PublicOrigin];

	const headers: IHttpHeaders = {};
	HttpHeaderHelper.buildId(
		headers,
		id,
		HttpUrlHelper.combineOriginPath(publicOrigin, `${baseRouteName}/:id`)
	);

	return {
		statusCode: HttpStatusCode.created,
		headers
	};
}

/**
 * Remove an automation action.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request payload containing the actionId to remove.
 * @returns No content response.
 */
export async function automationActionRemove(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IAutomationActionRemoveRequest
): Promise<INoContentResponse> {
	Guards.object<IAutomationActionRemoveRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IAutomationActionRemoveRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);

	const component = ComponentFactory.get<IAutomationComponent>(componentName);
	await component.actionRemove(request.pathParams.actionId);
	return { statusCode: HttpStatusCode.noContent };
}

/**
 * Get an automation action by id.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request payload containing the actionId to retrieve.
 * @returns The automation action entry response.
 */
export async function automationActionGet(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IAutomationActionGetRequest
): Promise<IAutomationActionGetResponse> {
	Guards.object<IAutomationActionGetRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IAutomationActionGetRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	const component = ComponentFactory.get<IAutomationComponent>(componentName);
	const entry = await component.actionGet(request.pathParams.actionId);
	return { body: entry };
}

/**
 * Query automation actions.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request payload containing query parameters for filtering and pagination.
 * @returns The response containing matching automation actions and pagination cursor.
 */
export async function automationActionsQuery(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IAutomationActionsQueryRequest
): Promise<IAutomationActionsQueryResponse> {
	const component = ComponentFactory.get<IAutomationComponent>(componentName);
	const result = await component.actionsQuery(
		{
			trigger: request.query?.trigger,
			actionType: request.query?.actionType
		},
		request.query?.cursor,
		Coerce.integer(request.query?.limit)
	);
	return { body: result };
}

/**
 * Trigger an automation process.
 * @param httpRequestContext The request context for the API.
 * @param componentName The name of the component to use in the routes.
 * @param request The request payload containing the trigger and optional data.
 * @returns No content response.
 */
export async function automationTrigger(
	httpRequestContext: IHttpRequestContext,
	componentName: string,
	request: IAutomationTriggerRequest
): Promise<INoContentResponse> {
	Guards.object<IAutomationTriggerRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<IAutomationTriggerRequest["pathParams"]>(
		ROUTES_SOURCE,
		nameof(request.pathParams),
		request.pathParams
	);
	Guards.object<IAutomationTriggerRequest["body"]>(
		ROUTES_SOURCE,
		nameof(request.body),
		request.body
	);

	const component = ComponentFactory.get<IAutomationComponent>(componentName);
	await component.trigger(request.pathParams.trigger, request.body.data);

	return {
		statusCode: HttpStatusCode.noContent
	};
}
