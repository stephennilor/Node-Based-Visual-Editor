import React, { useMemo, useState } from "react";
import ReactFlow, {
  Controls,
  MiniMap,
  Handle,
  Position,
  type Node as RFNode,
  type Edge as RFEdge,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

type Port = { id: string; label: string; color?: string; inherit?: boolean };

type NilorData = {
  title: string;
  subtitle?: string;
  accentColor: string;
  inputs: Port[];
  outputs: Port[];
};

function NilorNode({ data }: { data: NilorData }) {
  const rowBody = 20; // px
  const rowGap = 8; // px
  const rowHeight = rowBody + rowGap; // 28px
  const headerH = data.subtitle ? 56 : 42; // matches px-6 py-4 vs py-2
  const pad = 16; // p-4

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl min-w-56 overflow-hidden relative">
      <div
        className="px-6 py-4 border-b border-gray-700 text-white relative"
        style={{ backgroundColor: data.accentColor }}
      >
        <div className="relative text-center">
          <div className="font-bold text-lg">{data.title}</div>
          {data.subtitle ? (
            <div className="text-white/90 text-sm opacity-90">{data.subtitle}</div>
          ) : null}
        </div>
      </div>

      <div className="p-4 bg-gray-800">
        <div className="flex justify-between items-start gap-12">
          <div className="flex flex-col gap-2">
            {data.inputs.map((p) => (
              <div key={p.id} className="relative flex items-center h-5 pl-4">
                {(() => { /* effective color for input handle */ })()}
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`in-${p.id}`}
                  style={{
                    position: 'absolute',
                    left: -6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 12,
                    height: 12,
                    borderRadius: 9999,
                    border: '2px solid #4b5563',
                    background: p.color || data.accentColor,
                  }}
                />
                <span className="text-gray-300 text-sm leading-none">{p.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-right">
            {data.outputs.map((p) => {
              const outColor = p.inherit === false && p.color ? p.color : data.accentColor;
              return (
              <div key={p.id} className="relative flex items-center justify-end h-5 pr-4">
                <span className="text-gray-300 text-sm leading-none">{p.label}</span>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`out-${p.id}`}
                  style={{
                    position: 'absolute',
                    right: -6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 12,
                    height: 12,
                    borderRadius: 9999,
                    border: '2px solid #4b5563',
                    background: outColor,
                  }}
                />
              </div>
            );})}
          </div>
        </div>
      </div>

      {/* Native React Flow handles positioned relative to the node container */}
      {/* handles are now placed inside each row for perfect vertical alignment */}
    </div>
  );
}

const nodeTypes = { nilor: NilorNode };

export default function NodeEditor() {
  const initialNodes = useMemo<RFNode<NilorData>[]>(
    () => [
      {
        id: 'in1',
        type: 'nilor',
        position: { x: 100, y: 120 },
        data: {
          title: 'Input A',
          accentColor: '#10B981',
          inputs: [],
          outputs: [
            { id: 'out', label: 'Output' },
          ],
        },
      },
      {
        id: 'in2',
        type: 'nilor',
        position: { x: 100, y: 260 },
        data: {
          title: 'Input B',
          accentColor: '#F39C12',
          inputs: [],
          outputs: [
            { id: 'to-process', label: 'To Process' },
            { id: 'to-output', label: 'To Output' },
          ],
        },
      },
      {
        id: 'proc',
        type: 'nilor',
        position: { x: 420, y: 180 },
        data: {
          title: 'Process',
          accentColor: '#4A90E2',
          inputs: [
            { id: 'in1', label: 'Input 1', color: '#10B981' },
            { id: 'in2', label: 'Input 2', color: '#F39C12' },
          ],
          outputs: [
            { id: 'out', label: 'Output' },
          ],
        },
      },
      {
        id: 'out',
        type: 'nilor',
        position: { x: 740, y: 180 },
        data: {
          title: 'Output',
          accentColor: '#9B59B6',
          inputs: [
            { id: 'in', label: 'Input', color: '#4A90E2' },
          ],
          outputs: [],
        },
      },
    ],
    [],
  );

  const initialEdges = useMemo<RFEdge[]>(
    () => [
      {
        id: 'e-in1-proc',
        source: 'in1',
        sourceHandle: 'out-out',
        target: 'proc',
        targetHandle: 'in-in1',
        type: 'bezier',
        style: { stroke: '#10B981', strokeWidth: 2.5 },
      },
      {
        id: 'e-in2-proc',
        source: 'in2',
        sourceHandle: 'out-to-process',
        target: 'proc',
        targetHandle: 'in-in2',
        type: 'bezier',
        style: { stroke: '#F39C12', strokeWidth: 2.5 },
      },
      {
        id: 'e-in2-out',
        source: 'in2',
        sourceHandle: 'out-to-output',
        target: 'out',
        targetHandle: 'in-in',
        type: 'bezier',
        style: { stroke: '#F39C12', strokeWidth: 2.5 },
      },
    ],
    [],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(0);

  // Autosave to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('nilor-graph', JSON.stringify({ nodes, edges }));
    } catch {}
  }, [nodes, edges]);

  // Autoload from localStorage (once)
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('nilor-graph');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPortColorFromHandle = (nodeId: string, handleId?: string) => {
    if (!handleId) return undefined;
    const node = nodes.find((n) => n.id === nodeId);
    const portId = handleId.replace(/^out-|^in-/, "");
    if (!node) return undefined;
    const data = node.data as NilorData;
    const list = handleId.startsWith("out-") ? data.outputs : data.inputs;
    const port = list.find((p) => p.id === portId);
    if (!port) return data.accentColor;
    if (handleId.startsWith("out-")) {
      // outputs inherit node color unless explicitly overridden
      return port.inherit === false && port.color ? port.color : data.accentColor;
    }
    // inputs: use explicit color if set, else fall back to node color for visual coherence
    return port.color || data.accentColor;
  };

  const onConnectHandler = (params: any) => {
    const stroke = getPortColorFromHandle(params.source, params.sourceHandle) || "#8b8b8b";
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          type: "bezier",
          style: { stroke, strokeWidth: 2.5 },
        },
        eds,
      ),
    );
  };

  const onNodeClick = (_: any, node: RFNode) => {
    setSelectedNodeId(node.id);
  };

  const onEdgesDeleteHandler = (deleted: RFEdge[]) => {
    setEdges((eds) => eds.filter((e) => !deleted.some((d) => d.id === e.id)));
  };

  const onEdgeDoubleClick = (_: any, edge: RFEdge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) as RFNode<NilorData> | undefined;

  const updateSelectedNode = (patch: Partial<NilorData>) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) => (n.id === selectedNode.id ? { ...n, data: { ...n.data, ...patch } } : n)),
    );
  };

  // Add Node helpers
  const randomAccent = () => {
    const palette = ["#9B59B6", "#F39C12", "#27AE60", "#4A90E2", "#E74C3C", "#16A085"];
    return palette[Math.floor(Math.random() * palette.length)];
  };

  const makePorts = (count: number, baseLabel: string, color: string): Port[] =>
    Array.from({ length: count }).map((_, i) => ({ id: Math.random().toString(36).slice(2, 9), label: `${baseLabel} ${i + 1}`, color }));

  const addNodeOfKind = (kind: 'input' | 'process' | 'output') => {
    const id = Math.random().toString(36).slice(2, 9);
    const accent = randomAccent();
    const pos = { x: 100 + Math.round(Math.random() * 900), y: 80 + Math.round(Math.random() * 400) };

    const base: RFNode<NilorData> = {
      id,
      type: 'nilor',
      position: pos,
      data: {
        title: kind === 'input' ? 'Input Node' : kind === 'output' ? 'Output Node' : 'Process Node',
        accentColor: accent,
        inputs: [],
        outputs: [],
      },
    };

    if (kind === 'input') {
      base.data.inputs = [];
      base.data.outputs = makePorts(2, 'Output', accent);
    } else if (kind === 'output') {
      base.data.inputs = makePorts(2, 'Input', accent);
      base.data.outputs = [];
    } else {
      base.data.inputs = makePorts(2, 'Input', accent);
      base.data.outputs = makePorts(2, 'Output', accent);
    }

    setNodes((nds) => [...nds, base]);
    setSelectedNodeId(id);
  };

  // Helpers to edit ports
  const makeId = () => Math.random().toString(36).slice(2, 9);

  const addPort = (kind: 'inputs' | 'outputs') => {
    if (!selectedNode) return;
    const data = selectedNode.data as NilorData;
    const newPort = {
      id: makeId(),
      label: kind === 'inputs' ? `Input ${data.inputs.length + 1}` : `Output ${data.outputs.length + 1}`,
      color: data.accentColor,
    };
    updateSelectedNode({ [kind]: [...(data[kind] as Port[]), newPort] } as Partial<NilorData>);
  };

  const removePort = (kind: 'inputs' | 'outputs', portId: string) => {
    if (!selectedNode) return;
    const data = selectedNode.data as NilorData;
    setEdges((eds) =>
      eds.filter(
        (e) =>
          !(
            (e.source === selectedNode.id && e.sourceHandle === `out-${portId}`) ||
            (e.target === selectedNode.id && e.targetHandle === `in-${portId}`)
          ),
      ),
    );
    updateSelectedNode({ [kind]: (data[kind] as Port[]).filter((p) => p.id !== portId) } as Partial<NilorData>);
  };

  const renamePort = (kind: 'inputs' | 'outputs', portId: string, label: string) => {
    if (!selectedNode) return;
    const data = selectedNode.data as NilorData;
    updateSelectedNode({
      [kind]: (data[kind] as Port[]).map((p) => (p.id === portId ? { ...p, label } : p)),
    } as Partial<NilorData>);
  };

  // Inspector helpers for output color override
  const setOutputColor = (portId: string, color: string) => {
    if (!selectedNode) return;
    const data = selectedNode.data as NilorData;
    updateSelectedNode({
      outputs: (data.outputs || []).map((p) => (p.id === portId ? { ...p, color, inherit: false } : p)),
    });
  };

  const resetOutputColor = (portId: string) => {
    if (!selectedNode) return;
    const data = selectedNode.data as NilorData;
    updateSelectedNode({
      outputs: (data.outputs || []).map((p) => (p.id === portId ? { ...p, color: undefined, inherit: true } : p)),
    });
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={onEdgesDeleteHandler}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onConnect={onConnectHandler}
        onNodeClick={onNodeClick}
        connectionLineType="bezier"
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{ animated: false }}
        style={{ background: '#000' }}
      >
        {/* Toolbar */}
        <div className="absolute top-4 left-4 z-50 flex gap-2">
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white rounded px-3 py-1 text-sm border border-gray-700"
            onClick={() => addNodeOfKind('input')}
          >
            + Input Node
          </button>
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white rounded px-3 py-1 text-sm border border-gray-700"
            onClick={() => addNodeOfKind('process')}
          >
            + Process Node
          </button>
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white rounded px-3 py-1 text-sm border border-gray-700"
            onClick={() => addNodeOfKind('output')}
          >
            + Output Node
          </button>

          {/* Save/Load */}
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white rounded px-3 py-1 text-sm border border-gray-700"
            onClick={() => {
              const dataStr = JSON.stringify({ nodes, edges }, null, 2);
              const blob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'nilor-graph.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Save JSON
          </button>
          <label className="bg-gray-800 hover:bg-gray-700 text-white rounded px-3 py-1 text-sm border border-gray-700 cursor-pointer">
            Load JSON
            <input
              key={fileInputKey}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = () => {
                  try {
                    const parsed = JSON.parse(String(reader.result || '{}'));
                    if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
                      setNodes(parsed.nodes);
                      setEdges(parsed.edges);
                    }
                  } catch {}
                  setFileInputKey((k) => k + 1);
                };
                reader.readAsText(f);
              }}
            />
          </label>
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white rounded px-3 py-1 text-sm border border-gray-700"
            onClick={() => {
              localStorage.removeItem('nilor-graph');
            }}
          >
            Clear Autosave
          </button>
        </div>
        <MiniMap pannable zoomable />
        <Controls />

        {selectedNode && (
          <div className="absolute top-4 right-4 bg-gray-900/90 border border-gray-700 rounded-md p-3 w-64 z-50 space-y-3">
            <div className="text-white font-medium">Inspector</div>
            <label className="text-gray-300 text-sm block">
              Title
              <input
                className="mt-1 w-full rounded bg-gray-800 border border-gray-700 px-2 py-1 text-white"
                value={selectedNode.data.title}
                onChange={(e) => updateSelectedNode({ title: e.target.value })}
              />
            </label>

            <div className="pt-2 border-t border-gray-800">
              <div className="text-gray-200 text-sm mb-2">Inputs</div>
              <div className="space-y-2 max-h-40 overflow-auto pr-1">
                {(selectedNode.data.inputs || []).map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <input
                      className="flex-1 rounded bg-gray-800 border border-gray-700 px-2 py-1 text-white text-sm"
                      value={p.label}
                      onChange={(e) => renamePort('inputs', p.id, e.target.value)}
                    />
                    <button
                      className="text-gray-400 hover:text-red-400 px-2"
                      title="Remove input"
                      onClick={() => removePort('inputs', p.id)}
                    >
                      ×
                    </button>
        </div>
                ))}
              </div>
              <button
                className="mt-2 w-full bg-gray-800 hover:bg-gray-700 text-white rounded px-3 py-1 text-sm"
                onClick={() => addPort('inputs')}
              >
                + Add Input
              </button>
            </div>

            <div className="pt-2 border-t border-gray-800">
              <div className="text-gray-200 text-sm mb-2">Outputs</div>
              <div className="space-y-2 max-h-40 overflow-auto pr-1">
                {(selectedNode.data.outputs || []).map((p) => (
                  <div key={p.id} className="flex flex-col gap-1 rounded border border-gray-800 p-2">
                    <div className="flex items-center gap-2">
                      <input
                        className="flex-1 rounded bg-gray-800 border border-gray-700 px-2 py-1 text-white text-sm"
                        value={p.label}
                        onChange={(e) => renamePort('outputs', p.id, e.target.value)}
                      />
                      <button
                        className="text-gray-400 hover:text-red-400 px-2"
                        title="Remove output"
                        onClick={() => removePort('outputs', p.id)}
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-300">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(p.inherit === false && p.color) ? p.color : (selectedNode.data.accentColor || '#10B981')}
                          onChange={(e) => setOutputColor(p.id, e.target.value)}
                          title="Output color override"
                        />
                        <span>{p.inherit === false ? 'Override' : 'Inherit'}</span>
                      </div>
                      <button
                        className="text-gray-400 hover:text-white"
                        onClick={() => resetOutputColor(p.id)}
                        title="Reset to inherit node color"
                      >
                        Reset
                      </button>
                </div>
                </div>
                ))}
              </div>
              <button
                className="mt-2 w-full bg-gray-800 hover:bg-gray-700 text-white rounded px-3 py-1 text-sm"
                onClick={() => addPort('outputs')}
              >
                + Add Output
              </button>
            </div>
            {/* Subtitle toggle */}
            <div className="flex items-center justify-between text-gray-300 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedNode.data.subtitle !== undefined}
                  onChange={(e) =>
                    updateSelectedNode({ subtitle: e.target.checked ? (selectedNode.data.subtitle || "Subtitle") : undefined })
                  }
                />
                Show subtitle
              </label>
            </div>
            {selectedNode.data.subtitle !== undefined && (
              <label className="text-gray-300 text-sm block">
                Subtitle
                <input
                  className="mt-1 w-full rounded bg-gray-800 border border-gray-700 px-2 py-1 text-white"
                  value={selectedNode.data.subtitle || ""}
                  onChange={(e) => updateSelectedNode({ subtitle: e.target.value })}
                />
              </label>
            )}
            <label className="text-gray-300 text-sm block">
              Accent Color
              <input
                type="color"
                className="mt-1 w-full h-8 rounded border border-gray-700"
                value={selectedNode.data.accentColor}
                onChange={(e) => updateSelectedNode({ accentColor: e.target.value })}
              />
            </label>
            <button
              className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded px-3 py-1 text-sm"
              onClick={() => setSelectedNodeId(null)}
            >
              Close
            </button>
          </div>
        )}
      </ReactFlow>
    </div>
  );
}