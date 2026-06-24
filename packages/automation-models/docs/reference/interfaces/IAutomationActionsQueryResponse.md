# Interface: IAutomationActionsQueryResponse

Response for querying automation actions.

## Properties

### body {#body}

> **body**: `object`

The body of the response.

#### entries

> **entries**: [`IAutomationActionEntry`](IAutomationActionEntry.md)[]

List of automation action entries matching the query.

#### cursor?

> `optional` **cursor?**: `string`

Optional cursor for pagination.
