# 🚀 AI Agent Flow - End-to-End Implementation Plan

This plan outlines the roadmap for building an AI-powered workflow builder using Angular and ng-diagram, with a focus on visual flow design and AI agent integration.

---

## 📋 Technology Stack
| Layer | Technology |
|-------|------------|
| Framework | Angular 18 (Standalone Components, Signals) |
| Diagram Library | ng-diagram |
| UI Components | Angular Material / Custom |
| State | LocalStorageModelAdapter → Backend API |
| Styling | SCSS + CSS Variables |

---

## ✅ Phase 1: Foundation (Completed)

### Step 1: Minimal POC 
- [x] Setup ng-diagram with `LocalStorageModelAdapter`
- [x] Import `ng-diagram/styles.css` in global styles
- [x] Add `provideNgDiagram()` provider
- [x] Create custom node template (`NodeComponent`) with 4 ports
- [x] Implement basic drag-and-drop and connections

### Step 2: Core Functionalities 🚧
**UI Elements Added (buttons exist but functionality incomplete):**
- [x] Toolbar UI (Add Node, Delete, Undo/Redo, Zoom buttons)
- [x] Keyboard shortcut handlers registered
- [x] Selection info bar UI
- [x] Status bar UI
- [x] Services injected: `NgDiagramModelService`, `NgDiagramSelectionService`, `NgDiagramViewportService`

**Functionality Status:**
| Feature | Status | Issue |
|---------|--------|-------|
| Add Node | ✅ Works | - |
| Delete Selection | ⚠️ Partial | Works once, then stops |
| Undo | ❌ Not working | Stub only in adapter |
| Redo | ❌ Not working | Stub only in adapter |
| Zoom In | ⚠️ Partial | Works once, then stops |
| Zoom Out | ⚠️ Partial | Works once, then stops |
| Zoom to Fit | ❌ Not tested | May have same issue |
| Select All | ❌ Not tested | - |
| Ctrl+Z/Y shortcuts | ❌ Not working | Calls stub methods |
| Ctrl+A shortcut | ❌ Not tested | - |
| Delete key | ⚠️ Partial | Same as Delete button |

**Root Causes to Fix:**
1. **Undo/Redo**: `LocalStorageModelAdapter.undo()` and `redo()` are stubs (just console.log)
2. **Zoom issues**: May be viewport service state not updating correctly
3. **Delete once**: Possibly selection state not refreshing after deletion

**TODO to complete Step 2:**
- [ ] Implement proper undo/redo with command history stack
- [ ] Debug zoom in/out to work repeatedly
- [ ] Debug delete to work repeatedly
- [ ] Verify all keyboard shortcuts work
- [ ] Verify Select All works

---

## 🚧 Phase 2: Workflow Structure & Data (Current)

### Step 3: Data Persistence & JSON Structure
- [x] Implement "Save JSON" button (downloads workflow file)
- [ ] **Define JSON Schema** for workflow (Zapier-style with dynamic ports & branching):

#### 📐 Workflow JSON Schema v2.0

```json
{
  "version": "2.0.0",
  "timestamp": "2025-12-08T10:30:00.000Z",
  "name": "Lead Routing Workflow",
  "description": "Routes leads based on priority and keywords",
  
  "nodes": [
    {
      "id": "node-1",
      "stepNumber": 1,
      "type": "trigger",
      "position": { "x": 500, "y": 0 },
      "data": {
        "app": "webhooks-zapier",
        "appLabel": "Webhooks by Zapier",
        "icon": "assets/icons/webhook.svg",
        "action": "catch-hook",
        "actionLabel": "Catch Hook",
        "status": "success",
        "params": {
          "webhookUrl": "https://hooks.example.com/abc123"
        }
      },
      "ports": {
        "inputs": [],
        "outputs": [
          { "id": "out-1", "label": null }
        ]
      }
    },
    {
      "id": "node-3",
      "stepNumber": 3,
      "type": "logic",
      "position": { "x": 500, "y": 300 },
      "data": {
        "app": "paths",
        "appLabel": "Paths",
        "icon": "assets/icons/paths.svg",
        "action": "split",
        "actionLabel": "Split into paths",
        "status": "success",
        "params": {
          "branches": [
            { "id": "branch-1", "label": "Lead nurture", "condition": "score < 50" },
            { "id": "branch-2", "label": "High priority account", "condition": "score >= 80" },
            { "id": "branch-3", "label": "Mentions help or support", "condition": "contains(message, 'help')" }
          ]
        }
      },
      "ports": {
        "inputs": [
          { "id": "in-1" }
        ],
        "outputs": [
          { "id": "out-branch-1", "branchId": "branch-1", "label": "Lead nurture" },
          { "id": "out-branch-2", "branchId": "branch-2", "label": "High priority account" },
          { "id": "out-branch-3", "branchId": "branch-3", "label": "Mentions help or support" }
        ]
      }
    },
    {
      "id": "node-5",
      "stepNumber": 5,
      "type": "action",
      "position": { "x": 200, "y": 600 },
      "data": {
        "app": "chatgpt-openai",
        "appLabel": "ChatGPT (OpenAI)",
        "icon": "assets/icons/openai.svg",
        "action": "send-prompt",
        "actionLabel": "Send a prompt to OpenAI",
        "status": "pending",
        "params": {
          "model": "gpt-4",
          "prompt": "Analyze this lead: {{data.name}}",
          "temperature": 0.7
        }
      },
      "ports": {
        "inputs": [{ "id": "in-1" }],
        "outputs": [{ "id": "out-1", "label": null }]
      }
    }
  ],
  
  "edges": [
    {
      "id": "edge-1-2",
      "source": "node-1",
      "sourcePort": "out-1",
      "target": "node-2",
      "targetPort": "in-1",
      "data": {}
    },
    {
      "id": "edge-3-5",
      "source": "node-3",
      "sourcePort": "out-branch-1",
      "target": "node-5",
      "targetPort": "in-1",
      "data": {
        "branchLabel": "Lead nurture"
      }
    }
  ],
  
  "metadata": {
    "viewport": { "x": 0, "y": 0, "scale": 1 },
    "layout": "vertical",
    "autoNumber": true,
    "createdAt": "2025-12-08T10:00:00.000Z",
    "updatedAt": "2025-12-08T10:30:00.000Z"
  }
}
```

#### 🔑 Schema Key Features

| Feature | Description |
|---------|-------------|
| **Dynamic Ports** | `ports.inputs[]` and `ports.outputs[]` arrays instead of fixed 4 ports |
| **Branching Support** | Output ports can have `branchId` and `label` for split nodes |
| **Labeled Edges** | `edge.data.branchLabel` carries the path name |
| **Step Numbers** | `node.stepNumber` for global execution/display order |
| **App Metadata** | `app`, `appLabel`, `icon`, `action`, `actionLabel` for rich UI |
| **Execution Status** | `data.status`: `pending` / `running` / `success` / `error` |
| **Branch Config** | `data.params.branches[]` for logic/split nodes |
| **Workflow Metadata** | `name`, `description`, `createdAt`, `updatedAt` |

#### 📝 TypeScript Interfaces

```typescript
// Core Types
interface WorkflowSchema {
  version: string;
  timestamp: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  metadata: WorkflowMetadata;
}

interface WorkflowNode {
  id: string;
  stepNumber: number;
  type: 'trigger' | 'action' | 'logic' | 'helper';
  position: { x: number; y: number };
  data: NodeData;
  ports: {
    inputs: PortDefinition[];
    outputs: PortDefinition[];
  };
}

interface PortDefinition {
  id: string;
  label?: string | null;
  branchId?: string;  // For branching outputs
}

interface NodeData {
  app: string;
  appLabel: string;
  icon: string;
  action: string;
  actionLabel: string;
  status: 'pending' | 'running' | 'success' | 'error';
  params: Record<string, any>;
}

interface WorkflowEdge {
  id: string;
  source: string;
  sourcePort: string;
  target: string;
  targetPort: string;
  data: {
    branchLabel?: string;
  };
}

interface WorkflowMetadata {
  viewport: { x: number; y: number; scale: number };
  layout: 'vertical' | 'horizontal';
  autoNumber: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

- [ ] **Add "Load/Import" button** with file picker
- [ ] **Schema validation** on import (reject invalid JSON, check required fields)
- [ ] **Graph integrity checks**:
  - [ ] No orphan edges (source/target must exist)
  - [ ] Valid port references (sourcePort/targetPort must exist on node)
  - [ ] No duplicate IDs
  - [ ] Branch outputs must have matching `branchId` in `params.branches`

### Step 4: UI Layout & Canvas Polish
**Note:** Final layout design (sidebars, panels) will be determined based on the specific application requirements. Current focus is on core canvas functionality.

- [ ] **Canvas Improvements**
  - [ ] Refined grid background
  - [ ] Better connection styling (curved, colored by type)
  - [ ] Node styling improvements (shadows, borders, status indicators)
- [ ] **Layout Options** (TBD based on app design):
  - Option A: Left sidebar for workflow description + Right sidebar for data/tools (as shown in reference image)
  - Option B: Traditional left palette + right properties panel
  - Option C: Minimal toolbar-only interface

---

## 🛠️ Phase 3: Advanced Node Implementation

### Step 5: Custom UI Inside Nodes
> **ngDiagram supports any Angular component inside nodes!**

- [ ] **Prototype "Action Node"** with embedded controls:
  - [ ] Dropdown (`<mat-select>`) for operation type
  - [ ] Text input for label/name
  - [ ] Chip list for tags/labels
- [ ] **Event handling**: `$event.stopPropagation()` on inputs to prevent drag
- [ ] **Data binding**: Two-way bind to `node().data` for persistence
- [ ] **Sizing**: Use flex/grid layout; ngDiagram auto-reflows ports

**Example Node Template:**
```html
<ng-diagram-base-node-template [node]="node()">
  <div class="node-content">
    <mat-form-field>
      <mat-select [(ngModel)]="$any(node().data).operation">
        <mat-option value="create">Create</mat-option>
        <mat-option value="update">Update</mat-option>
      </mat-select>
    </mat-form-field>
    <input [(ngModel)]="$any(node().data).label" 
           (keydown)="$event.stopPropagation()"/>
    <mat-chip-listbox>
      <mat-chip *ngFor="let tag of $any(node().data).tags">{{tag}}</mat-chip>
    </mat-chip-listbox>
  </div>
</ng-diagram-base-node-template>
<ng-diagram-port id="in" side="left" type="input"/>
<ng-diagram-port id="out" side="right" type="output"/>
```

### Step 6: Node Type Registry & App Catalog

#### 🗂️ App Registry Structure
```typescript
// App definitions (like Zapier's app catalog)
interface AppDefinition {
  id: string;                    // e.g., "chatgpt-openai"
  label: string;                 // e.g., "ChatGPT (OpenAI)"
  icon: string;                  // Icon path or URL
  category: 'trigger' | 'action' | 'logic' | 'helper';
  color: string;                 // Brand color for node styling
  actions: ActionDefinition[];   // Available actions for this app
}

interface ActionDefinition {
  id: string;                    // e.g., "send-prompt"
  label: string;                 // e.g., "Send a prompt to OpenAI"
  description?: string;
  params: ParamDefinition[];     // Form fields for this action
  defaultPorts: {
    inputs: PortDefinition[];
    outputs: PortDefinition[];
  };
}

interface ParamDefinition {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'boolean' | 'json' | 'chips';
  required: boolean;
  default?: any;
  options?: { value: string; label: string }[];  // For select type
  placeholder?: string;
}
```

#### 📦 Example App Definitions
```typescript
const APP_CATALOG: AppDefinition[] = [
  {
    id: 'webhooks-zapier',
    label: 'Webhooks by Zapier',
    icon: 'assets/icons/webhook.svg',
    category: 'trigger',
    color: '#FF4A00',
    actions: [
      {
        id: 'catch-hook',
        label: 'Catch Hook',### 🔥 Priority Fixes (Step 2 Completion)
1. **Fix Delete** - Works once then stops (selection state issue)
2. **Fix Zoom In/Out** - Works once then stops (viewport state issue)
3. **Implement Undo/Redo** - Currently stubs, need command history stack
4. **Test Select All** - Verify it works
5. **Test all keyboard shortcuts** - Verify they trigger correctly

### 🎯 After Step 2 Fixed - Next Actions
1. **Implement Load/Import button** with file picker
2. **Create TypeScript interfaces** for WorkflowSchema v2.0
3. **Add schema validation** on import
4. **Update Save button** to export v2.0 format

        params: [
          { id: 'webhookUrl', label: 'Webhook URL', type: 'text', required: false }
        ],
        defaultPorts: {
          inputs: [],
          outputs: [{ id: 'out-1', label: null }]
        }
      }
    ]
  },
  {
    id: 'paths',
    label: 'Paths',
    icon: 'assets/icons/paths.svg',
    category: 'logic',
    color: '#7C3AED',
    actions: [
      {
        id: 'split',
        label: 'Split into paths',
        params: [
          { id: 'branches', label: 'Branches', type: 'json', required: true }
        ],
        defaultPorts: {
          inputs: [{ id: 'in-1' }],
          outputs: []  // Dynamic based on branches
        }
      }
    ]
  },
  {
    id: 'chatgpt-openai',
    label: 'ChatGPT (OpenAI)',
    icon: 'assets/icons/openai.svg',
    category: 'action',
    color: '#10A37F',
    actions: [
      {
        id: 'send-prompt',
        label: 'Send a prompt to OpenAI',
        params: [
          { id: 'model', label: 'Model', type: 'select', required: true, options: [
            { value: 'gpt-4', label: 'GPT-4' },
            { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
          ]},
          { id: 'prompt', label: 'Prompt', type: 'textarea', required: true },
          { id: 'temperature', label: 'Temperature', type: 'number', required: false, default: 0.7 }
        ],
        defaultPorts: {
          inputs: [{ id: 'in-1' }],
          outputs: [{ id: 'out-1', label: null }]
        }
      }
    ]
  }
];
```

- [ ] **Create `app-catalog.ts`** with all app/action definitions
- [ ] **Create node templates** per category (trigger, action, logic, helper)
- [ ] **Register templates in `NgDiagramNodeTemplateMap`**
- [ ] **Dynamic port generation** for branching nodes based on `params.branches`
- [ ] **Custom styling/icons** per app (use `color` from definition)

### Step 7: Undo/Redo & Command Pattern
- [ ] Implement proper command stack (not just stubs)
- [ ] Capture node data changes in history
- [ ] Integrate with `modelAdapter.undo()` / `redo()`

---

## ⚡ Phase 4: Execution Engine & Integration

### Step 8: Workflow Validation
- [ ] **Port compatibility rules** (output → input only)
- [ ] **Cycle detection** (prevent infinite loops)
- [ ] **Required field validation** before execution
- [ ] Visual error indicators on invalid nodes

### Step 9: Workflow Execution (Mock)
- [ ] **Topological sort** of graph for execution order
- [ ] **Visual feedback**: running (blue), success (green), error (red)
- [ ] **Mock execution engine** (setTimeout-based simulation)
- [ ] **Execution log panel**

### Step 10: Backend Integration
- [ ] **API Service** for CRUD operations:
  - `GET /workflows` - List
  - `GET /workflows/:id` - Load
  - `POST /workflows` - Create
  - `PUT /workflows/:id` - Update
  - `DELETE /workflows/:id` - Delete
- [ ] **Execution endpoint**: `POST /workflows/:id/execute`
- [ ] **Auth & Security**: JWT/OAuth integration
- [ ] Replace `LocalStorageModelAdapter` with API-backed adapter

---

## 🎨 Phase 5: Polish & Optimization

### Step 11: UX Improvements
- [ ] **Context menus** (right-click on node/edge/canvas)
- [ ] **Copy/Paste** with full data preservation
- [ ] **Grouping nodes** (collapsible sub-workflows)
- [ ] **Snap to grid** option
- [ ] **Keyboard navigation** between nodes

### Step 12: Performance & Testing
- [ ] **Performance profiling** with 50+ nodes
- [ ] **Virtualization** for large graphs (render visible only)
- [ ] **OnPush change detection** on all components
- [ ] **Unit tests** (Jest) for services and utilities
- [ ] **E2E tests** (Cypress/Playwright) for critical flows

### Step 13: Deployment & CI/CD
- [ ] **CI/CD pipeline** (GitHub Actions / GitLab CI)
- [ ] **Docker containerization**
- [ ] **Environment configs** (dev, staging, prod)
- [ ] **Versioning & changelog**

---

## 🔮 Future Considerations (Phase 6+)
- [ ] **Real-time collaboration** (WebSocket + CRDT/OT)
- [ ] **Version history** for workflows
- [ ] **Templates marketplace**
- [ ] **AI-assisted workflow generation**
- [ ] **Mobile-responsive canvas**

---

## 📊 Current Status

| Phase | Step | Status |
|-------|------|--------|
| Phase 1 | Step 1: Minimal POC | ✅ Complete |
| Phase 1 | Step 2: Core Functionalities | ⚠️ **UI Only - Needs Fixes** |
| Phase 2 | Step 3: JSON Schema & Import | 🚧 In Progress |
| Phase 2 | Step 4: Layout & UI | ⏳ Pending |
| Phase 3 | Step 5: Custom UI Inside Nodes | ⏳ Pending |
| Phase 3 | Step 6: Node Type Registry & App Catalog | ⏳ Pending |
| Phase 3 | Step 7: Undo/Redo & Command Pattern | ⏳ Pending |
| Phase 4 | Step 8: Workflow Validation | ⏳ Pending |
| Phase 4 | Step 9: Workflow Execution (Mock) | ⏳ Pending |
| Phase 4 | Step 10: Backend Integration | ⏳ Pending |
| Phase 5 | Step 11: UX Improvements | ⏳ Pending |
| Phase 5 | Step 12: Performance & Testing | ⏳ Pending |
| Phase 5 | Step 13: Deployment & CI/CD | ⏳ Pending |