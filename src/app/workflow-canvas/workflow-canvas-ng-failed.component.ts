import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  NgDiagramComponent, 
  initializeModel, 
  provideNgDiagram,
  NgDiagramPortComponent
} from 'ng-diagram';

interface WorkflowNodeData {
  type: 'trigger' | 'action';
  label: string;
  description: string;
  status: 'configured' | 'incomplete';
  icon: string;
  appName: string;
}

@Component({
  selector: 'app-workflow-canvas',
  standalone: true,
  imports: [CommonModule, NgDiagramComponent, NgDiagramPortComponent],
  providers: [provideNgDiagram()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './workflow-canvas.component.html',
  styleUrls: ['./workflow-canvas.component.scss']
})
export class WorkflowCanvasComponent implements OnInit {
  @ViewChild(NgDiagramComponent) diagram!: NgDiagramComponent;
  
  model: any;
  selectedNodeId: string | null = null;
  private nodeIdCounter = 3;
  private edgeIdCounter = 2;

  ngOnInit(): void {
    this.initializeWorkflow();
    console.log('✅ ng-diagram Workflow Builder Initialized (Angular 18)');
    console.log('📝 Features:');
    console.log('  - Drag nodes to move them');
    console.log('  - Drag from ports to create edges');
    console.log('  - Select edge and press Delete to remove');
    console.log('  - Zoom with mouse wheel');
    console.log('  - Pan by dragging canvas');
  }

  initializeWorkflow(): void {
    this.model = initializeModel({
      nodes: [
        {
          id: '1',
          position: { x: 350, y: 80 },
          data: {
            type: 'trigger',
            label: 'Ticket Priority Created',
            description: 'Create a Ticket when...',
            status: 'configured',
            icon: '🎫',
            appName: 'Trigger'
          }
        },
        {
          id: '2',
          position: { x: 350, y: 300 },
          data: {
            type: 'action',
            label: 'Send email',
            description: 'Send an email with the ticket details to the creator.',
            status: 'incomplete',
            icon: '📧',
            appName: 'Action'
          }
        }
      ],
      edges: [
        {
          id: 'e1',
          source: '1',
          target: '2',
          data: {}
        }
      ]
    });
    
    console.log('Model initialized:', this.model);
    console.log('Nodes:', this.model.nodes?.());
    console.log('Edges:', this.model.edges?.());
  }

  // ============================================
  // NODE MANAGEMENT
  // ============================================

  selectNode(nodeId: string): void {
    console.log('🎯 Node selected:', nodeId);
    this.selectedNodeId = this.selectedNodeId === nodeId ? null : nodeId;
  }

  isSelected(nodeId: string): boolean {
    return this.selectedNodeId === nodeId;
  }

  addNodeAfter(afterNodeId: string): void {
    console.log('➕ Adding node after:', afterNodeId);
    const sourceNode = this.model.nodes().find((n: any) => n.id === afterNodeId);
    if (!sourceNode) return;

    const newNodeId = String(this.nodeIdCounter++);
    const newNode: any = {
      id: newNodeId,
      position: { x: sourceNode.position.x, y: sourceNode.position.y + 220 },
      data: {
        type: 'action',
        label: 'Add Action',
        description: 'Click to configure this action',
        status: 'incomplete',
        icon: '⚡',
        appName: 'Action'
      }
    };

    // Add the new node
    this.model.addNodes([newNode]);

    // Update edges
    const edges = this.model.edges();
    const edgeIndex = edges.findIndex((e: any) => e.source === afterNodeId);
    
    if (edgeIndex !== -1) {
      const oldEdge = edges[edgeIndex];
      this.model.updateEdge(oldEdge.id, { target: newNodeId });
      
      this.model.addEdges([{
        id: `e${this.edgeIdCounter++}`,
        source: newNodeId,
        target: oldEdge.target,
        data: {}
      }]);
      
      // Shift nodes below
      const nodes = this.model.nodes();
      nodes
        .filter((n: any) => n.position.y > sourceNode.position.y && n.id !== newNodeId)
        .forEach((n: any) => {
          this.model.updateNode(n.id, { 
            position: { x: n.position.x, y: n.position.y + 220 }
          });
        });
    } else {
      this.model.addEdges([{
        id: `e${this.edgeIdCounter++}`,
        source: afterNodeId,
        target: newNodeId,
        data: {}
      }]);
    }

    console.log('✅ Node added:', newNodeId);
  }

  deleteNode(nodeId: string): void {
    console.log('🗑️ Deleting node:', nodeId);
    const node = this.model.nodes().find((n: any) => n.id === nodeId);
    if (!node || (node.data as WorkflowNodeData)?.type === 'trigger') {
      alert('Cannot delete trigger node!');
      return;
    }

    const edges = this.model.edges();
    const incoming = edges.find((e: any) => e.target === nodeId);
    const outgoing = edges.find((e: any) => e.source === nodeId);

    // Delete edges connected to this node
    const edgesToDelete = edges.filter((e: any) => e.source === nodeId || e.target === nodeId);
    this.model.deleteEdges(edgesToDelete.map((e: any) => e.id));

    // Reconnect if both incoming and outgoing exist
    if (incoming && outgoing) {
      this.model.addEdges([{
        id: `e${this.edgeIdCounter++}`,
        source: incoming.source,
        target: outgoing.target,
        data: {}
      }]);
    }

    this.model.deleteNodes([nodeId]);
    this.selectedNodeId = null;
    console.log('✅ Node deleted');
  }

  createBranch(): void {
    if (!this.selectedNodeId) {
      alert('Please select a node first!');
      return;
    }

    console.log('🔀 Creating branch from:', this.selectedNodeId);
    const sourceNode = this.model.nodes().find((n: any) => n.id === this.selectedNodeId);
    if (!sourceNode) return;

    const branchNodeId = String(this.nodeIdCounter++);
    const branchNode: any = {
      id: branchNodeId,
      position: { x: sourceNode.position.x + 350, y: sourceNode.position.y + 120 },
      data: {
        type: 'action',
        label: 'Parallel Action',
        description: 'This runs in parallel',
        status: 'incomplete',
        icon: '🔀',
        appName: 'Action'
      }
    };

    this.model.addNodes([branchNode]);
    this.model.addEdges([{
      id: `e${this.edgeIdCounter++}`,
      source: this.selectedNodeId,
      target: branchNodeId,
      data: {}
    }]);
    
    console.log('✅ Branch created');
  }

  configureNode(nodeId: string): void {
    console.log('⚙️ Configuring node:', nodeId);
    alert(`Configure node: ${nodeId}\n\nThis would open a configuration modal.`);
  }

  // ============================================
  // EDGE MANAGEMENT
  // ============================================

  onEdgeCreated(event: any): void {
    console.log('🔗 Edge created:', event);
  }

  onEdgeDeleted(event: any): void {
    console.log('🗑️ Edge deleted:', event);
  }

  // ============================================
  // HEADER ACTIONS
  // ============================================

  testWorkflow(): void {
    console.log('⚡ Testing workflow...');
    alert('Test workflow functionality would run here!');
  }

  publishWorkflow(): void {
    console.log('🚀 Publishing workflow...');
    alert('Workflow would be published!');
  }

  getNodeIndex(nodeId: string): number {
    return this.model.nodes().findIndex((n: any) => n.id === nodeId) + 1;
  }
}
