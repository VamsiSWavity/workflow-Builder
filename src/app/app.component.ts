import { Component } from '@angular/core';
import { WorkflowCanvasNgDiagramComponent } from './workflow-canvas/workflow-canvas-ngdiagram.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WorkflowCanvasNgDiagramComponent],
  template: `<app-workflow-canvas-ngdiagram></app-workflow-canvas-ngdiagram>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'AI Agent Flow';
}
