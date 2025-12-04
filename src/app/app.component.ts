import { Component } from '@angular/core';
import { WorkflowCanvasComponent } from './workflow-canvas/workflow-canvas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WorkflowCanvasComponent],
  template: `<app-workflow-canvas></app-workflow-canvas>`,
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
