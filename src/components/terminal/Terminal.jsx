import { Terminal as TerminalIcon } from "lucide-react";
import { useState } from "react";
import { availableCommands } from "../../data/commands";
import CommandMenu from "./CommandMenu";
import TerminalOutput from "./TerminalOutput";

export default function Terminal({
  terminalOpen,
  setTerminalOpen,
  terminalHistory,
  currentCommand,
  setCurrentCommand,
  executeCommand,
  terminalEndRef,
}) {
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (showCommandMenu && filteredCommands.length > 0) {
        const selectedCmd = filteredCommands[selectedCommandIndex].cmd;
        setCurrentCommand("");
        setShowCommandMenu(false);
        setSelectedCommandIndex(0);
        executeCommand(selectedCmd);
      } else {
        if (currentCommand.trim()) {
          executeCommand(currentCommand);
          setCurrentCommand("");
        }
      }
    } else if (e.key === "ArrowDown" && showCommandMenu) {
      e.preventDefault();
      setSelectedCommandIndex((prev) =>
        prev < filteredCommands.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp" && showCommandMenu) {
      e.preventDefault();
      setSelectedCommandIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Escape" && showCommandMenu) {
      e.preventDefault();
      setShowCommandMenu(false);
      setSelectedCommandIndex(0);
    }
  };

  const handleCommandChange = (e) => {
    const value = e.target.value;
    setCurrentCommand(value);

    if (value === "/" || (value.startsWith("/") && value.length > 1)) {
      setShowCommandMenu(true);
      setSelectedCommandIndex(0);
    } else {
      setShowCommandMenu(false);
    }
  };

  const selectCommand = (cmd) => {
    setCurrentCommand("");
    setShowCommandMenu(false);
    setSelectedCommandIndex(0);
    executeCommand(cmd);
  };

  const filteredCommands = showCommandMenu
    ? availableCommands.filter((item) =>
        item.cmd.toLowerCase().includes(currentCommand.slice(1).toLowerCase())
      )
    : [];

  if (!terminalOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-[32rem] max-w-[90vw] bg-black border border-green-500/30 rounded shadow-2xl shadow-green-500/20 z-50">
      <div className="flex items-center justify-between bg-gray-900 px-3 py-2 border-b border-green-500/20">
        <div className="flex items-center gap-2 text-green-400 text-xs">
          <TerminalIcon size={14} />
          <span>terminal</span>
          <span className="text-gray-600 ml-2 text-[10px]">
            Press Esc to close
          </span>
        </div>
        <button
          onClick={() => setTerminalOpen(false)}
          className="text-gray-500 hover:text-gray-300 text-xs"
        >
          ✕
        </button>
      </div>

      <TerminalOutput
        terminalHistory={terminalHistory}
        terminalEndRef={terminalEndRef}
      />

      <div className="border-t border-green-500/20 p-3 bg-gray-900 relative">
        {showCommandMenu && filteredCommands.length > 0 && (
          <CommandMenu
            filteredCommands={filteredCommands}
            selectedCommandIndex={selectedCommandIndex}
            selectCommand={selectCommand}
          />
        )}

        <div className="flex items-center gap-2 text-xs">
          <span className="text-cyan-400">➜</span>
          <input
            type="text"
            value={currentCommand}
            onChange={handleCommandChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-green-400"
            placeholder="type command or press /"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
