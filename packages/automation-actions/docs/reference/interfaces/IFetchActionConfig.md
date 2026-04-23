# Interface: IFetchActionConfig

Configuration for the fetch action.

## Properties

### url {#url}

> **url**: `string`

The URL to fetch.

***

### method? {#method}

> `optional` **method?**: `HttpMethod`

The HTTP method to use for the fetch action.

#### Default

```ts
GET
```

***

### headers? {#headers}

> `optional` **headers?**: `IHttpHeaders`

Optional headers to include in the fetch request.

***

### pathParams? {#pathparams}

> `optional` **pathParams?**: `IHttpRequestPathParams`

Optional path parameters to include in the fetch request.

***

### query? {#query}

> `optional` **query?**: `IHttpRequestQuery`

Optional query parameters to include in the fetch request.

***

### payload? {#payload}

> `optional` **payload?**: `unknown`

Payload that can be combined with payload from the trigger.
