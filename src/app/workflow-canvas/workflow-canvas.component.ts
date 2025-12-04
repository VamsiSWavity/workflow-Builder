import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action';
  label: string;
  description: string;
  status: 'configured' | 'incomplete';
  icon: string;
  appName: string;
  position: { x: number; y: number };
}

interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
}

@Component({
  selector: 'app-workflow-canvas',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './workflow-canvas.component.html',
  styleUrls: ['./workflow-canvas.component.scss']
})
export class WorkflowCanvasComponent implements AfterViewInit {
  selectedNodeId: string | null = null;
  private nodeIdCounter = 3;
  private edgeIdCounter = 2;

  nodes: WorkflowNode[] = [
    {
      id: '1',
      type: 'trigger',
      label: 'Ticket Priority Created',
      description: 'Create a Ticket when...',
      status: 'configured',
      icon: '🎫',
      appName: 'Trigger',
      position: { x: 300, y: 100 }
    },
    {
      id: '2',
      type: 'action',
      label: 'Send email',
      description: 'Send an email with the ticket details to the creator.',
      status: 'incomplete',
      icon: '📧',
      appName: 'Action',
      position: { x: 300, y: 400 }
    }
  ];

  edges: WorkflowEdge[] = [
    { id: 'e1', from: '1', to: '2' }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    console.log('✅ Workflow Builder Initialized');
    console.log('Nodes:', this.nodes.length);
    console.log('Edges:', this.edges.length);
  }

  // ============================================
  // DRAG & DROP
  // ============================================

  onNodeDragEnded(event: CdkDragEnd, nodeId: string): void {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const distance = event.distance;
    node.position.x += distance.x;
    node.position.y += distance.y;
    
    this.cdr.detectChanges();
    console.log(`✅ Node ${nodeId} moved to:`, node.position);
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
    const sourceNode = this.nodes.find(n => n.id === afterNodeId);
    if (!sourceNode) return;

    const newNodeId = String(this.nodeIdCounter++);
    const newNode: WorkflowNode = {
      id: newNodeId,
      type: 'action',
      label: 'Add Action',
      description: 'Click to configure this action',
      status: 'incomplete',
      icon: '⚡',
      appName: 'Action',
      position: { x: sourceNode.position.x, y: sourceNode.position.y + 300 }
    };

    // Find edge from source
    const edgeIndex = this.edges.findIndex(e => e.from === afterNodeId);
    
    if (edgeIndex !== -1) {
      const oldTarget = this.edges[edgeIndex].to;
      this.edges[edgeIndex] = { ...this.edges[edgeIndex], to: newNodeId };
      this.edges.push({ id: `e${this.edgeIdCounter++}`, from: newNodeId, to: oldTarget });
      
      // Shift nodes below
      this.nodes.filter(n => n.position.y > sourceNode.position.y && n.id !== newNodeId)
        .forEach(n => n.position.y += 300);
    } else {
      this.edges.push({ id: `e${this.edgeIdCounter++}`, from: afterNodeId, to: newNodeId });
    }

    this.nodes.push(newNode);
    console.log('✅ Node added:', newNodeId);
  }

  deleteNode(nodeId: string): void {
    console.log('🗑️ Deleting node:', nodeId);
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node || node.type === 'trigger') {
      alert('Cannot delete trigger node!');
      return;
    }

    const incoming = this.edges.find(e => e.to === nodeId);
    const outgoing = this.edges.find(e => e.from === nodeId);

    this.edges = this.edges.filter(e => e.from !== nodeId && e.to !== nodeId);

    if (incoming && outgoing) {
      this.edges.push({ id: `e${this.edgeIdCounter++}`, from: incoming.from, to: outgoing.to });
    }

    this.nodes = this.nodes.filter(n => n.id !== nodeId);
    this.selectedNodeId = null;
    console.log('✅ Node deleted');
  }

  createBranch(): void {
    if (!this.selectedNodeId) {
      alert('Please select a node first!');
      return;
    }

    console.log('🔀 Creating branch from:', this.selectedNodeId);
    const sourceNode = this.nodes.find(n => n.id === this.selectedNodeId);
    if (!sourceNode) return;

    const branchNodeId = String(this.nodeIdCounter++);
    const branchNode: WorkflowNode = {
      id: branchNodeId,
      type: 'action',
      label: 'Parallel Action',
      description: 'This runs in parallel',
      status: 'incomplete',
      icon: '🔀',
      appName: 'Action',
      position: { x: sourceNode.position.x + 450, y: sourceNode.position.y + 150 }
    };

    this.nodes.push(branchNode);
    this.edges.push({ id: `e${this.edgeIdCounter++}`, from: this.selectedNodeId, to: branchNodeId });
    console.log('✅ Branch created');
  }

  configureNode(nodeId: string): void {
    console.log('⚙️ Configuring node:', nodeId);
    alert(`Configure node: ${nodeId}\n\nThis would open a configuration modal.`);
  }

  // ============================================
  // EDGE RENDERING
  // ============================================

  getEdgePath(edge: WorkflowEdge): string {
    const fromNode = this.nodes.find(n => n.id === edge.from);
    const toNode = this.nodes.find(n => n.id === edge.to);
    
    if (!fromNode || !toNode) return '';

    const fromX = fromNode.position.x + 160; // Center
    const fromY = fromNode.position.y + 140; // Bottom
    const toX = toNode.position.x + 160;
    const toY = toNode.position.y; // Top

    const midY = (fromY + toY) / 2;

    return `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;
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
    return this.nodes.findIndex(n => n.id === nodeId) + 1;
  }
}
