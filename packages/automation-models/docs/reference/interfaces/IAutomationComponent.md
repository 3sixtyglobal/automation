# Interface: IAutomationComponent

Interface describing an automation contract.

## Extends

- `IComponent`

## Methods

### actionCreate() {#actioncreate}

> **actionCreate**(`actionType`, `trigger`, `config?`): `Promise`\<`string`\>

Create an action with the trigger and configuration.

#### Parameters

##### actionType

`string`

The type of action to create.

##### trigger

`string`

The trigger to create the action for.

##### config?

`unknown`

Configuration to be passed to the actions.

#### Returns

`Promise`\<`string`\>

The id of the created action.

***

### actionRemove() {#actionremove}

> **actionRemove**(`actionId`): `Promise`\<`void`\>

Remove an action by its id.

#### Parameters

##### actionId

`string`

The id of the action to remove.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the action is removed.

***

### actionGet() {#actionget}

> **actionGet**(`actionId`): `Promise`\<[`IAutomationActionEntry`](IAutomationActionEntry.md)\>

Get an action by its id.

#### Parameters

##### actionId

`string`

The id of the action to get.

#### Returns

`Promise`\<[`IAutomationActionEntry`](IAutomationActionEntry.md)\>

The action with the given id.

***

### actionsQuery() {#actionsquery}

> **actionsQuery**(`options`, `cursor?`, `limit?`): `Promise`\<\{ `entries`: [`IAutomationActionEntry`](IAutomationActionEntry.md)[]; `cursor?`: `string`; \}\>

Query the actions with the given parameters.

#### Parameters

##### options

\{ `trigger?`: `string`; `actionType?`: `string`; \} \| `undefined`

The options to query the actions with.

###### Type Literal

\{ `trigger?`: `string`; `actionType?`: `string`; \}

The options to query the actions with.

###### trigger?

`string`

The trigger to query the actions for.

###### actionType?

`string`

The type of action to query for.

***

`undefined`

##### cursor?

`string`

The cursor to continue the query from.

##### limit?

`number`

The maximum number of actions to return.

#### Returns

`Promise`\<\{ `entries`: [`IAutomationActionEntry`](IAutomationActionEntry.md)[]; `cursor?`: `string`; \}\>

The actions matching the query and a cursor to continue the query if there are more results.

***

### trigger() {#trigger}

> **trigger**(`trigger`, `data?`): `Promise`\<`void`\>

Locate automation actions which match the given trigger and execute them.

#### Parameters

##### trigger

`string`

The trigger to find the actions for.

##### data?

`unknown`

Optional data to be passed to the actions.

#### Returns

`Promise`\<`void`\>

A promise that resolves when all matching actions have executed.
