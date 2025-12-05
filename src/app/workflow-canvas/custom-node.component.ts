import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassicPreset } from 'rete';

@Component({
  selector: 'app-custom-node',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-workflow-node" 
         [class.trigger]="data?.type === 'trigger'"
         [class.action]="data?.type === 'action'"
         [class.selected]="data?.selected">
      
      <!-- Input Port (top) - only for action nodes -->
      <div class="port-wrapper port-input" *ngIf="data?.type !== 'trigger'">
        <ng-content select="[data-testid*='input']"></ng-content>
      </div>

      <!-- Toolbar (shows on hover/select) -->
      <div class="node-toolbar" *ngIf="data?.selected">
        <button class="toolbar-btn" title="Branch">🔀</button>
        <button class="toolbar-btn" title="Settings">⚙</button>
        <button class="toolbar-btn delete" title="Delete">🗑</button>
      </div>

      <!-- Node Header -->
      <div class="node-header">
        <div class="node-icon-badge" [class.trigger-badge]="data?.type === 'trigger'" [class.action-badge]="data?.type === 'action'">
          <span class="node-icon">{{ data?.icon || '📋' }}</span>
        </div>
        <div class="node-info">
          <span class="node-type">{{ data?.type === 'trigger' ? 'Trigger' : 'Action' }}</span>
          <h3 class="node-title">{{ data?.label }}</h3>
        </div>
        <div class="node-status" [class.available]="data?.status === 'available'" [class.incomplete]="data?.status === 'incomplete'">
          <span class="status-icon">{{ data?.status === 'available' ? '✓' : '⚠' }}</span>
          <span class="status-text">{{ data?.status === 'available' ? 'Available' : 'Incomplete' }}</span>
        </div>
      </div>

      <!-- Node Body -->
      <div class="node-body">
        <p class="node-description">{{ data?.description || 'Configure this action...' }}</p>
        <button class="node-config-btn">
          <span class="config-icon">⚙</span>
        </button>
      </div>

      <!-- Add Button -->
      <button class="add-btn">
        <span class="add-icon">⊕</span>
      </button>

      <!-- Output Port (bottom) -->
      <div class="port-wrapper port-output">
        <ng-content select="[data-testid*='output']"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .custom-workflow-node {
      width: 380px;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      position: relative;
      padding: 20px;
      transition: all 0.2s;
    }

    .custom-workflow-node:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }

    .custom-workflow-node.selected {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), 0 4px 16px rgba(0, 0, 0, 0.12);
    }

    /* Toolbar */
    .node-toolbar {
      position: absolute;
      top: -45px;
      right: 0;
      background: #1e293b;
      border-radius: 8px;
      padding: 8px;
      display: flex;
      gap: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 100;
    }

    .toolbar-btn {
      width: 32px;
      height: 32px;
      background: transparent;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .toolbar-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .toolbar-btn.delete:hover {
      background: rgba(239, 68, 68, 0.2);
    }

    /* Header */
    .node-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
    }

    .node-icon-badge {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .node-icon-badge.trigger-badge {
      background: #dbeafe;
      color: #1e40af;
    }

    .node-icon-badge.action-badge {
      background: #fee2e2;
      color: #991b1b;
    }

    .node-info {
      flex: 1;
      min-width: 0;
    }

    .node-type {
      display: block;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .node-title {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
      line-height: 1.3;
    }

    .node-status {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .node-status.available {
      background: #d1fae5;
      color: #065f46;
    }

    .node-status.incomplete {
      background: #fed7aa;
      color: #92400e;
    }

    .status-icon {
      font-size: 14px;
    }

    /* Body */
    .node-body {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .node-description {
      flex: 1;
      margin: 0;
      font-size: 13px;
      color: #64748b;
      line-height: 1.5;
    }

    .node-config-btn {
      width: 36px;
      height: 36px;
      background: #e0f2fe;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.2s;
    }

    .node-config-btn:hover {
      background: #bae6fd;
      transform: scale(1.05);
    }

    .config-icon {
      font-size: 18px;
      color: #0369a1;
    }

    /* Add Button */
    .add-btn {
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      background: white;
      border: 2px solid #3b82f6;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.2s;
      z-index: 10;
    }

    .add-btn:hover {
      background: #3b82f6;
      transform: translateX(-50%) scale(1.1);
    }

    .add-btn:hover .add-icon {
      color: white;
    }

    .add-icon {
      font-size: 24px;
      color: #3b82f6;
      transition: color 0.2s;
    }

    /* Port Wrappers */
    .port-wrapper {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      z-index: 20;
    }

    .port-wrapper.port-input {
      top: -10px;
    }

    .port-wrapper.port-output {
      bottom: -10px;
    }

    /* Make ports visible */
    ::ng-deep .port-wrapper {
      .socket {
        width: 20px !important;
        height: 20px !important;
        background: white !important;
        border: 3px solid #3b82f6 !important;
        border-radius: 50% !important;
        cursor: crosshair !important;
        display: block !important;
      }

      .input-socket {
        border-color: #10b981 !important;
      }

      .output-socket {
        border-color: #3b82f6 !important;
      }
    }
  `]
})
export class CustomNodeComponent {
  @Input() data: any;

  constructor(private cdr: ChangeDetectorRef) {}
}
