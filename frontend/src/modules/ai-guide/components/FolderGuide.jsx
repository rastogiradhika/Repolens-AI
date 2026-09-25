import React from 'react';
import { FolderTree, FileText } from 'lucide-react';

export default function FolderGuide({ repositoryStructure = [], importantFiles = [] }) {
  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
      <div className="flex items-center gap-2.5 text-purple-400">
        <FolderTree className="w-5 h-5" />
        <h3 className="font-semibold text-white">Repository Structure & Key Folders</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Directories */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-slate-400">MODULE DIRECTORIES</span>
          {repositoryStructure && repositoryStructure.length > 0 ? (
            <div className="space-y-1.5">
              {repositoryStructure.map((item, i) => (
                <div key={i} className="p-2 rounded-lg bg-dark-900 border border-white/5 text-xs">
                  <span className="font-mono text-purple-300 font-medium">📁 {item.folder || item.path || item}</span>
                  {item.description && <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Standard repository layout.</p>
          )}
        </div>

        {/* Key Files */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-slate-400">KEY STARTING FILES</span>
          {importantFiles && importantFiles.length > 0 ? (
            <div className="space-y-1.5">
              {importantFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-dark-900 border border-white/5 text-xs font-mono text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{typeof file === 'string' ? file : file.name || file.path}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Inspect README.md and package manifests.</p>
          )}
        </div>
      </div>
    </div>
  );
}
