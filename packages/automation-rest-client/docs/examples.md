# Automation REST Client Examples

This package provides a client for managing automation actions via REST endpoints. It supports creating, removing, retrieving, querying, and triggering automation actions.

## AutomationRestClient

```typescript
import { AutomationRestClient } from '@3sixty/automation-rest-client';

// Create a client instance
const client = new AutomationRestClient({ endpoint: 'http://localhost:8080' });

// Create an automation action
const actionId = await client.actionCreate('my-action', 'onEvent', { foo: 123 });
console.log(actionId); // "action-123"

// Get an automation action by id
const entry = await client.actionGet(actionId);
console.log(entry); // { id: "action-123", actionType: "my-action", trigger: "onEvent", configuration: { foo: 123 } }

// Query automation actions
const result = await client.actionsQuery({ trigger: 'onEvent' }, undefined, 10);
console.log(result.entries); // [ ... ]

// Remove an automation action
await client.actionRemove(actionId);

// Trigger all actions for a given trigger
await client.trigger('onEvent', { bar: 456 });
```
