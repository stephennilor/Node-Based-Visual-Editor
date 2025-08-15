import React from 'react';

interface Port {
  id: string;
  label: string;
  color: string;
  type: 'input' | 'output';
}

interface SuperNodeProps {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  inputs: Port[];
  outputs: Port[];
  accentColor: string;
}

export function SuperNode({ id, title, subtitle, x, y, inputs, outputs, accentColor }: SuperNodeProps) {
  return (
    <div
      className="absolute select-none"
      style={{ left: x, top: y }}
    >
      <div className="bg-gray-900 border-2 border-emerald-500 rounded-xl shadow-2xl min-w-56 overflow-hidden">
        {/* Header with glow effect */}
        <div 
          className="px-6 py-4 border-b-2 border-emerald-500 text-white relative"
          style={{ backgroundColor: accentColor }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20"></div>
          <div className="relative text-center">
            <div className="font-bold text-lg">{title}</div>
            <div className="text-emerald-100 text-sm opacity-90">{subtitle}</div>
          </div>
        </div>
        
        {/* Body with enhanced styling */}
        <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="flex justify-between items-start gap-12">
            {/* Inputs */}
            <div className="space-y-3">
              {inputs.map((input) => (
                <div key={input.id} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-gray-600 transition-all hover:scale-110 cursor-pointer shadow-lg"
                    style={{ 
                      backgroundColor: input.color,
                      boxShadow: `0 0 8px ${input.color}40`
                    }}
                    data-port-id={input.id}
                    data-port-type="input"
                  />
                  <span className="text-gray-200 font-medium">{input.label}</span>
                </div>
              ))}
            </div>
            
            {/* Outputs */}
            <div className="space-y-3 text-right">
              {outputs.map((output) => (
                <div key={output.id} className="flex items-center gap-3 justify-end">
                  <span className="text-gray-200 font-medium">{output.label}</span>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-gray-600 transition-all hover:scale-110 cursor-pointer shadow-lg"
                    style={{ 
                      backgroundColor: output.color,
                      boxShadow: `0 0 8px ${output.color}40`
                    }}
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