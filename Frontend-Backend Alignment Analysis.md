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
| `GET /v1/workflows/:id` | ✅ Implemented | ✅ Supported | ✅# Frontend-Backend Alignment Analysis

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

**The frontend is well-positioned for the new architecture. The required changes are minimal and focused.**
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

**The frontend is well-positioned for the new architecture. The required changes are minimal and focused.**
 Compatible | None |
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

**The frontend is well-positioned for the new architecture. The required changes are minimal and focused.**
