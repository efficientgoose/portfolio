import { useState, useEffect, useRef } from "react";
import { commandResponses } from "../data/commands";

export function useTerminal() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState([
    {
      type: "output",
      text: 'Terminal ready. Type "/" to see commands or "help" for list.',
    },
  ]);
  const [currentCommand, setCurrentCommand] = useState("");
  const terminalEndRef = useRef(null);

  const executeCommand = (cmd) => {
    const command = cmd.trim().toLowerCase();
    let output =
      commandResponses[command] ||
      `Command not found: ${cmd}\nType 'help' for available commands.`;

    if (output === "CLEAR_TERMINAL") {
      setTerminalHistory([]);
      return;
    }

    if (output === "EXIT_TERMINAL") {
      setTerminalOpen(false);
      return;
    }

    setTerminalHistory((prev) => [
      ...prev,
      { type: "input", text: cmd },
      { type: "output", text: output },
    ]);
  };

  const clearTerminal = () => setTerminalHistory([]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setTerminalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return {
    terminalOpen,
    setTerminalOpen,
    terminalHistory,
    currentCommand,
    setCurrentCommand,
    executeCommand,
    clearTerminal,
    terminalEndRef,
  };
}
