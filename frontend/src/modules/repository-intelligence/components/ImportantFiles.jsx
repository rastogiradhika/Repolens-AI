import React from 'react';
import { FileCode, FolderTree, BookOpen, ShieldAlert } from 'lucide-react';

export default function ImportantFiles({ documentationFiles = [], sourceFiles = [], topLevelDirectories = [] }) {
  return (
    <div className="space-y-4">
      {/* Top Level Directories */}
      {topLevelDirectories.length > 0 && (
        <div className="p-5 rounded-xl bg-dark-900 border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
            <FolderTree className="w-4 h-4 text-cyan-400" />
            <span>Top-Level Directory Hierarchy</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {topLevelDirectories.map((dir, i) => (
              <span key={i} className="px-2.5 py-1 rounded bg-dark-800 border border-white/10 text-xs font-mono text-cyan-300">
                📁 {dir}/
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Identified Documentation & Standards Files */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-dark-900 border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Discovered Docs & Guides</span>
          </div>
          {documentationFiles.length > 0 ? (
            <div className="space-y-1.5">
              {documentationFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-dark-800/60 px-2.5 py-1.5 rounded border border-white/5">
                  <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate">{file}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No external markdown docs detected.</p>
          )}
        </div>

        <div className="p-5 rounded-xl bg-dark-900 border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Contribution & Governance Files</span>
          </div>
          {sourceFiles.length > 0 ? (
            <div className="space-y-1.5">
              {sourceFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-dark-800/60 px-2.5 py-1.5 rounded border border-white/5">
                  <FileCode className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate">{file}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No template or contributing files found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
