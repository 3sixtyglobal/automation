# Automation Action Examples

This package provides a class for performing HTTP requests as automation actions. It supports dynamic URLs, path and query parameters, custom headers, and optional logging integration.

## FetchAction

```typescript
import { FetchAction } from '@3sixty/automation-actions';
import { HttpMethod } from '@3sixty/web';

// Create a fetch action with a simple GET request
const action = new FetchAction({
  config: {
    url: 'https://api.example.com/items'
  }
});

// Get the class name
console.log(action.className()); // "FetchAction"

// Trigger the action (performs a GET request)
await action.trigger();

// Create a fetch action with path and query parameters
const actionWithParams = new FetchAction({
  config: {
    url: 'https://api.example.com/items/{id}',
    pathParams: { id: '42' },
    query: { filter: 'active', limit: '10' }
  }
});
await actionWithParams.trigger();

// Create a fetch action with custom method and headers
const postAction = new FetchAction({
  config: {
    url: 'https://api.example.com/items',
    method: HttpMethod.POST,
    headers: { 'x-api-key': 'secret' }
  }
});
await postAction.trigger({ name: 'New item' });

// Combine payload from config and trigger
const mergePayloadAction = new FetchAction({
  config: {
    url: 'https://api.example.com/merge',
    method: HttpMethod.POST,
    payload: { a: 1, b: 2 }
  }
});
// The payload sent will be: { a: 1, b: 2, c: 4 }
// (config.payload overrides trigger data for overlapping keys)
await mergePayloadAction.trigger({ b: 3, c: 4 });
```
