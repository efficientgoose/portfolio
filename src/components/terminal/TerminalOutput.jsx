import React from "react";

export default function TerminalOutput({ terminalHistory, terminalEndRef }) {
  return (
    <div className="h-64 overflow-y-auto p-3 text-xs bg-black">
      {terminalHistory.map((entry, idx) => (
        <div key={idx} className="mb-2">
          {entry.type === "input" ? (
            <div className="text-green-400">
              <span className="text-cyan-400">➜</span> {entry.text}
            </div>
          ) : (
            <div className="text-gray-400 whitespace-pre-wrap">
              {entry.text}
            </div>
          )}
        </div>
      ))}
      <div ref={terminalEndRef} />
    </div>
  );
}
