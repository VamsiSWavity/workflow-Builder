import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, HostListener, computed } from '@angular/core';
import type { NgDiagramConfig, Node } from 'ng-diagram';
import {
  NgDiagramNodeTemplateMap,
  NgDiagramBackgroundComponent,
  NgDiagramComponent,
  NgDiagramModelService,
  NgDiagramSelectionService,
  NgDiagramViewportService,
  provideNgDiagram,
} from 'ng-diagram';
import { LocalStorageModelAdapter } from './local-storage-model-adapter';
import { NodeComponent } from './node/node.component';

enum NodeTemplateType {
  CustomNodeType = 'customNodeType',
}

@Component({
  selector: 'app-workflow-canvas-ngdiagram',
  standalone: true,
  imports: [CommonModule, NgDiagramComponent, NgDiagramBackgroundComponent],
  providers: [provideNgDiagram()],
  template: `
    <div class="example-container">
      <!-- Top Toolbar -->
      <div class="toolbar">
        <div class="toolbar-group">
          <button (click)="addNode()" title="Add Node">
            <span>➕</span> Add Node
          </button>
          <button (click)="deleteSelected()" [disabled]="!hasSelection()" title="Delete Selected (Del)">
            <span>🗑️</span> Delete
          </button>
        </div>
        
        <div class="toolbar-group">
          <button (click)="undo()" title="Undo (Ctrl+Z)">
            <span>↶</span> Undo
          </button>
          <button (click)="redo()" title="Redo (Ctrl+Y)">
            <span>↷</span> Redo
          </button>
        </div>
        
        <div class="toolbar-group">
          <button (click)="zoomIn()" title="Zoom In">
            <span>🔍+</span>
          </button>
          <button (click)="zoomOut()" title="Zoom Out">
            <span>🔍−</span>
          </button>
          <button (click)="zoomToFit()" title="Fit to View">
            <span>⛶</span> Fit
          </button>
        </div>
        
        <div class="toolbar-group">
          <button (click)="selectAll()" title="Select All (Ctrl+A)">
            <span>☑️</span> Select All
          </button>
        </div>

        <div class="toolbar-group">
          <button (click)="saveWorkflow()" title="Save Workflow">
            <span>💾</span> Save JSON
          </button>
          <button class="secondary" (click)="reset()" title="Reset Diagram">
            <span>🔄</span> Reset
          </button>
        </div>
      </div>

      <!-- Selection Info -->
      <div class="selection-info" *ngIf="hasSelection()">
        <span>Selected: {{ selectedNodesCount() }} nodes, {{ selectedEdgesCount() }} edges</span>
        <button class="small" (click)="deleteSelected()">Delete Selected</button>
      </div>

      <!-- Canvas -->
      <div class="diagram">
        <ng-diagram
          [model]="modelAdapter"
          [config]="config"
          [nodeTemplateMap]="nodeTemplateMap"
          (selectionChanged)="onSelectionChanged($event)"
          class="diagram"
        >
          <ng-diagram-background />
        </ng-diagram>
      </div>

      <!-- Status Bar -->
      <div class="status-bar">
        <span>Nodes: {{ nodeCount() }}</span>
        <span>Edges: {{ edgeCount() }}</span>
        <span>Zoom: Use mouse wheel</span>
        <span>Pan: Drag canvas</span>
        <span>Connect: Drag from port to port</span>
      </div>
    </div>
  `,
  styles: [`
    .example-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      background: #f5f7fa;
    }

    /* Toolbar */
    .toolbar {
      display: flex;
      gap: 16px;
      padding: 12px 16px;
      background: white;
      border-bottom: 1px solid #e2e8f0;
      flex-wrap: wrap;
    }

    .toolbar-group {
      display: flex;
      gap: 4px;
      padding-right: 16px;
      border-right: 1px solid #e2e8f0;
    }

    .toolbar-group:last-child {
      border-right: none;
    }

    .toolbar button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 13px;
      color: #475569;
      cursor: pointer;
      transition: all 0.2s;
    }

    .toolbar button:hover:not(:disabled) {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .toolbar button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .toolbar button.secondary {
      background: #fee2e2;
      border-color: #fecaca;
      color: #dc2626;
    }

    .toolbar button.secondary:hover {
      background: #fecaca;
    }

    /* Selection Info */
    .selection-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      background: #dbeafe;
      border-bottom: 1px solid #bfdbfe;
      font-size: 13px;
      color: #1e40af;
    }

    .selection-info button.small {
      padding: 4px 8px;
      font-size: 12px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .selection-info button.small:hover {
      background: #2563eb;
    }

    /* Canvas */
    .diagram {
      flex: 1;
      width: 100%;
      height: 100%;
    }

    /* Status Bar */
    .status-bar {
      display: flex;
      gap: 24px;
      padding: 8px 16px;
      background: #1e293b;
      color: #94a3b8;
      font-size: 12px;
    }

    .status-bar span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowCanvasNgDiagramComponent {
  nodeTemplateMap = new NgDiagramNodeTemplateMap([
    [NodeTemplateType.CustomNodeType, NodeComponent],
  ]);
  
  private modelService = inject(NgDiagramModelService);
  private selectionService = inject(NgDiagramSelectionService);
  private viewportService = inject(NgDiagramViewportService);
  
  // Store initial canvas state for reset
  private initialCanvasState: {
    nodes: Node[];
    edges: any[];
    viewport: { x: number; y: number; scale: number };
  };

  // Computed signals for UI
  nodeCount = computed(() => this.modelService.nodes().length);
  edgeCount = computed(() => this.modelService.edges().length);
  selectedNodesCount = computed(() => this.selectionService.selection().nodes.length);
  selectedEdgesCount = computed(() => this.selectionService.selection().edges.length);

  config: NgDiagramConfig = {
    zoom: {
      zoomToFit: {
        onInit: true,
        padding: 180,
      },
    },
  };

  modelAdapter: LocalStorageModelAdapter = new LocalStorageModelAdapter(
    'ng-diagram-custom-demo',
    this.getDefaultDiagram()
  );
  
  constructor() {
    // Store initial state when component is created
    const defaultDiagram = this.getDefaultDiagram();
    this.initialCanvasState = {
      nodes: this.deepClone(defaultDiagram.nodes),
      edges: this.deepClone(defaultDiagram.edges),
      viewport: { x: 0, y: 0, scale: 1 }
    };
    console.log('💾 Initial canvas state stored:', this.initialCanvasState);
  }

  // Check if anything is selected
  hasSelection(): boolean {
    const selection = this.selectionService.selection();
    return selection.nodes.length > 0 || selection.edges.length > 0;
  }

  // Keyboard shortcuts
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Delete key - delete selection
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (this.hasSelection()) {
        event.preventDefault();
        this.deleteSelected();
      }
    }
    
    // Ctrl+A - select all
    if (event.ctrlKey && event.key === 'a') {
      event.preventDefault();
      this.selectAll();
    }
    
    // Ctrl+Z - undo
    if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      this.undo();
    }
    
    // Ctrl+Y or Ctrl+Shift+Z - redo
    if ((event.ctrlKey && event.key === 'y') || (event.ctrlKey && event.shiftKey && event.key === 'z')) {
      event.preventDefault();
      this.redo();
    }
  }

  // Add new node
  addNode() {
    const existingNodes = this.modelService.nodes();
    const newId = `node-${crypto.randomUUID()}`;
    const randomX = Math.floor(Math.random() * 400) + 50;
    const randomY = Math.floor(Math.random() * 300) + 50;

    const newNode: Node = {
      id: newId,
      position: { x: randomX, y: randomY },
      data: { label: `Node ${existingNodes.length + 1}` },
      type: NodeTemplateType.CustomNodeType,
    };

    this.modelService.addNodes([newNode]);
    console.log('✅ Node added:', newId);
  }

  // Delete selected nodes and edges
  deleteSelected() {
    console.log('🗑️ DELETE CALLED');
    console.log('  Selection before:', this.selectionService.selection());
    console.log('  Nodes before:', this.modelService.nodes().length);
    
    this.selectionService.deleteSelection();
    
    console.log('  Selection after:', this.selectionService.selection());
    console.log('  Nodes after:', this.modelService.nodes().length);
    console.log('  Has selection now?', this.hasSelection());
  }

  // Select all nodes
  selectAll() {
    const nodeIds = this.modelService.nodes().map(n => n.id);
    const edgeIds = this.modelService.edges().map(e => e.id);
    this.selectionService.select(nodeIds, edgeIds);
    console.log('☑️ All selected');
  }

  // Undo
  undo() {
    this.modelAdapter.undo();
    console.log('↶ Undo');
  }

  // Redo
  redo() {
    this.modelAdapter.redo();
    console.log('↷ Redo');
  }

  // Zoom in
  zoomIn() {
    const currentScale = this.viewportService.viewport().scale;
    const newScale = currentScale * 1.2;
    console.log('🔍+ Zoom in:', currentScale, '→', newScale);
    this.viewportService.zoom(newScale);
  }

  // Zoom out
  zoomOut() {
    const currentScale = this.viewportService.viewport().scale;
    const newScale = currentScale * 0.8;
    console.log('🔍- Zoom out:', currentScale, '→', newScale);
    this.viewportService.zoom(newScale);
  }

  // Zoom to fit
  zoomToFit() {
    this.viewportService.zoomToFit({ padding: 50 });
    console.log('⛶ Zoom to fit');
  }

  // Selection changed event
  onSelectionChanged(event: any) {
    console.log('📌 SELECTION CHANGED EVENT:', {
      nodes: event.selectedNodes?.length || 0,
      edges: event.selectedEdges?.length || 0,
      hasSelection: this.hasSelection()
    });
  }

  // Reset diagram
  reset() {
    if (window.confirm('Are you sure you want to reset the diagram? This will clear all changes and undo/redo history.')) {
      this.resetDiagramToDefault();
    }
  }

  // Save workflow to JSON file
  saveWorkflow() {
    const jsonString = this.modelAdapter.toJSON();
    const data = JSON.parse(jsonString);
    
    // Add timestamp and version info
    const exportData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      ...data
    };

    const finalJson = JSON.stringify(exportData, null, 2);
    console.log('💾 Workflow saved:', exportData);

    // Trigger download
    const blob = new Blob([finalJson], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${new Date().getTime()}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private resetDiagramToDefault() {
    console.log('🔄 RESET BUTTON CLICKED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Step 1: Clear selection
    console.log('Step 1: Clearing selection...');
    this.selectionService.select([], []);
    console.log('  ✅ Selection cleared');
    
    // Step 2: Get current state
    const currentNodes = this.modelService.nodes();
    const currentEdges = this.modelService.edges();
    console.log('Step 2: Current state:', { 
      nodes: currentNodes.length, 
      edges: currentEdges.length 
    });
    
    // Step 3: Clear undo/redo stacks FIRST (before any operations)
    console.log('Step 3: Clearing undo/redo stacks...');
    this.modelAdapter.reset({
      nodes: [],
      edges: [],
      metadata: { viewport: { x: 0, y: 0, scale: 1 } }
    });
    
    // Step 4: Delete all current content
    console.log('Step 4: Deleting all current nodes and edges...');
    const nodeIds = currentNodes.map(n => n.id);
    const edgeIds = currentEdges.map(e => e.id);
    
    if (edgeIds.length > 0) {
      this.modelService.deleteEdges(edgeIds);
      console.log('  ✅ Deleted', edgeIds.length, 'edges');
    }
    if (nodeIds.length > 0) {
      this.modelService.deleteNodes(nodeIds);
      console.log('  ✅ Deleted', nodeIds.length, 'nodes');
    }
    
    // Step 5: Restore initial state
    console.log('Step 5: Restoring initial state...');
    const initialNodes = this.deepClone(this.initialCanvasState.nodes);
    const initialEdges = this.deepClone(this.initialCanvasState.edges);
    console.log('  Restoring:', { 
      nodes: initialNodes.length, 
      edges: initialEdges.length 
    });
    
    this.modelService.addNodes(initialNodes);
    console.log('  ✅ Added', initialNodes.length, 'nodes');
    
    this.modelService.addEdges(initialEdges);
    console.log('  ✅ Added', initialEdges.length, 'edges');
    
    // Step 6: Reset viewport
    console.log('Step 6: Resetting viewport...');
    setTimeout(() => {
      this.viewportService.zoomToFit({ padding: 180 });
      
      // Final verification
      const finalNodes = this.modelService.nodes();
      const finalEdges = this.modelService.edges();
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ RESET COMPLETE!');
      console.log('  Final state:', { 
        nodes: finalNodes.length, 
        edges: finalEdges.length 
      });
      console.log('  Expected:', { 
        nodes: this.initialCanvasState.nodes.length, 
        edges: this.initialCanvasState.edges.length 
      });
      console.log('  Match:', 
        finalNodes.length === this.initialCanvasState.nodes.length &&
        finalEdges.length === this.initialCanvasState.edges.length ? '✅ YES' : '❌ NO'
      );
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }, 100);
  }
  
  // Deep clone utility
  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  private getDefaultDiagram() {
    return {
      nodes: [
        {
          id: '1',
          position: { x: 0, y: 0 },
          data: { label: 'Node 1' },
          type: NodeTemplateType.CustomNodeType,
        },
        {
          id: '2',
          position: { x: 420, y: 0 },
          data: { label: 'Node 2' },
          type: NodeTemplateType.CustomNodeType,
        },
      ],
      edges: [
        {
          id: 'edge-1',
          source: '1',
          target: '2',
          sourcePort: 'port-right',
          targetPort: 'port-left',
          data: {},
        },
      ],
    };
  }
}
