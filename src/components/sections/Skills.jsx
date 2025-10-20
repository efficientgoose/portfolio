import { useState, useRef, useEffect } from "react";
import { techStack } from "../../data/techStack";
import { Wrench } from "lucide-react";

export default function Skills() {
  const [positions, setPositions] = useState({});
  const [dragging, setDragging] = useState(null);
  const containerRef = useRef(null);
  const elementRefs = useRef({});
  const dragStateRef = useRef(null);

  useEffect(() => {
    const initialPositions = {};
    techStack.forEach((tech, idx) => {
      initialPositions[idx] = { x: tech.x, y: tech.y };
    });
    setPositions(initialPositions);
  }, []);

  const handleMouseDown = (e, idx) => {
    if (!containerRef.current || !elementRefs.current[idx]) return;

    e.preventDefault();

    const containerRect = containerRef.current.getBoundingClientRect();
    const elementRect = elementRefs.current[idx].getBoundingClientRect();

    const elementCenterX =
      elementRect.left + elementRect.width / 2 - containerRect.left;
    const elementCenterY =
      elementRect.top + elementRect.height / 2 - containerRect.top;

    const elementCenterXPercent = (elementCenterX / containerRect.width) * 100;
    const elementCenterYPercent = (elementCenterY / containerRect.height) * 100;

    dragStateRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startElementX: elementCenterXPercent,
      startElementY: elementCenterYPercent,
      originalX: techStack[idx].x,
      originalY: techStack[idx].y,
    };

    setPositions((prev) => ({
      ...prev,
      [idx]: { x: elementCenterXPercent, y: elementCenterYPercent },
    }));

    setDragging(idx);
  };

  const handleMouseMove = (e) => {
    if (dragging === null || !dragStateRef.current || !containerRef.current)
      return;

    const rect = containerRef.current.getBoundingClientRect();

    const deltaX = e.clientX - dragStateRef.current.startMouseX;
    const deltaY = e.clientY - dragStateRef.current.startMouseY;

    const deltaXPercent = (deltaX / rect.width) * 100;
    const deltaYPercent = (deltaY / rect.height) * 100;

    // Free drag - no radius constraint
    const newX = dragStateRef.current.startElementX + deltaXPercent;
    const newY = dragStateRef.current.startElementY + deltaYPercent;

    setPositions((prev) => ({
      ...prev,
      [dragging]: { x: newX, y: newY },
    }));
  };

  const handleMouseUp = () => {
    if (dragging !== null && dragStateRef.current) {
      const originalX = dragStateRef.current.originalX;
      const originalY = dragStateRef.current.originalY;
      const currentDragging = dragging;

      // Step 1: Stop dragging (this enables the transition in the next render)
      setDragging(null);

      // Step 2: Wait for the browser to apply the transition CSS
      // Use double requestAnimationFrame to ensure the transition is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Step 3: Now change the position - spring animation will kick in
          setPositions((prev) => ({
            ...prev,
            [currentDragging]: {
              x: originalX,
              y: originalY,
            },
          }));
        });
      });
    } else {
      setDragging(null);
    }
  };

  useEffect(() => {
    if (dragging !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging]);

  return (
    <section id="skills" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Wrench size={25} className="text-green-400" />
          <h2 className="text-2xl font-bold text-gray-100">Skills</h2>
          <span className="text-xs text-gray-600 ml-auto">// skill cloud</span>
        </div>

        <div
          ref={containerRef}
          className="bg-white/5 border border-gray-800 rounded-lg p-12 min-h-[500px] relative select-none"
        >
          {techStack.map((tech, idx) => {
            const currentPos = positions[idx] || { x: tech.x, y: tech.y };
            const isDraggingThis = dragging === idx;

            return (
              <div
                key={idx}
                ref={(el) => (elementRefs.current[idx] = el)}
                className={`group absolute hover:z-50 ${
                  isDraggingThis ? "cursor-grabbing z-50" : "cursor-grab"
                }`}
                style={{
                  left: `${currentPos.x}%`,
                  top: `${currentPos.y}%`,
                  transform: isDraggingThis
                    ? "translate(-50%, -50%) scale(1.1)"
                    : "translate(-50%, -50%)",
                  animationName: isDraggingThis ? "none" : "float",
                  animationDuration: `${3 + (idx % 3)}s`,
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: `${idx * 0.1}s`,
                  // No transition while dragging, spring animation when not dragging
                  transition: isDraggingThis
                    ? "none"
                    : "left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.3s ease-out",
                }}
                onMouseDown={(e) => handleMouseDown(e, idx)}
              >
                <span
                  className={`${
                    tech.size
                  } font-bold text-gray-600 group-hover:text-green-400 transition-all duration-300 block whitespace-nowrap ${
                    isDraggingThis ? "text-green-400" : ""
                  }`}
                  style={{
                    textShadow: isDraggingThis
                      ? "0 0 20px rgba(0, 255, 65, 0.6)"
                      : "0 0 10px rgba(0, 255, 65, 0)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isDraggingThis) {
                      e.currentTarget.style.textShadow =
                        "0 0 20px rgba(0, 255, 65, 0.6)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDraggingThis) {
                      e.currentTarget.style.textShadow =
                        "0 0 10px rgba(0, 255, 65, 0)";
                    }
                  }}
                >
                  {tech.name}
                </span>

                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 border border-green-500/30 rounded text-xs text-green-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {tech.proficiency}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-green-500/30"></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-8 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span>Hover to see proficiency</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">Size = Experience level</span>
          </div>
        </div>
      </div>
    </section>
  );
}
