# Class: FetchAction

Service for performing automation operations.

## Implements

- `IAutomationAction`

## Constructors

### Constructor

> **new FetchAction**(`options`): `FetchAction`

Create a new instance of FetchAction.

#### Parameters

##### options

[`IFetchActionConstructorOptions`](../interfaces/IFetchActionConstructorOptions.md)

The options for the fetch action.

#### Returns

`FetchAction`

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

`IAutomationAction.className`

***

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

#### Implementation of

`IAutomationAction.trigger`
