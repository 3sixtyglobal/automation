// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { entity, property } from "@3sixty/entity";

/**
 * Class defining the storage for automation action entries.
 */
@entity()
export class AutomationActionEntry {
	/**
	 * The unique identifier for the automation action entry.
	 */
	@property({ type: "string", isPrimary: true, maxLength: 255 })
	public id!: string;

	/**
	 * The type of action performed by the automation.
	 */
	@property({ type: "string", maxLength: 128, isSecondary: true })
	public actionType!: string;

	/**
	 * The trigger for the automation action.
	 */
	@property({ type: "string", maxLength: 128, isSecondary: true })
	public trigger!: string;

	/**
	 * The configuration for the automation action.
	 */
	@property({ type: "object", optional: true })
	public configuration?: unknown;
}
