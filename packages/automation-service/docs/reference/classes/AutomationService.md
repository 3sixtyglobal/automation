# Class: AutomationService

Service for performing automation operations.

## Implements

- `IAutomationComponent`

## Constructors

### Constructor

> **new AutomationService**(`options?`): `AutomationService`

Create a new instance of AutomationService.

#### Parameters

##### options?

[`IAutomationServiceConstructorOptions`](../interfaces/IAutomationServiceConstructorOptions.md)

The options for the service.

#### Returns

`AutomationService`

## Properties

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

Runtime name for the class.

## Methods

### className() {#classname}

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IAutomationComponent.className`

***

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

#### Implementation of

`IAutomationComponent.actionCreate`

***

### actionRemove() {#actionremove}

> **actionRemove**(`actionId`): `Promise`\<`void`\>

Remove an action by it's id.

#### Parameters

##### actionId

`string`

The id of the action to remove.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

`IAutomationComponent.actionRemove`

***

### actionGet() {#actionget}

> **actionGet**(`actionId`): `Promise`\<`IAutomationActionEntry`\>

Get an action by it's id.

#### Parameters

##### actionId

`string`

The id of the action to get.

#### Returns

`Promise`\<`IAutomationActionEntry`\>

The action with the given id.

#### Implementation of

`IAutomationComponent.actionGet`

***

### actionsQuery() {#actionsquery}

> **actionsQuery**(`options`, `cursor?`, `limit?`): `Promise`\<\{ `entries`: `IAutomationActionEntry`[]; `cursor?`: `string`; \}\>

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

`Promise`\<\{ `entries`: `IAutomationActionEntry`[]; `cursor?`: `string`; \}\>

The actions matching the query and a cursor to continue the query if there are more results.

#### Implementation of

`IAutomationComponent.actionsQuery`

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

Nothing.

#### Implementation of

`IAutomationComponent.trigger`
