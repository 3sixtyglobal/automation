// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@twin.org/core";
import type { IAutomationAction } from "../models/IAutomationAction.js";

/**
 * Factory for creating implementation of automation action types.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const AutomationActionFactory =
	Factory.createFactory<IAutomationAction>("automation-action");
