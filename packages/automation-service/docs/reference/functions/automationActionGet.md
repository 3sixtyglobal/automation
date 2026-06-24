# Function: automationActionGet()

> **automationActionGet**(`httpRequestContext`, `componentName`, `request`): `Promise`\<`IAutomationActionGetResponse`\>

Get an automation action by id.

## Parameters

### httpRequestContext

`IHttpRequestContext`

The request context for the API.

### componentName

`string`

The name of the component to use in the routes.

### request

`IAutomationActionGetRequest`

The request payload containing the actionId to retrieve.

## Returns

`Promise`\<`IAutomationActionGetResponse`\>

The automation action entry response.
