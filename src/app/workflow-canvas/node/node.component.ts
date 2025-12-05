import { Component, input } from '@angular/core';
import {
  NgDiagramBaseNodeTemplateComponent,
  NgDiagramPortComponent,
  type NgDiagramNodeTemplate,
  type Node,
} from 'ng-diagram';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [NgDiagramPortComponent, NgDiagramBaseNodeTemplateComponent],
  template: `
    <ng-diagram-base-node-template [node]="node()">
      <span class="node-label">{{ $any(node().data).label }}</span>
    </ng-diagram-base-node-template>
    <ng-diagram-port id="port-bottom" type="both" side="bottom" />
    <ng-diagram-port id="port-top" type="both" side="top" />
    <ng-diagram-port id="port-left" type="both" side="left" />
    <ng-diagram-port id="port-right" type="both" side="right" />
  `,
  styles: [`
    :host {
      .node-label {
        width: 200px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  `],
  host: {
    '[class.ng-diagram-port-hoverable-over-node]': 'true',
  },
})
export class NodeComponent implements NgDiagramNodeTemplate {
  node = input.required<Node>();
}
