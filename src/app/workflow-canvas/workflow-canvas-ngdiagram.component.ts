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
    this.selectionService.deleteSelection();
    console.log('🗑️ Selection deleted');
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
    this.viewportService.zoom(1.2);
    console.log('🔍+ Zoom in');
  }

  // Zoom out
  zoomOut() {
    this.viewportService.zoom(0.8);
    console.log('🔍- Zoom out');
  }

  // Zoom to fit
  zoomToFit() {
    this.viewportService.zoomToFit({ padding: 50 });
    console.log('⛶ Zoom to fit');
  }

  // Selection changed event
  onSelectionChanged(event: any) {
    console.log('📌 Selection changed:', {
      nodes: event.selectedNodes?.length || 0,
      edges: event.selectedEdges?.length || 0
    });
  }

  // Reset diagram
  reset() {
    if (window.confirm('Are you sure you want to reset the diagram?')) {
      this.resetDiagramToDefault();
    }
  }

  private resetDiagramToDefault() {
    const nodeIds = this.modelService.nodes().map((node) => node.id);
    const edgeIds = this.modelService.edges().map((edge) => edge.id);
    this.modelService.deleteNodes(nodeIds);
    this.modelService.deleteEdges(edgeIds);

    const defaultDiagram = this.getDefaultDiagram();
    this.modelService.addNodes(defaultDiagram.nodes);
    this.modelService.addEdges(defaultDiagram.edges);
    console.log('🔄 Diagram reset');
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
