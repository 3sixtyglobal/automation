# Interface: IAutomationAction

Interface describing an automation action.

## Extends

- `IComponent`

## Methods

### trigger() {#trigger}

> **trigger**(`data?`): `Promise`\<`void`\>

Execute the automation action.

#### Parameters

##### data?

`unknown`

Optional data to be passed to the automation action.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the execution is complete.
