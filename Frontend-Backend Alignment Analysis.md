# Frontend-Backend Alignment Analysis

## Updated Execution Engine Documentation Review

**Document**: `/home/wavity/repo/nexus/projects/UpdatedExecutionEngine_documentation.txt`

**Analysis Date**: December 16, 2024

---

## Executive Summary

After deep analysis of the updated execution engine documentation against the current frontend implementation, I've identified the following:

| Category | Status | Action Required |
|----------|--------|-----------------|
| **API Endpoints** | ✅ **Compatible** | Minor additions needed |
| **Workflow IR Format** | ⚠️ **Partial Mismatch** | Update required |
| **Status Lifecycle** | ⚠️ **Terminology Change** | Update required |
| **Data Model** | ⚠️ **Schema Differences** | Alignment needed |
| **Tool Integration** | ✅ **Compatible** | MCP awareness optional |
| **Trigger Configuration** | ✅ **Compatible** | Minor field rename |

**Overall Assessment**: The frontend implementation is **largely compatible** with the new architecture. A few targeted updates are needed, primarily around status terminology and IR format alignment.

---

## 1. Detailed Comparison Table

### 1.1 Workflow Status Lifecycle

| Aspect | Current Frontend | Updated Documentation | Gap | Action Required |
|--------|-----------------|----------------------|-----|-----------------|
| **Draft Status** | `draft` | `draft` | ✅ None | None |
| **Staging Status** | `staging` | N/A (not mentioned) | ⚠️ Possible removal | Verify with backend |
| **Production Status** | `production` | `published` | ⚠️ **Terminology change** | Update frontend |
| **Promotion Path** | `draft → staging → production` | `draft → published` (via compile) | ⚠️ **Simplified** | Update promotion logic |
| **Compile Step** | Not implemented | Required before publish | ⚠️ **New step** | Add compile API call |

**Key Finding**: The new architecture introduces a **compile step** before publishing. The status changes from `production` to `published`.

---

### 1.2 API Endpoints Comparison

| Endpoint | Current Frontend | Updated Documentation | Status | Action |
|----------|-----------------|----------------------|--------|--------|
| `GET /v1/workflows` | ✅ Implemented | ✅ Supported | ✅ Compatible | None |
| `POST /v1/workflows` | ✅ Implemented | ✅ Supported | ✅ Compatible | None |
| `GET /v1/workflows/:id` | ✅ Implemented | ✅ Supported | ✅ Compatible | None |
| `PUT /v1/workflows/:id` | ✅ Implemented | ✅ Supported | ✅ Compatible | None |
| `DELETE /v1/workflows/:id` | ✅ Implemented | ✅ Supported | ✅ Compatible | None |
| `POST /v1/workflows/:id/promote` | ✅ Implemented | ⚠️ May change | ⚠️ Review | See below |
| `POST /v1/workflows/:id/compile` | ❌ Not implemented | ✅ **NEW - Required** | ⚠️ **Add** | Implement |
| `POST /v1/workflows/:id/publish` | ❌ Not implemented | ✅ **NEW - Required** | ⚠️ **Add** | Implement |
| `POST /v1/workflows/validate` | ✅ Implemented | ✅ Supported | ✅ Compatible | None |
| `GET /v1/runs` | ❌ Not implemented | ✅ **NEW** | ⚠️ Optional | Future |
| `GET /v1/runs/:id` | ❌ Not implemented | ✅ **NEW** | ⚠️ Optional | Future |
| `POST /v1/tools` | ❌ Not implemented | ✅ **NEW (MCP)** | ⚠️ Optional | Future |

---

### 1.3 Workflow IR Format Comparison

| Field | Current Frontend IR | Updated Documentation | Gap | Action |
|-------|--------------------|-----------------------|-----|--------|
| `workflow_id` | ✅ `workflow_id: string` | ✅ Same | ✅ None | None |
| `name` | ✅ `name: string` | ✅ Same | ✅ None | None |
| `description` | ✅ `description?: string` | ✅ Same | ✅ None | None |
| `trigger` | ✅ Object with type/app/entity | ✅ Same | ✅ None | None |
| `trigger.filter` | ✅ `filter?: Record<string, any>` | ✅ `trigger_filter: JSONB` | ⚠️ Rename | Update field name |
| `nodes` | ✅ Array of WorkflowIRNode | ✅ Same structure | ✅ None | None |
| `nodes[].type` | `start\|tool_call\|function\|router\|channel\|end` | Same + LangGraph types | ✅ Compatible | None |
| `version` | ✅ `version?: string` | ✅ Same | ✅ None | None |
| `tags` | ✅ `tags?: string[]` | ✅ Same | ✅ None | None |
| `category` | ✅ `category?: string` | ✅ Same | ✅ None | None |

**IR Format Assessment**: ✅ **Highly Compatible** - The IR format is well-aligned with the new architecture.

---

### 1.4 Database Schema Comparison

| Table | Current Frontend Assumption | Updated Documentation | Gap | Frontend Impact |
|-------|---------------------------|----------------------|-----|-----------------|
| `workflows` | ✅ Exists | ✅ Exists | ✅ None | None |
| `workflows.ir` | ✅ JSONB column | ✅ Same | ✅ None | None |
| `workflows.status` | `draft\|staging\|production` | `draft\|published` | ⚠️ Values changed | Update status handling |
| `compiled_artifacts` | ❌ Not used | ✅ **NEW** | ⚠️ Backend only | None (backend handles) |
| `workflow_triggers` | ❌ Not used | ✅ **NEW** | ⚠️ Backend only | None (backend handles) |
| `workflow_runs` | ❌ Not used | ✅ **NEW** | ⚠️ Future UI | Optional runs dashboard |
| `workflow_waiters` | ❌ Not used | ✅ **NEW** | ⚠️ Backend only | None |

**Schema Assessment**: The new tables (`compiled_artifacts`, `workflow_triggers`, `workflow_runs`, `workflow_waiters`) are **backend-only** and don't require frontend changes. The frontend continues to interact with the `workflows` table via API.

---

### 1.5 Trigger Configuration Comparison

| Trigger Field | Current Frontend | Updated Documentation | Gap | Action |
|--------------|-----------------|----------------------|-----|--------|
| `type` | `record_created\|record_updated\|webhook\|schedule` | `event\|schedule\|webhook` | ⚠️ **Terminology** | Map values |
| `application` | ✅ `application: string` | ✅ Same | ✅ None | None |
| `entity` | ✅ `entity: string` | ✅ Same | ✅ None | None |
| `filter` | ✅ `filter?: object` | ✅ `trigger_filter: JSONB` | ⚠️ Rename | Update field name |

**Trigger Type Mapping**:
| Frontend Value | Backend Value |
|---------------|---------------|
| `record_created` | `event` |
| `record_updated` | `event` |
| `webhook` | `webhook` |
| `schedule` | `schedule` |

---

### 1.6 Tool/Action Configuration Comparison

| Aspect | Current Frontend | Updated Documentation | Gap | Action |
|--------|-----------------|----------------------|-----|--------|
| **Tool Discovery** | Hardcoded list | MCP Server discovery | ⚠️ Enhancement | Optional: Add MCP integration |
| **Tool Execution** | `tool_call` node type | Same via MCP | ✅ Compatible | None |
| **Channel Actions** | `channel` node type | Channels as Tools (MCP) | ✅ Compatible | None |
| **Tool Registry** | Local constants | `nexus_tools` table via MCP | ⚠️ Enhancement | Optional: Fetch from API |

**Tool Integration Assessment**: The current hardcoded tool list works fine. MCP integration is an **optional enhancement** for dynamic tool discovery.

---

## 2. Publish Workflow Flow Comparison

### 2.1 Current Frontend Flow

```
User clicks "Publish"
    ↓
Save latest IR (PUT /v1/workflows/:id)
    ↓
Promote to staging (POST /v1/workflows/:id/promote { targetStatus: 'staging' })
    ↓
Promote to production (POST /v1/workflows/:id/promote { targetStatus: 'production' })
    ↓
Done (status: 'production')
```

### 2.2 New Documentation Flow

```
User clicks "Publish"
    ↓
Save latest IR (PUT /v1/workflows/:id)
    ↓
Compile workflow (POST /v1/workflows/:id/compile) ← NEW STEP
    ↓
    ├── Validates IR
    ├── Generates RuntimeArtifact
    ├── Inserts into compiled_artifacts
    ├── Extracts triggers to workflow_triggers
    ↓
Update status to 'published' (automatic or via API)
    ↓
Done (status: 'published')
```

### 2.3 Gap Analysis

| Step | Current | New | Gap |
|------|---------|-----|-----|
| 1. Save IR | ✅ Same | ✅ Same | None |
| 2. Validate | ✅ Client-side | ✅ Server-side (compile) | Enhanced |
| 3. Compile | ❌ Missing | ✅ Required | **Add API call** |
| 4. Extract Triggers | ❌ Missing | ✅ Automatic (compile) | Backend handles |
| 5. Status Update | `production` | `published` | **Update terminology** |

---

## 3. Required Frontend Changes

### 3.1 High Priority (Required for Compatibility)

#### Change 1: Update Status Terminology

**File**: `/lib/types/workflow.types.ts`

```typescript
// BEFORE
status: 'draft' | 'staging' | 'production';

// AFTER (if staging is removed)
status: 'draft' | 'published';

// OR (if staging is kept)
status: 'draft' | 'staging' | 'published';
```

**Impact**: Low - Simple enum update

---

#### Change 2: Add Compile API Call

**File**: `/lib/api/workflow.api.ts`

```typescript
// ADD NEW FUNCTION
compileWorkflow: async (id: string): Promise<{ success: boolean; artifact_id: string }> => {
  const response = await apiClient.post(`/v1/workflows/${id}/compile`);
  return response.data;
},
```

**Impact**: Low - New API function

---

#### Change 3: Update Publish Flow

**File**: `/pages/DesignerPage/DesignerPage.tsx`

```typescript
// BEFORE
const handlePublishWorkflow = async () => {
  await workflowApi.saveWorkflowIR(ir, id);
  await workflowApi.promoteWorkflow(id, 'staging');
  await workflowApi.promoteWorkflow(id, 'production');
};

// AFTER
const handlePublishWorkflow = async () => {
  // Step 1: Save latest changes
  await workflowApi.saveWorkflowIR(ir, id);
  toast.success('Workflow saved', { icon: '💾' });
  
  // Step 2: Compile workflow (validates + generates artifact)
  await workflowApi.compileWorkflow(id);
  toast.success('Workflow compiled', { icon: '⚙️' });
  
  // Step 3: Status is automatically set to 'published' by compile
  // OR call explicit publish endpoint if needed
  toast.success('Workflow published', { icon: '🚀' });
};
```

**Impact**: Medium - Logic change in publish handler

---

#### Change 4: Update Trigger Type Mapping

**File**: `/lib/utils/workflowIRExport.ts`

```typescript
// ADD MAPPING FUNCTION
function mapTriggerTypeToBackend(frontendType: string): string {
  const mapping: Record<string, string> = {
    'record_created': 'event',
    'record_updated': 'event',
    'webhook': 'webhook',
    'schedule': 'schedule'
  };
  return mapping[frontendType] || 'event';
}

// UPDATE TRIGGER CONFIG
const triggerConfig = {
  type: mapTriggerTypeToBackend(triggerNode.data.triggerType),
  application: triggerNode.data.application,
  entity: triggerNode.data.entity,
  trigger_filter: triggerNode.data.filter || null  // Renamed from 'filter'
};
```

**Impact**: Low - Simple mapping

---

### 3.2 Medium Priority (Recommended)

#### Change 5: Add Workflow Runs Dashboard (Optional)

**New File**: `/pages/RunsPage/RunsPage.tsx`

```typescript
// New page to view workflow execution runs
// Uses: GET /v1/runs, GET /v1/runs/:id
```

**Impact**: Medium - New feature, not blocking

---

#### Change 6: Dynamic Tool Discovery via MCP (Optional)

**File**: `/lib/api/tools.api.ts`

```typescript
// ADD NEW API
export const toolsApi = {
  getAvailableTools: async (): Promise<Tool[]> => {
    const response = await apiClient.get('/v1/tools');
    return response.data;
  }
};
```

**Impact**: Low - Enhancement for tool picker

---

### 3.3 Low Priority (Future Enhancements)

| Enhancement | Description | Priority |
|-------------|-------------|----------|
| Run Status Viewer | Show workflow execution status | Low |
| Waiter Management | UI for human-in-the-loop approvals | Low |
| Checkpoint Viewer | Debug workflow state | Low |
| MCP Tool Browser | Browse available MCP tools | Low |

---

## 4. Risk Assessment

### 4.1 Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **Status terminology mismatch** | Medium | High | Update frontend before backend deploys |
| **Missing compile step** | High | High | Add compile API call before publish |
| **Staging status removal** | Low | Medium | Verify with backend team |
| **API response format change** | Medium | Low | Add response type guards |
| **Trigger type mapping** | Low | Medium | Add mapping function |

### 4.2 Breaking Changes

| Change | Breaking? | Workaround |
|--------|-----------|------------|
| `production` → `published` | ⚠️ Yes | Backend can support both temporarily |
| Compile step required | ⚠️ Yes | Frontend must add compile call |
| `filter` → `trigger_filter` | ⚠️ Yes | Backend can accept both |

---

## 5. Recommended Action Plan

### Phase 1: Immediate (Before Backend Deployment)

| # | Task | File | Effort | Priority |
|---|------|------|--------|----------|
| 1 | Add `compileWorkflow` API function | `workflow.api.ts` | 15 min | 🔴 High |
| 2 | Update `handlePublishWorkflow` to call compile | `DesignerPage.tsx` | 30 min | 🔴 High |
| 3 | Update status enum to include `published` | `workflow.types.ts` | 10 min | 🔴 High |
| 4 | Add trigger type mapping function | `workflowIRExport.ts` | 15 min | 🟡 Medium |
| 5 | Rename `filter` to `trigger_filter` in IR export | `workflowIRExport.ts` | 10 min | 🟡 Medium |

**Total Effort**: ~1.5 hours

### Phase 2: Short-Term (After Backend Deployment)

| # | Task | File | Effort | Priority |
|---|------|------|--------|----------|
| 6 | Add workflow runs list page | New page | 4 hours | 🟡 Medium |
| 7 | Add run detail view | New page | 2 hours | 🟡 Medium |
| 8 | Integrate MCP tool discovery | `tools.api.ts` | 2 hours | 🟢 Low |

### Phase 3: Future (Optional Enhancements)

| # | Task | Effort | Priority |
|---|------|--------|----------|
| 9 | Human-in-the-loop approval UI | 8 hours | 🟢 Low |
| 10 | Workflow debugging/checkpoint viewer | 6 hours | 🟢 Low |
| 11 | Real-time run status updates (WebSocket) | 4 hours | 🟢 Low |

---

## 6. Compatibility Matrix

### 6.1 Current Frontend vs. New Backend

| Feature | Current Frontend | New Backend | Compatible? |
|---------|-----------------|-------------|-------------|
| Create workflow | ✅ | ✅ | ✅ Yes |
| Update workflow | ✅ | ✅ | ✅ Yes |
| Delete workflow | ✅ | ✅ | ✅ Yes |
| List workflows | ✅ | ✅ | ✅ Yes |
| Validate IR | ✅ | ✅ | ✅ Yes |
| Promote workflow | ✅ | ⚠️ Changed | ⚠️ Update needed |
| Compile workflow | ❌ | ✅ | ⚠️ Add API call |
| Publish workflow | ⚠️ Via promote | ✅ Via compile | ⚠️ Update flow |
| View runs | ❌ | ✅ | ⚠️ New feature |
| Tool discovery | Hardcoded | MCP | ⚠️ Optional |

### 6.2 IR Format Compatibility

| IR Field | Frontend | Backend | Compatible? |
|----------|----------|---------|-------------|
| `workflow_id` | ✅ | ✅ | ✅ Yes |
| `name` | ✅ | ✅ | ✅ Yes |
| `description` | ✅ | ✅ | ✅ Yes |
| `trigger.type` | `record_created` | `event` | ⚠️ Map values |
| `trigger.application` | ✅ | ✅ | ✅ Yes |
| `trigger.entity` | ✅ | ✅ | ✅ Yes |
| `trigger.filter` | ✅ | `trigger_filter` | ⚠️ Rename |
| `nodes` | ✅ | ✅ | ✅ Yes |
| `nodes[].type` | ✅ | ✅ | ✅ Yes |
| `nodes[].tool` | ✅ | ✅ | ✅ Yes |
| `nodes[].input` | ✅ | ✅ | ✅ Yes |
| `nodes[].output` | ✅ | ✅ | ✅ Yes |
| `nodes[].next` | ✅ | ✅ | ✅ Yes |

---

## 7. Summary

### What's Working ✅

1. **Core CRUD operations** - All workflow create/read/update/delete operations are compatible
2. **IR format** - The workflow IR structure is well-aligned
3. **Node types** - All node types (tool_call, function, router, channel) are supported
4. **Validation** - Client-side validation aligns with server-side
5. **Multi-tenant isolation** - Already implemented correctly

### What Needs Change ⚠️

1. **Add compile API call** - New step before publishing
2. **Update status terminology** - `production` → `published`
3. **Map trigger types** - `record_created` → `event`
4. **Rename filter field** - `filter` → `trigger_filter`
5. **Update publish flow** - Add compile step

### What's Optional 🟢

1. **MCP tool discovery** - Dynamic tool loading
2. **Runs dashboard** - View workflow executions
3. **Human-in-the-loop UI** - Approval workflows
4. **Real-time updates** - WebSocket for run status

---

## 8. Conclusion

**The current frontend implementation is ~85% compatible with the new execution engine architecture.**

### Required Changes (Blocking)

| Change | Effort | Impact |
|--------|--------|--------|
| Add compile API | 15 min | High |
| Update publish flow | 30 min | High |
| Update status enum | 10 min | Medium |
| Map trigger types | 15 min | Low |
| Rename filter field | 10 min | Low |

**Total Required Effort**: ~1.5 hours

### Recommended Approach

1. **Coordinate with backend team** to confirm:
   - Is `staging` status being removed?
   - What's the exact compile API endpoint?
   - Will backend support both `production` and `published` temporarily?

2. **Implement Phase 1 changes** before backend deployment

3. **Test end-to-end** with new backend

4. **Add optional features** (runs dashboard, MCP) in Phase 2

---

## 9. Workarounds & Hardcoded Values Inventory

This section documents all temporary workarounds, hardcoded values, and placeholder implementations in the workflow-designer that need to be addressed for production readiness.

---

### 9.1 Mock Data & Temporary Flags

#### **Issue #1: Mock Data Flag in PromptWorkflowsPage**

**File**: `/pages/PromptWorkflowsPage/PromptWorkflowsPage.tsx`

**Lines**: 60-137

**Current Code**:
```typescript
// TEMPORARY: Use mock data until authentication is set up
// Set to false to use real API
const USE_MOCK_DATA = true;

// Mock data functions
const getMockApprovedWorkflows = async (): Promise<WorkflowListItem[]> => [
  { id: 'wf-prod-1', name: 'Customer Onboarding Flow', ... },
  { id: 'wf-prod-2', name: 'Support Ticket Routing', ... },
];

const getMockDraftWorkflows = async (): Promise<WorkflowListItem[]> => [
  { id: 'wf-draft-1', name: 'Email Campaign Automation', ... },
  ...
];

// Used in queries
queryFn: USE_MOCK_DATA ? getMockApprovedWorkflows : workflowApi.getApprovedWorkflows,
queryFn: USE_MOCK_DATA ? getMockDraftWorkflows : workflowApi.getDraftWorkflows,
```

**Problem**: Mock data bypasses real API, hiding authentication/integration issues.

**Solution**:
```typescript
// REMOVE mock data entirely and use real API
const USE_MOCK_DATA = false; // Or remove the flag completely

// Update queries to always use real API
const { data: approvedWorkflows = [] } = useQuery({
  queryKey: ['workflows', 'approved'],
  queryFn: workflowApi.getApprovedWorkflows,
  retry: 1,
  refetchOnWindowFocus: false,
});
```

**Priority**: 🔴 **High** - Must fix before production

---

#### **Issue #2: Placeholder Trigger Configuration Panel**

**File**: `/components/panels/TriggerConfigPanel.tsx`

**Lines**: 42-47

**Current Code**:
```tsx
<div className="notice-banner">
  <AlertCircle size={18} />
  <div>
    <strong>Placeholder Configuration</strong>
    <p>Backend trigger implementation is pending. This is a temporary UI for configuration.</p>
  </div>
</div>
```

**Problem**: Users see a warning that backend is not ready.

**Solution**:
```tsx
// Remove the notice banner once backend trigger service is implemented
// The panel functionality is complete, only the notice needs removal
```

**Priority**: 🟡 **Medium** - Remove after backend trigger service is ready

---

### 9.2 Hardcoded Tool Lists

#### **Issue #3: Static Tool List in ToolConfigPanel**

**File**: `/components/panels/ToolConfigPanel.tsx`

**Lines**: 17-25

**Current Code**:
```typescript
const AVAILABLE_TOOLS = [
  { id: 'sentiment_analyzer', name: 'Sentiment Analyzer', description: 'Analyze sentiment of text' },
  { id: 'record_update', name: 'Update Record', description: 'Update a record in the database' },
  { id: 'record_create', name: 'Create Record', description: 'Create a new record' },
  { id: 'send_email', name: 'Send Email', description: 'Send an email notification' },
  { id: 'send_slack', name: 'Send Slack Message', description: 'Send a Slack notification' },
  { id: 'http_request', name: 'HTTP Request', description: 'Make an HTTP API call' },
  { id: 'data_transform', name: 'Transform Data', description: 'Transform data using expressions' },
];
```

**Problem**: Tools are hardcoded, not fetched from MCP/backend.

**Solution**:
```typescript
// Create tools API service
// File: /lib/api/tools.api.ts
export const toolsApi = {
  getAvailableTools: async (): Promise<Tool[]> => {
    const response = await apiClient.get('/v1/tools');
    return response.data.data;
  }
};

// Update ToolConfigPanel to fetch tools dynamically
function ToolConfigPanel({ ... }) {
  const { data: availableTools = [], isLoading } = useQuery({
    queryKey: ['tools'],
    queryFn: toolsApi.getAvailableTools,
  });
  
  // Use availableTools instead of AVAILABLE_TOOLS
}
```

**Priority**: 🟡 **Medium** - Implement when MCP tool discovery is ready

---

#### **Issue #4: Static Template Variables List**

**File**: `/components/panels/ToolConfigPanel.tsx`

**Lines**: 27-36

**Current Code**:
```typescript
const TEMPLATE_VARIABLES = [
  { key: 'record.id', description: 'Record ID' },
  { key: 'record.title', description: 'Record title' },
  { key: 'record.description', description: 'Record description' },
  { key: 'record.created_by', description: 'Creator information' },
  { key: 'record.created_at', description: 'Creation timestamp' },
  { key: 'record.status', description: 'Record status' },
  { key: 'trigger.application', description: 'Application name' },
  { key: 'trigger.entity', description: 'Entity type' },
];
```

**Problem**: Variables are hardcoded, should be dynamic based on entity schema.

**Solution**:
```typescript
// Fetch entity schema from backend
const { data: entitySchema } = useQuery({
  queryKey: ['entity-schema', triggerApplication, triggerEntity],
  queryFn: () => schemaApi.getEntityFields(triggerApplication, triggerEntity),
  enabled: !!triggerApplication && !!triggerEntity,
});

// Generate template variables from schema
const templateVariables = useMemo(() => {
  const baseVars = [
    { key: 'trigger.application', description: 'Application name' },
    { key: 'trigger.entity', description: 'Entity type' },
  ];
  
  if (entitySchema?.fields) {
    const recordVars = entitySchema.fields.map(field => ({
      key: `record.${field.name}`,
      description: field.description || field.name,
    }));
    return [...baseVars, ...recordVars];
  }
  
  return [...baseVars, ...TEMPLATE_VARIABLES]; // Fallback to hardcoded
}, [entitySchema]);
```

**Priority**: 🟢 **Low** - Enhancement for better UX

---

### 9.3 Hardcoded Default Values

#### **Issue #5: Default Trigger Configuration in IR Export**

**File**: `/lib/utils/workflowIRExport.ts`

**Lines**: 49-54

**Current Code**:
```typescript
// Extract trigger configuration from trigger node data
const triggerConfig: WorkflowIRTrigger = triggerNode.data.triggerConfig || {
  type: 'record_created',
  application: 'ticket_management',
  entity: 'ticket',
};
```

**Problem**: Falls back to hardcoded ticket_management defaults.

**Solution**:
```typescript
// Throw error if trigger not configured instead of using defaults
const triggerConfig: WorkflowIRTrigger = triggerNode.data.triggerConfig;

if (!triggerConfig || !triggerConfig.type) {
  throw new Error('Trigger node must be configured before export. Please configure the trigger.');
}

// Or use a more generic default
const triggerConfig: WorkflowIRTrigger = triggerNode.data.triggerConfig || {
  type: 'record_created',
  application: null,  // Force user to configure
  entity: null,
};
```

**Priority**: 🟡 **Medium** - Prevents silent misconfiguration

---

#### **Issue #6: Default Initial Nodes in DesignerPage**

**File**: `/pages/DesignerPage/DesignerPage.tsx`

**Lines**: 40-72

**Current Code**:
```typescript
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 250, y: 100 },
    data: {
      label: 'Ticket Priority Created',
      description: 'Create a Ticket when...',
      status: 'available',
    },
  },
  {
    id: '2',
    type: 'action',
    position: { x: 250, y: 250 },
    data: {
      label: 'Send email',
      description: 'Send an email with the ticket details to the creator.',
      ...
    },
  },
  ...
];
```

**Problem**: Demo/example nodes shown by default, not a blank canvas.

**Solution**:
```typescript
// Start with empty canvas or minimal starter template
const initialNodes: Node[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 250, y: 100 },
    data: {
      label: 'Configure Trigger',
      description: 'Click to configure when this workflow should run',
      status: 'unconfigured',
    },
  },
];

const initialEdges: Edge[] = [];

// Or completely empty
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];
```

**Priority**: 🟢 **Low** - UX preference

---

### 9.4 Hardcoded Prompt Parsing Logic

#### **Issue #7: Keyword-Based Prompt Parsing**

**File**: `/lib/services/workflowGenerator.service.ts`

**Lines**: 24-110

**Current Code**:
```typescript
function parsePrompt(prompt: string) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Hardcoded entity detection
  if (lowerPrompt.includes('ticket')) {
    trigger.application = 'ticket_management';
    trigger.entity = 'ticket';
  } else if (lowerPrompt.includes('incident')) {
    trigger.application = 'incident_management';
    trigger.entity = 'incident';
  } else if (lowerPrompt.includes('customer')) {
    trigger.application = 'crm';
    trigger.entity = 'customer';
  }
  
  // Hardcoded action detection
  if (lowerPrompt.includes('sentiment') || lowerPrompt.includes('analyze')) {
    actions.push({ tool: 'sentiment_analyzer', ... });
  }
  ...
}
```

**Problem**: Simple keyword matching, not AI-powered. Limited to hardcoded entities/tools.

**Solution**:
```typescript
// Option 1: Use backend LLM endpoint
async function parsePromptWithAI(prompt: string) {
  const response = await apiClient.post('/v1/workflows/generate-from-prompt', {
    prompt,
    availableEntities: await getAvailableEntities(),
    availableTools: await getAvailableTools(),
  });
  return response.data;
}

// Option 2: Enhance local parsing with entity/tool registry
async function parsePrompt(prompt: string) {
  const entities = await entityApi.getAvailableEntities();
  const tools = await toolsApi.getAvailableTools();
  
  // Dynamic entity matching
  const matchedEntity = entities.find(e => 
    prompt.toLowerCase().includes(e.name.toLowerCase())
  );
  
  // Dynamic tool matching
  const matchedTools = tools.filter(t =>
    t.keywords.some(k => prompt.toLowerCase().includes(k))
  );
  
  return { trigger: { entity: matchedEntity }, actions: matchedTools };
}
```

**Priority**: 🟡 **Medium** - Significant UX improvement

---

### 9.5 Hardcoded Triggers & Actions Lists

#### **Issue #8: Static Triggers List in PromptWorkflowsPage**

**File**: `/pages/PromptWorkflowsPage/PromptWorkflowsPage.tsx`

**Lines**: 185-196

**Current Code**:
```typescript
const triggers: TriggerAction[] = [
  { name: 'Email Received', description: 'Triggers when new email arrives', icon: 'mail' },
  { name: 'Slack Message', description: 'Triggers when message posted in Slack', icon: 'message' },
  { name: 'Ticket Creation', description: 'Triggers when new ticket creation', icon: 'ticket' },
  { name: 'Form Submission', description: 'Triggers when form is submitted', icon: 'file' },
  { name: 'Schedule', description: 'Triggers at scheduled time', icon: 'clock' }
];
```

**Problem**: Hardcoded trigger types, not from backend.

**Solution**:
```typescript
// Fetch available triggers from backend
const { data: triggers = [] } = useQuery({
  queryKey: ['available-triggers'],
  queryFn: async () => {
    const response = await apiClient.get('/v1/triggers/types');
    return response.data.data;
  },
});
```

**Priority**: 🟡 **Medium** - Align with backend capabilities

---

#### **Issue #9: Static Actions List in PromptWorkflowsPage**

**File**: `/pages/PromptWorkflowsPage/PromptWorkflowsPage.tsx`

**Lines**: 198-208

**Current Code**:
```typescript
const actions: TriggerAction[] = [
  { name: 'Send Email', description: 'Send email to specified recipients', icon: 'mail' },
  { name: 'Log Event', description: 'Log event to database', icon: 'file' },
  { name: 'Ticket Creation', description: 'Ticket Creation to high priority', icon: 'ticket' },
  { name: 'Post Message', description: 'Post message to Slack channel', icon: 'message' },
  { name: 'Update Database', description: 'Update records in database', icon: 'database' }
];
```

**Problem**: Hardcoded actions, not from MCP tool registry.

**Solution**:
```typescript
// Fetch available actions/tools from MCP
const { data: actions = [] } = useQuery({
  queryKey: ['available-tools'],
  queryFn: toolsApi.getAvailableTools,
});
```

**Priority**: 🟡 **Medium** - Align with MCP tool discovery

---

### 9.6 Hardcoded Node Categories

#### **Issue #10: Static Node Categories in DesignerPage**

**File**: `/pages/DesignerPage/DesignerPage.tsx`

**Lines**: 115-165

**Current Code**:
```typescript
const nodeCategories = [
  {
    name: "Triggers",
    nodes: [
      { type: "trigger", subType: "Webhook", label: "Webhook", icon: "🪝" },
      { type: "trigger", subType: "Schedule", label: "Schedule", icon: "⏰" },
      { type: "trigger", subType: "Manual", label: "Manual", icon: "👆" },
    ],
  },
  {
    name: "HTTP & APIs",
    nodes: [
      { type: "action", subType: "HTTP", label: "HTTP Request", icon: "🌐" },
      ...
    ],
  },
  ...
];
```

**Problem**: Node palette is hardcoded, not dynamic.

**Solution**:
```typescript
// Fetch node categories from backend
const { data: nodeCategories = [] } = useQuery({
  queryKey: ['node-categories'],
  queryFn: async () => {
    const [triggers, tools] = await Promise.all([
      apiClient.get('/v1/triggers/types'),
      toolsApi.getAvailableTools(),
    ]);
    
    return [
      {
        name: "Triggers",
        nodes: triggers.data.data.map(t => ({
          type: "trigger",
          subType: t.type,
          label: t.name,
          icon: t.icon,
        })),
      },
      {
        name: "Tools",
        nodes: tools.map(t => ({
          type: "action",
          subType: t.id,
          label: t.name,
          icon: t.icon || "🔧",
        })),
      },
    ];
  },
});
```

**Priority**: 🟢 **Low** - Enhancement for extensibility

---

### 9.7 Summary Table: All Workarounds & Hardcoded Values

| # | Issue | File | Type | Priority | Effort | Solution |
|---|-------|------|------|----------|--------|----------|
| 1 | Mock data flag `USE_MOCK_DATA = true` | `PromptWorkflowsPage.tsx` | **Workaround** | 🔴 High | 10 min | Set to `false` or remove |
| 2 | Placeholder notice in TriggerConfigPanel | `TriggerConfigPanel.tsx` | **Placeholder** | 🟡 Medium | 5 min | Remove after backend ready |
| 3 | Static `AVAILABLE_TOOLS` list | `ToolConfigPanel.tsx` | **Hardcoded** | 🟡 Medium | 2 hrs | Fetch from `/v1/tools` |
| 4 | Static `TEMPLATE_VARIABLES` list | `ToolConfigPanel.tsx` | **Hardcoded** | 🟢 Low | 3 hrs | Fetch from entity schema |
| 5 | Default trigger config fallback | `workflowIRExport.ts` | **Hardcoded** | 🟡 Medium | 15 min | Throw error or use null |
| 6 | Demo initial nodes | `DesignerPage.tsx` | **Hardcoded** | 🟢 Low | 15 min | Start with empty/minimal |
| 7 | Keyword-based prompt parsing | `workflowGenerator.service.ts` | **Workaround** | 🟡 Medium | 4 hrs | Use AI/backend parsing |
| 8 | Static triggers list | `PromptWorkflowsPage.tsx` | **Hardcoded** | 🟡 Medium | 1 hr | Fetch from backend |
| 9 | Static actions list | `PromptWorkflowsPage.tsx` | **Hardcoded** | 🟡 Medium | 1 hr | Fetch from MCP |
| 10 | Static node categories | `DesignerPage.tsx` | **Hardcoded** | 🟢 Low | 2 hrs | Fetch from backend |

---

### 9.8 Recommended Cleanup Order

#### **Phase 1: Critical (Before Production)** 🔴

| Task | File | Effort |
|------|------|--------|
| Remove `USE_MOCK_DATA` flag | `PromptWorkflowsPage.tsx` | 10 min |
| Fix default trigger fallback | `workflowIRExport.ts` | 15 min |

**Total**: ~25 minutes

#### **Phase 2: Important (With Backend Integration)** 🟡

| Task | File | Effort |
|------|------|--------|
| Remove placeholder notice | `TriggerConfigPanel.tsx` | 5 min |
| Fetch tools from API | `ToolConfigPanel.tsx` | 2 hrs |
| Fetch triggers from API | `PromptWorkflowsPage.tsx` | 1 hr |
| Fetch actions from API | `PromptWorkflowsPage.tsx` | 1 hr |
| Improve prompt parsing | `workflowGenerator.service.ts` | 4 hrs |

**Total**: ~8 hours

#### **Phase 3: Enhancement (Future)** 🟢

| Task | File | Effort |
|------|------|--------|
| Dynamic template variables | `ToolConfigPanel.tsx` | 3 hrs |
| Clean initial nodes | `DesignerPage.tsx` | 15 min |
| Dynamic node categories | `DesignerPage.tsx` | 2 hrs |

**Total**: ~5.5 hours

---

**The frontend is well-positioned for the new architecture. The required changes are minimal and focused.**
