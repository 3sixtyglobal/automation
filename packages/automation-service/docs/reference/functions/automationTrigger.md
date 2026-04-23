# Function: automationTrigger()

> **automationTrigger**(`httpRequestContext`, `componentName`, `request`): `Promise`\<`INoContentResponse`\>

Trigger an automation process.

## Parameters

### httpRequestContext

`IHttpRequestContext`

The request context for the API.

### componentName

`string`

The name of the component to use in the routes.

### request

`IAutomationTriggerRequest`

The request payload containing the trigger and optional data.

## Returns

`Promise`\<`INoContentResponse`\>

No content response.
