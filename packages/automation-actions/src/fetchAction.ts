// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IAutomationAction } from "@twin.org/automation-models";
import { ComponentFactory, Guards, Is } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import { FetchHelper, HttpMethod } from "@twin.org/web";
import type { IFetchActionConfig } from "./models/IFetchActionConfig.js";
import type { IFetchActionConstructorOptions } from "./models/IFetchActionConstructorOptions.js";

/**
 * Service for performing automation operations.
 */
export class FetchAction implements IAutomationAction {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<FetchAction>();

	/**
	 * The component for the logging.
	 * @internal
	 */
	private readonly _loggingComponent?: ILoggingComponent;

	/**
	 * The configuration for the fetch action.
	 * @internal
	 */
	private readonly _config: IFetchActionConfig;

	/**
	 * Create a new instance of FetchAction.
	 * @param options The options for the fetch action.
	 */
	constructor(options: IFetchActionConstructorOptions) {
		Guards.objectValue<IFetchActionConstructorOptions>(
			FetchAction.CLASS_NAME,
			nameof<IFetchActionConstructorOptions>(),
			options
		);
		Guards.objectValue<IFetchActionConfig>(
			FetchAction.CLASS_NAME,
			nameof<IFetchActionConfig>(),
			options.config
		);
		this._loggingComponent = ComponentFactory.getIfExists<ILoggingComponent>(
			options?.loggingComponentType
		);
		this._config = options?.config;
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return FetchAction.CLASS_NAME;
	}

	/**
	 * Execute the automation action.
	 * @param data Optional data to be passed to the automation action.
	 * @returns A promise that resolves when the execution is complete.
	 */
	public async trigger(data?: unknown): Promise<void> {
		let finalUrl = this._config.url;

		if (!Is.empty(this._config.pathParams)) {
			for (const [key, value] of Object.entries(this._config.pathParams)) {
				finalUrl = finalUrl.replace(`{${key}}`, encodeURIComponent(value));
			}
		}

		const url = new URL(finalUrl);
		if (!Is.empty(this._config.query)) {
			for (const [key, value] of Object.entries(this._config.query)) {
				url.searchParams.set(key, String(value));
			}
			finalUrl = url.toString();
		}

		await this._loggingComponent?.log({
			source: FetchAction.CLASS_NAME,
			level: "info",
			message: "fetch",
			data: {
				url: finalUrl,
				method: this._config.method ?? HttpMethod.GET,
				headers: this._config.headers,
				body: data
			}
		});

		let combinedPayload;

		if (Is.object(data) || Is.object(this._config.payload)) {
			combinedPayload = {
				...(Is.object(data) ? data : {}),
				...(Is.object(this._config.payload) ? this._config.payload : {})
			};
		}

		await FetchHelper.fetchJson(
			FetchAction.CLASS_NAME,
			finalUrl,
			this._config.method ?? HttpMethod.GET,
			combinedPayload,
			{
				headers: this._config.headers
			}
		);
	}
}
