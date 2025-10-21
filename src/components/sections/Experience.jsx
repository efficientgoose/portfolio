import React from "react";
import { Briefcase } from "lucide-react";
import { timeline } from "../../data/timeline";

export default function Experience() {
  const getBadgeClasses = (color) => {
    const colors = {
      green: "text-green-400 bg-green-500/10 border-green-500/30",
      cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      purple: "text-purple-400 bg-purple-500/10 border-purple-500/30",
      amber: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    };
    return colors[color] || colors.green;
  };

  return (
    <section id="experience" className="py-20 px-6 bg-white/[0.02]">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-12">
          <Briefcase size={25} className="text-green-400" />
          <h2 className="text-2xl font-bold text-gray-100">
            Experience + Education
          </h2>
          <span className="ml-auto text-xs text-gray-600">
            // career trajectory
          </span>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-green-500/50 via-green-500/20 to-transparent" />

          <div className="space-y-8">
            {timeline.map((job, idx) => (
              <div key={idx} className="relative pl-20">
                {/* Timeline Dot */}
                <div
                  className={`absolute left-6 top-2 w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${
                      job.status === "current"
                        ? "bg-green-500 border-green-400 shadow-lg shadow-green-500/50"
                        : job.status === "education"
                        ? "bg-amber-500 border-amber-400 shadow-lg shadow-amber-500/50"
                        : "bg-gray-900 border-green-500/30"
                    }
                  `}
                >
                  {(job.status === "current" || job.status === "education") && (
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </div>

                {/* Card */}
                <div
                  className={`bg-white/5 border border-gray-800 rounded-lg p-5 transition-all group ${
                    job.status === "education"
                      ? "hover:border-amber-500/30"
                      : "hover:border-green-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3
                        className={`text-lg font-bold text-gray-100 transition-colors ${
                          job.status === "education"
                            ? "group-hover:text-amber-400"
                            : "group-hover:text-green-400"
                        }`}
                      >
                        {job.role}
                      </h3>
                      <div
                        className={`text-sm font-mono ${
                          job.status === "education"
                            ? "text-amber-400"
                            : "text-green-400"
                        }`}
                      >
                        {job.company}
                      </div>
                    </div>

                    {/* Status Badge */}
                    {job.badge && (
                      <span
                        className={`text-xs px-2 py-1 rounded border ${getBadgeClasses(
                          job.badgeColor
                        )}`}
                      >
                        {job.badge}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mb-3 font-mono">
                    {job.duration}
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Footer Tag */}
                  {job.footer && (
                    <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2 text-[10px] text-gray-600">
                      <div
                        className={`w-1 h-1 rounded-full animate-pulse ${
                          job.status === "education"
                            ? "bg-amber-400"
                            : "bg-green-400"
                        }`}
                      />
                      <span>// {job.footer}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
