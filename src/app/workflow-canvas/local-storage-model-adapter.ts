import type { Edge, Metadata, ModelAdapter, Node } from 'ng-diagram';

// Action types for undo/redo
type ActionType = 'ADD_NODE' | 'DELETE_NODE' | 'ADD_EDGE' | 'DELETE_EDGE';

interface Action {
  type: ActionType;
  node?: Node;
  edge?: Edge;
}

export class LocalStorageModelAdapter implements ModelAdapter {
  private callbacks: Array<
    (data: { nodes: Node[]; edges: Edge[]; metadata: Metadata }) => void
  > = [];
  
  // Action-based undo/redo stacks
  private undoStack: Action[] = [];
  private redoStack: Action[] = [];
  private maxStackSize: number = 50;
  private isUndoRedoAction: boolean = false;
  
  constructor(
    private readonly storageKey: string = 'ng-diagram-data',
    initialData?: { nodes?: Node[]; edges?: Edge[]; metadata?: Metadata }
  ) {
    // Initialize storage if it doesn't exist
    if (!localStorage.getItem(this.storageKey)) {
      const defaultData = {
        nodes: initialData?.nodes || [],
        edges: initialData?.edges || [],
        metadata: initialData?.metadata || {
          viewport: { x: 0, y: 0, scale: 1 },
        },
      };
      localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
    }
    
    console.log('📚 Undo/Redo system initialized');
  }

  // Core data access methods - read directly from localStorage
  getNodes(): Node[] {
    const data = this.getStorageData();
    return data.nodes || [];
  }

  getEdges(): Edge[] {
    const data = this.getStorageData();
    return data.edges || [];
  }

  getMetadata(): Metadata {
    const data = this.getStorageData();
    return data.metadata || { viewport: { x: 0, y: 0, scale: 1 } };
  }

  // Data modification methods - write directly to localStorage
  updateNodes(next: Node[] | ((prev: Node[]) => Node[])): void {
    const currentNodes = this.getNodes();
    const newNodes = typeof next === 'function' ? next(currentNodes) : next;
    
    // Track changes for undo/redo (only if not already doing undo/redo)
    if (!this.isUndoRedoAction) {
      this.trackNodeChanges(currentNodes, newNodes);
    }
    
    this.updateStorageData({ nodes: newNodes });
    this.notifyCallbacks();
  }

  updateEdges(next: Edge[] | ((prev: Edge[]) => Edge[])): void {
    const currentEdges = this.getEdges();
    const newEdges = typeof next === 'function' ? next(currentEdges) : next;
    
    // Track changes for undo/redo (only if not already doing undo/redo)
    if (!this.isUndoRedoAction) {
      this.trackEdgeChanges(currentEdges, newEdges);
    }
    
    this.updateStorageData({ edges: newEdges });
    this.notifyCallbacks();
  }

  updateMetadata(next: Metadata | ((prev: Metadata) => Metadata)): void {
    const currentMetadata = this.getMetadata();
    const newMetadata =
      typeof next === 'function' ? next(currentMetadata) : next;
    this.updateStorageData({ metadata: newMetadata });
    this.notifyCallbacks();
  }

  // Change notification system
  onChange(
    callback: (data: {
      nodes: Node[];
      edges: Edge[];
      metadata: Metadata;
    }) => void
  ): void {
    this.callbacks.push(callback);
  }

  unregisterOnChange(
    callback: (data: {
      nodes: Node[];
      edges: Edge[];
      metadata: Metadata;
    }) => void
  ): void {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback);
  }

  // Undo/Redo operations
  undo(): void {
    console.log('↶ UNDO called - stack size:', this.undoStack.length);
    
    if (this.undoStack.length === 0) {
      console.log('⚠️ Nothing to undo');
      return;
    }
    
    const action = this.undoStack.pop()!;
    console.log('  Undoing action:', action.type);
    
    this.isUndoRedoAction = true;
    
    if (action.type === 'ADD_NODE') {
      // Undo add = delete the node
      const currentNodes = this.getNodes();
      const newNodes = currentNodes.filter(n => n.id !== action.node!.id);
      this.updateStorageData({ nodes: newNodes });
      console.log('  Removed node:', action.node!.id);
    } else if (action.type === 'DELETE_NODE') {
      // Undo delete = add the node back
      const currentNodes = this.getNodes();
      this.updateStorageData({ nodes: [...currentNodes, action.node!] });
      console.log('  Restored node:', action.node!.id);
    } else if (action.type === 'ADD_EDGE') {
      // Undo add = delete the edge
      const currentEdges = this.getEdges();
      const newEdges = currentEdges.filter(e => e.id !== action.edge!.id);
      this.updateStorageData({ edges: newEdges });
      console.log('  Removed edge:', action.edge!.id);
    } else if (action.type === 'DELETE_EDGE') {
      // Undo delete = add the edge back
      const currentEdges = this.getEdges();
      this.updateStorageData({ edges: [...currentEdges, action.edge!] });
      console.log('  Restored edge:', action.edge!.id);
    }
    
    this.redoStack.push(action);
    this.isUndoRedoAction = false;
    this.notifyCallbacks();
    
    console.log('✅ Undo complete - undo stack:', this.undoStack.length, 'redo stack:', this.redoStack.length);
  }

  redo(): void {
    console.log('↷ REDO called - stack size:', this.redoStack.length);
    
    if (this.redoStack.length === 0) {
      console.log('⚠️ Nothing to redo');
      return;
    }
    
    const action = this.redoStack.pop()!;
    console.log('  Redoing action:', action.type);
    
    this.isUndoRedoAction = true;
    
    if (action.type === 'ADD_NODE') {
      // Redo add = add the node
      const currentNodes = this.getNodes();
      this.updateStorageData({ nodes: [...currentNodes, action.node!] });
      console.log('  Added node:', action.node!.id);
    } else if (action.type === 'DELETE_NODE') {
      // Redo delete = delete the node
      const currentNodes = this.getNodes();
      const newNodes = currentNodes.filter(n => n.id !== action.node!.id);
      this.updateStorageData({ nodes: newNodes });
      console.log('  Deleted node:', action.node!.id);
    } else if (action.type === 'ADD_EDGE') {
      // Redo add = add the edge
      const currentEdges = this.getEdges();
      this.updateStorageData({ edges: [...currentEdges, action.edge!] });
      console.log('  Added edge:', action.edge!.id);
    } else if (action.type === 'DELETE_EDGE') {
      // Redo delete = delete the edge
      const currentEdges = this.getEdges();
      const newEdges = currentEdges.filter(e => e.id !== action.edge!.id);
      this.updateStorageData({ edges: newEdges });
      console.log('  Deleted edge:', action.edge!.id);
    }
    
    this.undoStack.push(action);
    this.isUndoRedoAction = false;
    this.notifyCallbacks();
    
    console.log('✅ Redo complete - undo stack:', this.undoStack.length, 'redo stack:', this.redoStack.length);
  }

  // Serialization
  toJSON(): string {
    return JSON.stringify(this.getStorageData());
  }

  // Reset to initial state
  reset(initialData: { nodes: Node[]; edges: Edge[]; metadata?: Metadata }): void {
    console.log('🔄 ADAPTER RESET: Clearing undo/redo stacks...');
    
    // Set flag to prevent tracking during reset
    this.isUndoRedoAction = true;
    
    // Clear undo/redo stacks
    this.undoStack = [];
    this.redoStack = [];
    console.log('  ✅ Stacks cleared - undo:', this.undoStack.length, 'redo:', this.redoStack.length);
    
    // Reset storage to initial data
    const resetData = {
      nodes: initialData.nodes || [],
      edges: initialData.edges || [],
      metadata: initialData.metadata || { viewport: { x: 0, y: 0, scale: 1 } },
    };
    
    localStorage.setItem(this.storageKey, JSON.stringify(resetData));
    console.log('  ✅ Storage reset:', { nodes: resetData.nodes.length, edges: resetData.edges.length });
    
    // Notify callbacks to update UI
    this.notifyCallbacks();
    
    // Reset flag
    this.isUndoRedoAction = false;
    
    console.log('✅ ADAPTER RESET COMPLETE');
  }

  // Cleanup
  destroy(): void {
    this.callbacks = [];
    this.undoStack = [];
    this.redoStack = [];
  }

  // Private storage methods
  private getStorageData(): {
    nodes: Node[];
    edges: Edge[];
    metadata: Metadata;
  } {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored
        ? JSON.parse(stored)
        : {
            nodes: [],
            edges: [],
            metadata: { viewport: { x: 0, y: 0, scale: 1 } },
          };
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return {
        nodes: [],
        edges: [],
        metadata: { viewport: { x: 0, y: 0, scale: 1 } },
      };
    }
  }

  private updateStorageData(
    updates: Partial<{ nodes: Node[]; edges: Edge[]; metadata: Metadata }>
  ): void {
    try {
      const currentData = this.getStorageData();
      const newData = { ...currentData, ...updates };
      localStorage.setItem(this.storageKey, JSON.stringify(newData));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  private notifyCallbacks(): void {
    const data = this.getStorageData();

    for (const callback of this.callbacks) {
      callback(data);
    }
  }

  // Track node changes
  private trackNodeChanges(oldNodes: Node[], newNodes: Node[]): void {
    // Find added nodes
    const addedNodes = newNodes.filter(n => !oldNodes.find(o => o.id === n.id));
    for (const node of addedNodes) {
      this.pushAction({ type: 'ADD_NODE', node: JSON.parse(JSON.stringify(node)) });
      console.log('📝 Tracked: ADD_NODE', node.id);
    }
    
    // Find deleted nodes
    const deletedNodes = oldNodes.filter(o => !newNodes.find(n => n.id === o.id));
    for (const node of deletedNodes) {
      this.pushAction({ type: 'DELETE_NODE', node: JSON.parse(JSON.stringify(node)) });
      console.log('📝 Tracked: DELETE_NODE', node.id);
    }
  }
  
  // Track edge changes
  private trackEdgeChanges(oldEdges: Edge[], newEdges: Edge[]): void {
    // Find added edges
    const addedEdges = newEdges.filter(e => !oldEdges.find(o => o.id === e.id));
    for (const edge of addedEdges) {
      this.pushAction({ type: 'ADD_EDGE', edge: JSON.parse(JSON.stringify(edge)) });
      console.log('📝 Tracked: ADD_EDGE', edge.id);
    }
    
    // Find deleted edges
    const deletedEdges = oldEdges.filter(o => !newEdges.find(e => e.id === o.id));
    for (const edge of deletedEdges) {
      this.pushAction({ type: 'DELETE_EDGE', edge: JSON.parse(JSON.stringify(edge)) });
      console.log('📝 Tracked: DELETE_EDGE', edge.id);
    }
  }
  
  // Push action to undo stack
  private pushAction(action: Action): void {
    this.undoStack.push(action);
    
    // Clear redo stack when new action is performed
    if (this.redoStack.length > 0) {
      console.log('📝 Cleared redo stack (', this.redoStack.length, 'items)');
      this.redoStack = [];
    }
    
    // Limit stack size
    if (this.undoStack.length > this.maxStackSize) {
      this.undoStack.shift();
    }
  }
}
