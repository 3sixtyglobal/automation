// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IRestRouteEntryPoint } from "@twin.org/api-models";
import { generateRestRoutesAutomation, tagsAutomation } from "./automationRoutes.js";

export const restEntryPoints: IRestRouteEntryPoint[] = [
	{
		name: "automation",
		defaultBaseRoute: "automation",
		tags: tagsAutomation,
		generateRoutes: generateRestRoutesAutomation
	}
];
