# Automation Models Examples

This package provides shared interfaces and factories for automation actions, entries, and components. These are used to define and implement automation logic in a consistent way.

## IAutomationAction

```typescript
import type { IAutomationAction } from '@twin.org/automation-models';

class MyAction implements IAutomationAction {
  async trigger(data?: unknown): Promise<void> {
    // Perform the action
  }

  className(): string {
    return 'MyAction';
  }
}
```

## IAutomationActionEntry

```typescript
import type { IAutomationActionEntry } from '@twin.org/automation-models';

const entry: IAutomationActionEntry = {
  id: 'action-1',
  actionType: 'my-action',
  trigger: 'onEvent',
  configuration: { foo: 123 }
};
```

## IAutomationComponent

```typescript
import type { IAutomationComponent } from '@twin.org/automation-models';

// Example implementation skeleton
class MyComponent implements IAutomationComponent {
  async actionCreate(actionType: string, trigger: string, config?: unknown): Promise<string> {
    // ...
    return 'id';
  }
  async actionRemove(actionId: string): Promise<void> {
    // ...
  }
  async actionGet(actionId: string) {
    // ...
    return { id: actionId, actionType: 't', trigger: 'tr' };
  }
  async actionsQuery() {
    // ...
    return { entries: [], cursor: undefined };
  }
  async trigger(trigger: string, data?: unknown): Promise<void> {
    // ...
  }
  className(): string {
    return 'MyComponent';
  }
}
```

## AutomationActionFactory

```typescript
import { AutomationActionFactory } from '@twin.org/automation-models';

AutomationActionFactory.register('my-action', opts => new MyAction());
const action = AutomationActionFactory.createIfExists('my-action');
if (action) {
  await action.trigger();
}
```
