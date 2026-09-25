import React from 'react';
import { Layers, ShieldCheck, Cpu, GitBranch, GitPullRequest, Code2 } from 'lucide-react';

export default function RioOverview({ intelligence, metadata }) {
  if (!intelligence) return null;

  const { techStack = {}, rules = {}, documentation = {}, workflows = {} } = intelligence;
  const frameworks = techStack.frameworks || [];
  const dependencies = techStack.dependencies || [];
  const tools = techStack.tools || [];

  return (
    <div className="space-y-6">
      {/* Architecture & Tech Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tech Stack */}
        <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
          <div className="flex items-center gap-2.5 text-cyan-400">
            <Cpu className="w-5 h-5" />
            <h3 className="font-semibold text-white">Technology Stack & Frameworks</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-mono">PRIMARY LANGUAGE</span>
              <p className="text-sm font-semibold text-white mt-0.5">{metadata?.primaryLanguage || techStack.primaryLanguage || 'Unknown'}</p>
            </div>

            <div>
              <span className="text-slate-400 font-mono">FRAMEWORKS DETECTED</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {frameworks.length > 0 ? (
                  frameworks.map((fw, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-medium">
                      {fw}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500">None detected</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-mono">CORE DEPENDENCIES & LIBRARIES</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5 max-h-32 overflow-y-auto pr-1">
                {dependencies.length > 0 ? (
                  dependencies.slice(0, 15).map((dep, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-dark-900 border border-white/5 text-slate-300 font-mono text-[11px]">
                      {dep}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500">None detected</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Standards */}
        <div className="p-6 rounded-2xl bg-dark-800/80 border border-white/10 space-y-4 glass-card">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-semibold text-white">Contribution Standards</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Branch Rules */}
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 font-mono mb-1">
                <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                <span>BRANCH NAMING CONVENTIONS</span>
              </div>
              {rules.branchRules && rules.branchRules.length > 0 ? (
                <ul className="space-y-1 text-slate-300">
                  {rules.branchRules.map((rule, i) => (
                    <li key={i} className="p-2 rounded bg-dark-900/60 border border-white/5 leading-relaxed">
                      {rule}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 italic">No explicit branch naming rules declared in repo.</p>
              )}
            </div>

            {/* Commit Rules */}
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 font-mono mb-1">
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                <span>COMMIT CONVENTIONS</span>
              </div>
              {rules.commitRules && rules.commitRules.length > 0 ? (
                <ul className="space-y-1 text-slate-300">
                  {rules.commitRules.map((rule, i) => (
                    <li key={i} className="p-2 rounded bg-dark-900/60 border border-white/5 leading-relaxed">
                      {rule}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 italic">Conventional commits suggested; no strict regex enforced.</p>
              )}
            </div>

            {/* PR Rules */}
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 font-mono mb-1">
                <GitPullRequest className="w-3.5 h-3.5 text-amber-400" />
                <span>PR SUBMISSION REQUIREMENTS</span>
              </div>
              {rules.pullRequestRules && rules.pullRequestRules.length > 0 ? (
                <ul className="space-y-1 text-slate-300">
                  {rules.pullRequestRules.map((rule, i) => (
                    <li key={i} className="p-2 rounded bg-dark-900/60 border border-white/5 leading-relaxed">
                      {rule}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 italic">Standard GitHub pull request workflow.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
