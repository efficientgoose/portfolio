import React from "react";
import { Briefcase, Zap } from "lucide-react";
import { timeline } from "../../data/timeline";

export default function Experience() {
  return (
    <section id="experience" className="py-20 px-6 bg-white/[0.02]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <Briefcase size={25} className="text-green-400" />
          <h2 className="text-2xl font-bold text-gray-100">Experience</h2>
          <span className="text-xs text-gray-600 ml-auto">// career path</span>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-green-500/50 via-green-500/20 to-transparent"></div>

          <div className="space-y-8">
            {timeline.map((job, idx) => (
              <div key={idx} className="relative pl-20">
                <div
                  className={`absolute left-6 top-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    job.status === "current"
                      ? "bg-green-500 border-green-400 shadow-lg shadow-green-500/50"
                      : "bg-gray-900 border-green-500/30"
                  }`}
                >
                  {job.status === "current" && (
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  )}
                </div>

                <div className="bg-white/5 border border-gray-800 rounded-lg p-5 hover:border-green-500/30 transition-all group">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-100 group-hover:text-green-400 transition-colors">
                        {job.role}
                      </h3>
                      <div className="text-sm text-green-400 font-mono">
                        {job.company}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.status === "current" && (
                        <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/30">
                          ACTIVE
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-3 font-mono">
                    {job.duration}
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2 text-[10px] text-gray-600">
                    <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></div>
                    <span>// Building distributed systems</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
