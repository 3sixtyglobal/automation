# Function: automationActionsQuery()

> **automationActionsQuery**(`httpRequestContext`, `componentName`, `request`): `Promise`\<`IAutomationActionsQueryResponse`\>

Query automation actions.

## Parameters

### httpRequestContext

`IHttpRequestContext`

The request context for the API.

### componentName

`string`

The name of the component to use in the routes.

### request

`IAutomationActionsQueryRequest`

The request payload containing query parameters for filtering and pagination.

## Returns

`Promise`\<`IAutomationActionsQueryResponse`\>

The response containing matching automation actions and pagination cursor.
