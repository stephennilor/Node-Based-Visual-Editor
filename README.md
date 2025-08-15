## NILOR Node Editor (React Flow)

A lightweight, themeable node-graph mockup for quickly building polished diagrams and slides. Built with Vite + React + TypeScript and React Flow.

### 1) Prerequisites

- Node.js 18+ (or 20+)
- npm (comes with Node)

### 2) Install & Run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### 3) What you’ll see

- A black canvas with a few sample nodes
- A toolbar (top-left) with buttons to add new nodes
- A minimap and pan/zoom controls
- An Inspector (top-right) appears when you click a node

### 4) Basic usage

- Pan: Click-drag on the canvas
- Zoom: Mouse wheel / trackpad gesture
- Select node: Click the node body
- Move node: Drag a node by its body
- Connect nodes: Drag from a right (output) port to a left (input) port
- Delete a connection (wire): Double-click the wire, or select the wire and press Delete/Backspace

### 5) Adding nodes (toolbar)

- “+ Input Node”
  - Creates a node with only outputs (right side)
- “+ Process Node”
  - Creates a node with inputs (left) and outputs (right)
- “+ Output Node”
  - Creates a node with only inputs (left side)

Each new node gets a random accent color and a random position within the view.

### 6) Editing a node (Inspector)

Click a node to open the Inspector (top-right):

- Title: Free text
- Subtitle: Only shown for nodes that have one (e.g., the core demo node)
- Accent Color: Color input affecting the node header and default port colors
- Inputs section:
  - Rename any input label inline
  - Remove an input (×) — any connected wires to that port are also removed
  - “+ Add Input” to append a new input
- Outputs section:
  - Rename any output label inline
  - Remove an output (×) — any connected wires to that port are also removed
  - “+ Add Output” to append a new output

Changes are applied immediately to the selected node.

### 7) Ports and wires

- Ports are the colored circular handles along the left (inputs) and right (outputs) edges of the node body
- Wires are native React Flow bezier edges; no arrowheads for a clean look
- While dragging a connection, you must start from an output and finish on an input

### 8) Theming & spacing quick reference

All node visuals live in `src/components/NodeEditor.tsx` inside the `NilorNode` component.

- Handle inset from node edges: change the `left`/`right` style of the `<Handle>`
- Label/port row height and vertical alignment: see `rowBody`, row container `h-5`, and the handle `top: '50%'; transform: 'translateY(-50%)'`
- Input/Output column padding: `pl-…` and `pr-…` classes on the row containers
- Gap between input and output columns: the middle wrapper uses `gap-12`
- Accent color: node header background comes from `data.accentColor`

### 9) Exporting diagrams

- Easiest: take a screenshot (window capture or browser dev tools “Capture node screenshot”)
- If you want a one-click PNG export button, we can add it (React Flow supports viewport-to-image patterns)

### 10) Known notes / tips

- There’s no persistence yet (refresh resets to defaults). If needed, we can add JSON import/export.
- You can change the default counts/labels for new nodes in `addNodeOfKind()` inside `NodeEditor.tsx`.
- If you see a white page, stop and restart the dev server (`Ctrl+C`, then `npm run dev`).

### 11) Tech stack

- Vite + React + TypeScript
- React Flow for graph rendering and interactions
- Tailwind-ish utility classes for quick styling
