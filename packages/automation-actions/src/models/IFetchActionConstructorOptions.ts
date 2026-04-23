// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IFetchActionConfig } from "./IFetchActionConfig.js";

/**
 * Options for the fetch action constructor.
 */
export interface IFetchActionConstructorOptions {
	/**
	 * The type of the logging component.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * The configuration for the fetch action.
	 */
	config: IFetchActionConfig;
}
