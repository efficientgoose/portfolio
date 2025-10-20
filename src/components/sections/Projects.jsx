import React from "react";
import { Coffee, FolderGit2 } from "lucide-react";
import { projects } from "../../data/projects";

export default function Projects() {
  return (
    <section id="projects" className="py-20 px-6 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FolderGit2 size={25} className="text-green-400" />
          <h2 className="text-2xl font-bold text-gray-100">Projects</h2>
          <span className="text-xs text-gray-600 ml-auto">// building</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-gray-800 rounded p-5 hover:border-yellow-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400 font-mono group-hover:text-yellow-500 transition-colors">
                  {project.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${project.statusColor} animate-pulse`}
                  ></div>
                  <span className={`text-xs ${project.statusTextColor}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-600 space-y-1 mb-3">
                <div>Status: {project.statusText}</div>
                <div>Stack: {project.stack}</div>
                <div>Deploy: {project.deploy}</div>
              </div>

              <div className="text-xs text-gray-700 bg-black/30 border border-gray-800 rounded p-2 font-mono">
                {project.description.map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-600 bg-white/5 border border-gray-800 rounded px-4 py-2">
            <Coffee size={14} className="text-orange-400" />
            <span>Crafting production-ready systems</span>
          </div>
        </div>
      </div>
    </section>
  );
}
