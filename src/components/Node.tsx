import React from 'react';

interface Port {
  id: string;
  label: string;
  color: string;
  type: 'input' | 'output';
}

interface NodeProps {
  id: string;
  title: string;
  x: number;
  y: number;
  inputs: Port[];
  outputs: Port[];
  accentColor: string;
}

export function Node({ id, title, x, y, inputs, outputs, accentColor }: NodeProps) {
  return (
    <div
      className="absolute select-none"
      style={{ left: x, top: y }}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl min-w-48 overflow-hidden">
        {/* Header */}
        <div 
          className="px-4 py-2 border-b border-gray-700 text-white font-medium"
          style={{ backgroundColor: accentColor }}
        >
          {title}
        </div>
        
        {/* Body */}
        <div className="p-4 bg-gray-800">
          <div className="flex justify-between items-start gap-8">
            {/* Inputs */}
            <div className="space-y-2">
              {inputs.map((input) => (
                <div key={input.id} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border-2 border-gray-600 transition-all hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: input.color }}
                    data-port-id={input.id}
                    data-port-type="input"
                  />
                  <span className="text-gray-300 text-sm">{input.label}</span>
                </div>
              ))}
            </div>
            
            {/* Outputs */}
            <div className="space-y-2 text-right">
              {outputs.map((output) => (
                <div key={output.id} className="flex items-center gap-2 justify-end">
                  <span className="text-gray-300 text-sm">{output.label}</span>
                  <div
                    className="w-3 h-3 rounded-full border-2 border-gray-600 transition-all hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: output.color }}
                    data-port-id={output.id}
                    data-port-type="output"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}