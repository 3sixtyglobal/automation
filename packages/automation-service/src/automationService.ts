// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	AutomationActionFactory,
	type IAutomationActionEntry,
	type IAutomationComponent
} from "@3sixty/automation-models";
import {
	BaseError,
	ComponentFactory,
	GeneralError,
	Guards,
	Is,
	NotFoundError,
	RandomHelper
} from "@3sixty/core";
import { ComparisonOperator } from "@3sixty/entity";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@3sixty/entity-storage-models";
import type { ILoggingComponent } from "@3sixty/logging-models";
import { nameof } from "@3sixty/nameof";
import type { AutomationActionEntry } from "./entities/automationActionEntry.js";
import type { IAutomationServiceConstructorOptions } from "./models/IAutomationServiceConstructorOptions.js";

/**
 * Service for performing automation operations.
 */
export class AutomationService implements IAutomationComponent {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<AutomationService>();

	/**
	 * The component type for the logging.
	 * @internal
	 */
	private readonly _loggingComponentType?: string;

	/**
	 * The component for the logging.
	 * @internal
	 */
	private readonly _loggingComponent?: ILoggingComponent;

	/**
	 * The entity storage for automation action entries.
	 * @internal
	 */
	private readonly _automationActionEntryStorage: IEntityStorageConnector<AutomationActionEntry>;

	/**
	 * Create a new instance of AutomationService.
	 * @param options The options for the service.
	 */
	constructor(options?: IAutomationServiceConstructorOptions) {
		this._loggingComponentType = options?.loggingComponentType;
		this._loggingComponent = ComponentFactory.getIfExists<ILoggingComponent>(
			this._loggingComponentType
		);
		this._automationActionEntryStorage = EntityStorageConnectorFactory.get(
			options?.automationActionEntryStorageType ?? "automation-action-entry"
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return AutomationService.CLASS_NAME;
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
		Guards.stringValue(AutomationService.CLASS_NAME, nameof(actionType), actionType);
		Guards.stringValue(AutomationService.CLASS_NAME, nameof(trigger), trigger);

		try {
			const entry: AutomationActionEntry = {
				id: RandomHelper.generateUuidV7("compact"),
				actionType,
				trigger,
				configuration: config
			};

			await this._automationActionEntryStorage.set(entry);

			return entry.id;
		} catch (error) {
			throw new GeneralError(
				AutomationService.CLASS_NAME,
				"actionCreateFailed",
				{
					actionType,
					trigger
				},
				BaseError.fromError(error)
			);
		}
	}

	/**
	 * Remove an action by its id.
	 * @param actionId The id of the action to remove.
	 * @returns A promise that resolves when the action has been removed.
	 */
	public async actionRemove(actionId: string): Promise<void> {
		Guards.stringValue(AutomationService.CLASS_NAME, nameof(actionId), actionId);

		try {
			await this._automationActionEntryStorage.remove(actionId);
		} catch (error) {
			throw new GeneralError(
				AutomationService.CLASS_NAME,
				"actionRemoveFailed",
				{
					actionId
				},
				BaseError.fromError(error)
			);
		}
	}

	/**
	 * Get an action by its id.
	 * @param actionId The id of the action to get.
	 * @returns The action with the given id.
	 */
	public async actionGet(actionId: string): Promise<IAutomationActionEntry> {
		Guards.stringValue(AutomationService.CLASS_NAME, nameof(actionId), actionId);

		try {
			const entry = await this._automationActionEntryStorage.get(actionId);

			if (!entry) {
				throw new NotFoundError(AutomationService.CLASS_NAME, "actionNotFound", actionId);
			}

			return {
				id: entry.id,
				actionType: entry.actionType,
				trigger: entry.trigger,
				configuration: entry.configuration
			};
		} catch (error) {
			throw new GeneralError(
				AutomationService.CLASS_NAME,
				"actionGetFailed",
				{
					actionId
				},
				BaseError.fromError(error)
			);
		}
	}

	/**
	 * Query the actions with the given parameters.
	 * @param options The options to query the actions with.
	 * @param options.trigger The trigger to query the actions for.
	 * @param options.actionType The type of action to query for.
	 * @param cursor The cursor to continue the query from.
	 * @param limit The maximum number of actions to return.
	 * @returns The actions matching the query and a cursor to continue the query if there are more results.
	 */
	public async actionsQuery(
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
	}> {
		const conditions: {
			property: string;
			value: string;
			comparison: (typeof ComparisonOperator)[keyof typeof ComparisonOperator];
		}[] = [];

		if (Is.object(options)) {
			if (!Is.empty(options.trigger)) {
				conditions.push({
					property: "trigger",
					value: options.trigger,
					comparison: ComparisonOperator.Equals
				});
			}

			if (!Is.empty(options.actionType)) {
				conditions.push({
					property: "actionType",
					value: options.actionType,
					comparison: ComparisonOperator.Equals
				});
			}
		}

		const result = await this._automationActionEntryStorage.query(
			conditions.length > 0 ? { conditions } : undefined,
			undefined,
			undefined,
			cursor,
			limit
		);

		return {
			entries: result.entities as IAutomationActionEntry[],
			cursor: result.cursor
		};
	}

	/**
	 * Locate automation actions which match the given trigger and execute them.
	 * @param trigger The trigger to find the actions for.
	 * @param data Optional data to be passed to the actions.
	 * @returns A promise that resolves when all matching actions have been executed.
	 */
	public async trigger(trigger: string, data?: unknown): Promise<void> {
		Guards.stringValue(AutomationService.CLASS_NAME, nameof(trigger), trigger);

		await this._loggingComponent?.log({
			source: AutomationService.CLASS_NAME,
			level: "info",
			message: "trigger",
			data: { trigger, data }
		});

		let cursor;
		do {
			const result = await this.actionsQuery({ trigger }, cursor);

			cursor = result.cursor;

			for (const entry of result.entries) {
				const action = AutomationActionFactory.createIfExists(entry.actionType, {
					loggingComponentType: this._loggingComponentType,
					config: entry.configuration
				});

				if (Is.empty(action)) {
					await this._loggingComponent?.log({
						source: AutomationService.CLASS_NAME,
						level: "error",
						message: "actionTypeNotFound",
						data: { actionType: entry.actionType, trigger }
					});
				} else {
					try {
						await this._loggingComponent?.log({
							source: AutomationService.CLASS_NAME,
							level: "info",
							message: "actionTriggered",
							data: { trigger, name: action.className(), data }
						});
						await action.trigger(data);
					} catch (err) {
						await this._loggingComponent?.log({
							source: AutomationService.CLASS_NAME,
							level: "error",
							message: "actionFailed",
							error: BaseError.fromError(err),
							data: { trigger, name: action.className(), data }
						});
					}
				}
			}
		} while (Is.stringValue(cursor));
	}
}
