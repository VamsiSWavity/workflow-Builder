import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeEditor, GetSchemes, ClassicPreset } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin';
import { AngularPlugin, Presets, AngularArea2D } from 'rete-angular-plugin/18';

// Define node types - n8n style sizing
class Node extends ClassicPreset.Node {
  width = 280;
  height = 140;
}

class Connection<N extends Node> extends ClassicPreset.Connection<N, N> {}

type Schemes = GetSchemes<Node, Connection<Node>>;
type AreaExtra = AngularArea2D<Schemes>;

@Component({
  selector: 'app-workflow-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-layout">
      <!-- Left Sidebar - Node Library -->
      <aside class="left-sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <span class="logo-icon">⚡</span>
            <h2>Workflow Builder</h2>
          </div>
        </div>
        
        <div class="sidebar-content">
          <div class="section">
            <h3 class="section-title">Triggers</h3>
            <div class="node-palette">
              <div class="palette-node trigger" draggable="true">
                <span class="node-icon">🎫</span>
                <span class="node-name">Ticket Created</span>
              </div>
              <div class="palette-node trigger" draggable="true">
                <span class="node-icon">📧</span>
                <span class="node-name">Email Received</span>
              </div>
              <div class="palette-node trigger" draggable="true">
                <span class="node-icon">⏰</span>
                <span class="node-name">Schedule</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h3 class="section-title">Actions</h3>
            <div class="node-palette">
              <div class="palette-node action" draggable="true">
                <span class="node-icon">📨</span>
                <span class="node-name">Send Email</span>
              </div>
              <div class="palette-node action" draggable="true">
                <span class="node-icon">💬</span>
                <span class="node-name">Send Slack</span>
              </div>
              <div class="palette-node action" draggable="true">
                <span class="node-icon">📝</span>
                <span class="node-name">Create Task</span>
              </div>
              <div class="palette-node action" draggable="true">
                <span class="node-icon">🔔</span>
                <span class="node-name">Notification</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Top Header -->
        <header class="top-header">
          <div class="header-left">
            <input type="text" class="workflow-name" value="AI Agent Flow" placeholder="Workflow Name">
          </div>
          <div class="header-right">
            <button class="btn-header">
              <span>🧪</span> Test
            </button>
            <button class="btn-header btn-save">
              <span>💾</span> Save
            </button>
            <button class="btn-header btn-publish">
              <span>🚀</span> Publish
            </button>
          </div>
        </header>

        <!-- Canvas Controls -->
        <div class="canvas-controls">
          <button class="control-btn" title="Zoom Out">−</button>
          <span class="zoom-level">100%</span>
          <button class="control-btn" title="Zoom In">+</button>
          <button class="control-btn" title="Fit to View">⛶</button>
          <button class="control-btn" title="Undo">↶</button>
          <button class="control-btn" title="Redo">↷</button>
        </div>

        <!-- Rete.js Canvas -->
        <div class="canvas-wrapper">
          <div #rete class="rete-container"></div>
        </div>
      </main>

      <!-- Right Sidebar - Node Configuration -->
      <aside class="right-sidebar">
        <div class="sidebar-header">
          <h3>Node Configuration</h3>
        </div>
        
        <div class="sidebar-content">
          <div class="config-section">
            <div class="empty-state">
              <span class="empty-icon">👆</span>
              <p>Select a node to configure</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    /* Main Layout */
    .app-layout {
      display: flex;
      width: 100vw;
      height: 100vh;
      background: #f5f7fa;
      overflow: hidden;
    }

    /* Left Sidebar - Node Library */
    .left-sidebar {
      width: 280px;
      background: white;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid #e2e8f0;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .logo h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
    }

    .sidebar-content {
      flex: 1;
      padding: 20px;
    }

    .section {
      margin-bottom: 30px;
    }

    .section-title {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 12px 0;
    }

    .node-palette {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .palette-node {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      cursor: grab;
      transition: all 0.2s;
    }

    .palette-node:hover {
      background: white;
      border-color: #cbd5e1;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }

    .palette-node:active {
      cursor: grabbing;
    }

    .palette-node.trigger {
      border-left: 3px solid #3b82f6;
    }

    .palette-node.action {
      border-left: 3px solid #10b981;
    }

    .node-icon {
      font-size: 20px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 6px;
    }

    .node-name {
      font-size: 14px;
      font-weight: 500;
      color: #1e293b;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* Top Header */
    .top-header {
      height: 60px;
      background: white;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
    }

    .header-left {
      flex: 1;
    }

    .workflow-name {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      border: none;
      background: transparent;
      padding: 8px 12px;
      border-radius: 6px;
      transition: background 0.2s;
    }

    .workflow-name:hover {
      background: #f8fafc;
    }

    .workflow-name:focus {
      outline: none;
      background: #f8fafc;
    }

    .header-right {
      display: flex;
      gap: 8px;
    }

    .btn-header {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      color: #475569;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-header:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .btn-header.btn-save {
      background: #f8fafc;
      color: #3b82f6;
      border-color: #3b82f6;
    }

    .btn-header.btn-publish {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .btn-header.btn-publish:hover {
      background: #2563eb;
    }

    /* Canvas Controls */
    .canvas-controls {
      position: absolute;
      bottom: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 4px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      z-index: 100;
    }

    .control-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
    }

    .control-btn:hover {
      background: #f8fafc;
      color: #1e293b;
    }

    .zoom-level {
      padding: 0 8px;
      font-size: 12px;
      font-weight: 500;
      color: #64748b;
    }

    /* Canvas Wrapper */
    .canvas-wrapper {
      flex: 1;
      position: relative;
      overflow: hidden;
    }
    
    .rete-container {
      width: 100%;
      height: 100%;
      background: white;
      position: relative;
      background-image: radial-gradient(circle, #e2e8f0 1px, transparent 1px);
      background-size: 20px 20px;
    }

    /* Right Sidebar - Configuration */
    .right-sidebar {
      width: 320px;
      background: white;
      border-left: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .right-sidebar .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid #e2e8f0;
    }

    .right-sidebar .sidebar-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
    }

    .config-section {
      padding: 20px;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
    }

    .empty-icon {
      font-size: 48px;
      display: block;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
      color: #94a3b8;
    }

    /* n8n-style node styling */
    ::ng-deep .node {
      background: white !important;
      border: 2px solid #e2e8f0 !important;
      border-radius: 12px !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
      padding: 16px !important;
      min-width: 280px !important;
      transition: all 0.2s !important;
    }

    ::ng-deep .node:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12) !important;
      border-color: #cbd5e1 !important;
    }

    ::ng-deep .node.selected {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), 0 4px 16px rgba(0, 0, 0, 0.12) !important;
    }

    ::ng-deep .title {
      font-size: 15px !important;
      font-weight: 600 !important;
      color: #1e293b !important;
      margin-bottom: 12px !important;
      padding-bottom: 12px !important;
      border-bottom: 1px solid #f1f5f9 !important;
    }

    ::ng-deep .input-control input {
      width: 100% !important;
      padding: 8px 12px !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 6px !important;
      font-size: 13px !important;
      background: #f8fafc !important;
      color: #64748b !important;
    }

    ::ng-deep .input-control input:focus {
      outline: none !important;
      border-color: #3b82f6 !important;
      background: white !important;
    }

    /* n8n-style ports (sockets) */
    ::ng-deep .socket {
      width: 16px !important;
      height: 16px !important;
      background: white !important;
      border: 3px solid #94a3b8 !important;
      border-radius: 50% !important;
      cursor: crosshair !important;
      transition: all 0.2s !important;
      position: relative !important;
      z-index: 10 !important;
    }

    ::ng-deep .socket:hover {
      transform: scale(1.3) !important;
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2) !important;
    }

    ::ng-deep .input .socket {
      border-color: #10b981 !important;
    }

    ::ng-deep .output .socket {
      border-color: #3b82f6 !important;
    }

    /* n8n-style connections */
    ::ng-deep .connection path {
      stroke: #94a3b8 !important;
      stroke-width: 2px !important;
      fill: none !important;
      transition: all 0.2s !important;
    }

    ::ng-deep .connection:hover path {
      stroke: #3b82f6 !important;
      stroke-width: 3px !important;
    }

    ::ng-deep .connection.selected path {
      stroke: #3b82f6 !important;
      stroke-width: 3px !important;
    }

    /* Input/Output labels */
    ::ng-deep .input-title,
    ::ng-deep .output-title {
      font-size: 11px !important;
      color: #94a3b8 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
      font-weight: 600 !important;
    }
  `]
})
export class WorkflowCanvasComponent implements OnInit {
  @ViewChild('rete', { static: true }) reteContainer!: ElementRef<HTMLElement>;

  constructor(private injector: Injector) {}

  async ngOnInit() {
    await this.createEditor();
  }

  async createEditor() {
    console.log('🚀 Starting minimal POC...');
    const container = this.reteContainer.nativeElement;

    // Create editor
    const editor = new NodeEditor<Schemes>();

    // Create area plugin
    const area = new AreaPlugin<Schemes, AreaExtra>(container);

    // Create connection plugin
    const connection = new ConnectionPlugin<Schemes, AreaExtra>();

    // Create render plugin
    const render = new AngularPlugin<Schemes, AreaExtra>({ injector: this.injector });

    // Register plugins
    editor.use(area);
    area.use(connection);
    area.use(render);

    // Add presets
    render.addPreset(Presets.classic.setup());
    connection.addPreset(ConnectionPresets.classic.setup());

    // Create socket for connections
    const socket = new ClassicPreset.Socket('socket');
    
    // NODE 1 - Trigger (like n8n)
    const node1 = new Node('Ticket Priority Created');
    node1.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    node1.addControl('desc', new ClassicPreset.InputControl('text', { 
      initial: 'Create a Ticket when...',
      readonly: true 
    }));
    await editor.addNode(node1);
    await area.translate(node1.id, { x: 100, y: 100 });

    // NODE 2 - Action (like n8n)
    const node2 = new Node('Send Email');
    node2.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    node2.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    node2.addControl('desc', new ClassicPreset.InputControl('text', { 
      initial: 'Send an email with the ticket details...',
      readonly: true 
    }));
    await editor.addNode(node2);
    await area.translate(node2.id, { x: 100, y: 300 });

    // CREATE CONNECTION between node1 output and node2 input
    const conn = new Connection(node1, 'output' as never, node2, 'input' as never);
    await editor.addConnection(conn);

    // Fit view to show all nodes
    AreaExtensions.zoomAt(area, editor.getNodes());

    console.log('✅ Minimal POC initialized');
    console.log('📝 Nodes:', editor.getNodes().length);
    console.log('🔗 Connections:', editor.getConnections().length);
    console.log('');
    console.log('🎯 Try:');
    console.log('  1. Drag nodes');
    console.log('  2. Drag from output port to create connection');
    console.log('  3. Zoom with mouse wheel');
  }
}
