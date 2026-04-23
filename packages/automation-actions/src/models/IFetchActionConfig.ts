// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IHttpRequestPathParams, IHttpRequestQuery } from "@twin.org/api-models";
import type { HttpMethod, IHttpHeaders } from "@twin.org/web";

/**
 * Configuration for the fetch action.
 */
export interface IFetchActionConfig {
	/**
	 * The URL to fetch.
	 */
	url: string;

	/**
	 * The HTTP method to use for the fetch action.
	 * @default GET
	 */
	method?: HttpMethod;

	/**
	 * Optional headers to include in the fetch request.
	 */
	headers?: IHttpHeaders;

	/**
	 * Optional path parameters to include in the fetch request.
	 */
	pathParams?: IHttpRequestPathParams;

	/**
	 * Optional query parameters to include in the fetch request.
	 */
	query?: IHttpRequestQuery;

	/**
	 * Payload that can be combined with payload from the trigger.
	 */
	payload?: unknown;
}
