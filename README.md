# Workflow Builder

A Zapier-like workflow builder built with **Angular 18** and **Angular CDK**.

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

- **Angular 18** (upgraded from 17)
- **@angular/cdk** - Drag & Drop
- TypeScript
- Custom SVG edge rendering

## Implementation Details

- ✅ Angular CDK Drag & Drop for node movement
- ✅ Custom SVG path calculations for dynamic edges
- ✅ Smart edge routing (connects from any side)
- ✅ Smooth transitions with requestAnimationFrame
- ✅ Compact nodes (240px width)
- ✅ Small arrow markers (8x8)
- ✅ Mind-map style connections

## What's Working

- ✅ Drag nodes to move them
- ✅ Add nodes with ⊕ button
- ✅ Delete nodes with 🗑️ button
- ✅ Create branches with 🔀 button
- ✅ Dynamic edge routing
- ✅ Multi-path support
- ✅ Node selection
- ✅ Smooth animations

## Known Limitations (To Be Added)

- ❌ Drag-to-connect (need to implement port-based system)
- ❌ Interactive connection ports
- ❌ Edge interaction (click/delete edges)
- ❌ Zoom/pan controls
- ❌ Edge labels
- ❌ Validation system
- ❌ Undo/Redo

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
