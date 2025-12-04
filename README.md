# Workflow Builder v1

A Zapier-style workflow automation builder built with Angular 17 and Angular CDK.

## Features

- **Drag & Drop** - Move nodes anywhere on canvas
- **Dynamic Edges** - Connections update automatically
- **Add/Delete Nodes** - Build workflows dynamically
- **Multi-path** - Create parallel branches
- **Node Selection** - Toolbar with actions

##  Quick Start

```bash
npm install
npm start
```

Open http://localhost:4200

## Usage

| Action | How |
|--------|-----|
| Move node | Drag it |
| Select node | Click it |
| Add node | Click ⊕ below node |
| Delete node | Select → Click 🗑 |
| Create branch | Select → Click 🔀 |
| Configure | Select → Click ⚙ |

## Tech Stack

- Angular 17
- @angular/cdk (Drag & Drop)
- TypeScript
- SVG (for edges)

## Structure

```
src/app/workflow-canvas/
├── workflow-canvas.component.ts    # Main logic
├── workflow-canvas.component.html  # Template
└── workflow-canvas.component.scss  # Styles
```

##  Layout

- **Left Sidebar** - Workflow description form
- **Center Canvas** - Draggable nodes with edges
- **Right Sidebar** - Data information

##  Key Implementation

**Nodes:** Absolute positioned divs with `cdkDrag`  
**Edges:** SVG paths calculated from node positions  
**State:** Simple arrays updated on interactions

---

**Version:** v1 - Fully Functional  
**Status:** ✅ All features working
