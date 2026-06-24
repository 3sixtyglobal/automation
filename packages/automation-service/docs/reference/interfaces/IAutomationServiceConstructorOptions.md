# Interface: IAutomationServiceConstructorOptions

Options for the automation Service constructor.

## Properties

### loggingComponentType? {#loggingcomponenttype}

> `optional` **loggingComponentType?**: `string`

The type of the logging component.

***

### automationActionEntryStorageType? {#automationactionentrystoragetype}

> `optional` **automationActionEntryStorageType?**: `string`

The entity storage for the automation action entries.

#### Default

```ts
automation-action-entry
```

***

### config? {#config}

> `optional` **config?**: [`IAutomationServiceConfig`](IAutomationServiceConfig.md)

The configuration for the service.
