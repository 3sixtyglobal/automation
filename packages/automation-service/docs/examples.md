# Automation Service Examples

This package provides a service for managing and executing automation actions in memory or with pluggable storage and logging. It supports creating, removing, retrieving, querying, and triggering automation actions.

## AutomationService

```typescript
import { AutomationService } from '@twin.org/automation-service';

// Create a service instance (using defaults)
const service = new AutomationService();

// Create an automation action
const actionId = await service.actionCreate('my-action', 'onEvent', { foo: 123 });
console.log(actionId); // e.g. "action-1"

// Get an automation action by id
const entry = await service.actionGet(actionId);
console.log(entry); // { id: "action-1", actionType: "my-action", trigger: "onEvent", configuration: { foo: 123 } }

// Query automation actions
const result = await service.actionsQuery({ trigger: 'onEvent' }, undefined, 10);
console.log(result.entries); // [ ... ]

// Remove an automation action
await service.actionRemove(actionId);

// Trigger all actions for a given trigger
await service.trigger('onEvent', { bar: 456 });
```
