import React, { useState } from "react";
import {
  FileCode,
  X,
  Copy,
  Download,
  Check,
} from "lucide-react";
import { PROJECT_WHITE_PAPER } from "../data/projectDoc";

interface ProjectDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDocumentationModal: React.FC<ProjectDocumentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(PROJECT_WHITE_PAPER.sections[0].id);

  if (!isOpen) return null;

  const fullMarkdownText = `# ${PROJECT_WHITE_PAPER.title}
## ${PROJECT_WHITE_PAPER.subtitle}
**Version:** ${PROJECT_WHITE_PAPER.version} | **Date:** ${PROJECT_WHITE_PAPER.date}
**Author:** ${PROJECT_WHITE_PAPER.author}

${PROJECT_WHITE_PAPER.sections
  .map((sec) => `## ${sec.title}\n\n${sec.markdown}`)
  .join("\n\n---\n\n")}`;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(fullMarkdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadDoc = () => {
    const blob = new Blob([fullMarkdownText], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "SwasthyaSamvid_SaMD_Project_Details_Doc.md");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const currentSection =
    PROJECT_WHITE_PAPER.sections.find((s) => s.id === activeSectionId) ||
    PROJECT_WHITE_PAPER.sections[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Topbar */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {PROJECT_WHITE_PAPER.title}
              </h2>
              <p className="text-xs text-slate-500">
                {PROJECT_WHITE_PAPER.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Markdown"}
            </button>
            <button
              onClick={handleDownloadDoc}
              className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download Doc (.md)
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Sidebar Sections & View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation */}
          <div className="w-72 bg-slate-50 border-r border-slate-200 p-4 space-y-2 overflow-y-auto shrink-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-2">
              Document Sections
            </span>
            {PROJECT_WHITE_PAPER.sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition-all ${
                  activeSectionId === sec.id
                    ? "bg-indigo-50 text-indigo-900 border border-indigo-200 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>

          {/* Right Content Render Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-white text-slate-800 space-y-4 text-xs leading-relaxed">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">
              {currentSection.title}
            </h3>

            <div className="prose max-w-none text-slate-700 space-y-3 font-sans">
              {currentSection.markdown.split("\n\n").map((chunk, idx) => {
                if (chunk.startsWith("### ")) {
                  return (
                    <h4 key={idx} className="text-sm font-bold text-emerald-800 pt-2">
                      {chunk.replace("### ", "")}
                    </h4>
                  );
                }
                if (chunk.startsWith("```")) {
                  return (
                    <pre
                      key={idx}
                      className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-[11px] text-emerald-900 overflow-x-auto leading-normal"
                    >
                      {chunk.replace(/```/g, "")}
                    </pre>
                  );
                }
                return (
                  <p key={idx} className="text-slate-700 leading-relaxed">
                    {chunk}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
