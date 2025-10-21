import React from "react";
import { Mail, Github, Linkedin, ExternalLink, Send } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Send size={25} className="text-green-400" />
          <h2 className="text-2xl font-bold text-gray-100">Get In Touch</h2>
        </div>

        <div className="bg-white/5 border border-gray-800 rounded p-6">
          <div className="space-y-4">
            <a
              href="mailto:ajinkode@gmail.com"
              className="flex items-center gap-3 text-sm text-gray-400 hover:text-green-400 transition-all duration-300 group"
              style={{ transition: "all 0.3s ease" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow =
                  "0 0 12px rgba(74, 222, 128, 1), 0 0 25px rgba(74, 222, 128, 0.7), 0 0 40px rgba(74, 222, 128, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = "none";
              }}
            >
              <Mail size={16} className="text-green-400" />
              <span>ajinkode@gmail.com</span>
              <ExternalLink
                size={12}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </a>

            <a
              href="https://github.com/efficientgoose"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-gray-400 hover:text-green-400 transition-all duration-300 group"
              style={{ transition: "all 0.3s ease" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow =
                  "0 0 12px rgba(74, 222, 128, 1), 0 0 25px rgba(74, 222, 128, 0.7), 0 0 40px rgba(74, 222, 128, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = "none";
              }}
            >
              <Github size={16} className="text-green-400" />
              <span>github.com/efficientgoose</span>
              <ExternalLink
                size={12}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </a>

            <a
              href="https://linkedin.com/in/ajinkode"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-gray-400 hover:text-green-400 transition-all duration-300 group"
              style={{ transition: "all 0.3s ease" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow =
                  "0 0 12px rgba(74, 222, 128, 1), 0 0 25px rgba(74, 222, 128, 0.7), 0 0 40px rgba(74, 222, 128, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = "none";
              }}
            >
              <Linkedin size={16} className="text-green-400" />
              <span>linkedin.com/in/ajinkode</span>
              <ExternalLink
                size={12}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800 text-xs text-gray-600">
            <div className="text-green-400 mb-2">// OPEN_FOR_OPPORTUNITIES</div>
            <div>
              Need a backend architect for distributed systems? Let's build
              something scalable together.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
