import React from 'react';
import { CheckCircle, Clock, Shield, Search, Database } from 'lucide-react';

export default function IngestionWorkflow({ analysisContext }) {
  const steps = [
    {
      num: '01',
      name: 'Target Verification',
      desc: 'Validated repository existence, accessibility, and default branch on GitHub API.',
      status: 'COMPLETE',
      icon: Search,
    },
    {
      num: '02',
      name: 'Tree Enumeration',
      desc: `Scanned ${analysisContext?.scannedFilesCount || 'all'} files recursively via git tree endpoint without cloning heavy git history.`,
      status: 'COMPLETE',
      icon: Database,
    },
    {
      num: '03',
      name: 'Smart Classification',
      desc: 'Partitioned files into Manifests, Documentation, Contribution Standards, and Workflows.',
      status: 'COMPLETE',
      icon: Shield,
    },
    {
      num: '04',
      name: 'Deterministic Extractors',
      desc: `Fetched contents of ${analysisContext?.fetchedFilesCount || 0} critical files; ran isolated regex and AST pattern extractors.`,
      status: 'COMPLETE',
      icon: CheckCircle,
    },
    {
      num: '05',
      name: 'RIO Serialization',
      desc: 'Validated against RIO Schema and persisted into distributed cache layer.',
      status: 'COMPLETE',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Deterministic RIE Pipeline Lifecycle
        </h3>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
          5 / 5 Stages Verified
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="p-3.5 rounded-xl bg-dark-900 border border-white/5 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-cyan-400 font-bold">{step.num}</span>
                <Icon className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h4 className="text-xs font-semibold text-white">{step.name}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
