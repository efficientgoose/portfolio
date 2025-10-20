import React, { useEffect } from "react";

export default function CommandMenu({
  filteredCommands,
  selectedCommandIndex,
  selectCommand,
}) {
  useEffect(() => {
    const menuElement = document.getElementById("command-menu-list");
    const selectedElement = document.getElementById(
      `command-item-${selectedCommandIndex}`
    );

    if (menuElement && selectedElement) {
      const menuRect = menuElement.getBoundingClientRect();
      const selectedRect = selectedElement.getBoundingClientRect();

      if (selectedRect.bottom > menuRect.bottom) {
        selectedElement.scrollIntoView({ block: "end", behavior: "smooth" });
      } else if (selectedRect.top < menuRect.top) {
        selectedElement.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    }
  }, [selectedCommandIndex]);

  return (
    <div
      id="command-menu-list"
      className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 border border-green-500/30 rounded max-h-48 overflow-y-auto shadow-lg"
    >
      <div className="px-3 py-1 text-[10px] text-gray-600 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900">
        <span>Commands</span>
        <span>↑↓ navigate • Enter select</span>
      </div>
      {filteredCommands.map((item, idx) => (
        <div
          key={item.cmd}
          id={`command-item-${idx}`}
          onClick={() => selectCommand(item.cmd)}
          className={`px-3 py-2 cursor-pointer text-xs flex items-center justify-between transition-colors ${
            idx === selectedCommandIndex
              ? "bg-green-500/20 text-green-400 border-l-2 border-green-400"
              : "text-gray-400 hover:bg-green-500/10 border-l-2 border-transparent"
          }`}
        >
          <span className="font-mono font-bold">{item.cmd}</span>
          <span className="text-[10px] text-gray-600 ml-4">{item.desc}</span>
        </div>
      ))}
    </div>
  );
}
