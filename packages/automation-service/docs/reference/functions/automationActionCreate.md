# Function: automationActionCreate()

> **automationActionCreate**(`httpRequestContext`, `componentName`, `request`, `baseRouteName`): `Promise`\<`ICreatedResponse`\>

Create an automation action.

## Parameters

### httpRequestContext

`IHttpRequestContext`

The request context for the API.

### componentName

`string`

The name of the component to use in the routes.

### request

`IAutomationActionCreateRequest`

The request payload containing actionType, trigger, and configuration.

### baseRouteName

`string`

The base route name for the API.

## Returns

`Promise`\<`ICreatedResponse`\>

The created response with location header.
