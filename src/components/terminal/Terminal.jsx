import { Terminal as TerminalIcon } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (terminalOpen) {
      // Reset animation state first, then trigger animation
      setIsAnimating(false);
      setTimeout(() => {
        setIsAnimating(true);
      }, 10); // Small delay to ensure the transition triggers
    } else {
      setIsAnimating(false);
    }
  }, [terminalOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setTerminalOpen(false);
    }, 300); // Match animation duration
  };

  const handleCommandExecution = (cmd) => {
    // Check if the command is exit (with or without slash)
    if (cmd === "exit" || cmd === "/exit") {
      executeCommand(cmd); // Still execute to show in history
      handleClose(); // Then close with animation
    } else {
      executeCommand(cmd);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      if (showCommandMenu) {
        e.preventDefault();
        setShowCommandMenu(false);
        setSelectedCommandIndex(0);
      } else {
        handleClose();
      }
      return;
    }

    if (e.key === "Enter") {
      if (showCommandMenu && filteredCommands.length > 0) {
        const selectedCmd = filteredCommands[selectedCommandIndex].cmd;
        setCurrentCommand("");
        setShowCommandMenu(false);
        setSelectedCommandIndex(0);
        handleCommandExecution(selectedCmd);
      } else {
        if (currentCommand.trim()) {
          handleCommandExecution(currentCommand);
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
    handleCommandExecution(cmd);
  };

  const filteredCommands = showCommandMenu
    ? availableCommands.filter((item) =>
        item.cmd.toLowerCase().includes(currentCommand.slice(1).toLowerCase())
      )
    : [];

  if (!terminalOpen) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 w-[32rem] max-w-[90vw] bg-black border border-green-500/30 rounded shadow-2xl shadow-green-500/20 z-50 transition-all duration-300 ease-out ${
        isAnimating ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between bg-gray-900 px-3 py-2 border-b border-green-500/20">
        <div className="flex items-center gap-2 text-green-400 text-xs">
          <TerminalIcon size={14} />
          <span>terminal</span>
          <span className="text-gray-600 ml-2 text-[10px]">
            Press Esc to close
          </span>
        </div>
        <button
          onClick={handleClose}
          className="p-2 border border-gray-800 rounded hover:border-red-500/30 text-red-400 hover:text-red-300 transition-all"
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 0 10px rgba(239, 68, 68, 0.2), 0 0 20px rgba(239, 68, 68, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
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
