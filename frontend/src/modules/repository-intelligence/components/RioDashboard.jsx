import React from 'react';
import { GitFork, Star, FileText, Settings, ShieldCheck, Box } from 'lucide-react';

export default function RioDashboard({ rio }) {
  if (!rio || !rio.metadata) return null;

  const { metadata, intelligence } = rio;
  
  // Safe fallbacks in case extractors failed
  const techStack = intelligence.techStack || { frameworks: [], tools: [] };
  const rules = intelligence.rules || { branchRules: [], commitRules: [] };
  const docs = intelligence.documentation || { summary: 'No summary available.' };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center gap-3 text-cyan-400 mb-2">
            <FileText className="w-5 h-5" />
            <h3 className="font-semibold">Repository</h3>
          </div>
          <p className="text-xl font-bold">{metadata.name}</p>
          <p className="text-sm text-gray-400 mt-1">{metadata.primaryLanguage || 'Unknown'}</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center gap-3 text-cyan-400 mb-2">
            <Star className="w-5 h-5" />
            <h3 className="font-semibold">Stars</h3>
          </div>
          <p className="text-xl font-bold">{metadata.stars.toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center gap-3 text-cyan-400 mb-2">
            <GitFork className="w-5 h-5" />
            <h3 className="font-semibold">Type</h3>
          </div>
          <p className="text-xl font-bold">{metadata.isFork ? 'Forked' : 'Original'}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tech Stack */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center gap-3 text-blue-400 mb-4">
            <Box className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Tech Stack Detected</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-2">Frameworks</p>
              <div className="flex flex-wrap gap-2">
                {techStack.frameworks.length > 0 ? techStack.frameworks.map((fw, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm border border-blue-800">
                    {fw}
                  </span>
                )) : <span className="text-gray-500 text-sm">None detected</span>}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Tools & Libraries</p>
              <div className="flex flex-wrap gap-2">
                {techStack.tools.length > 0 ? techStack.tools.map((t, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700">
                    {t}
                  </span>
                )) : <span className="text-gray-500 text-sm">None detected</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Rules */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center gap-3 text-green-400 mb-4">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Contribution Rules</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-2">Branch Naming Rules</p>
              {rules.branchRules.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                  {rules.branchRules.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              ) : <p className="text-gray-500 text-sm">No specific branch rules found.</p>}
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Commit Conventions</p>
              {rules.commitRules.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                  {rules.commitRules.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              ) : <p className="text-gray-500 text-sm">No strict commit rules detected.</p>}
            </div>
          </div>
        </div>

        {/* Documentation Summary */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl lg:col-span-2">
          <div className="flex items-center gap-3 text-purple-400 mb-4">
            <Settings className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Project Summary & Architecture</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {docs.summary}
          </p>
          
          {docs.setupInstructions && docs.setupInstructions.length > 0 && (
            <div className="mt-4 p-4 bg-gray-950 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400 mb-2 font-semibold">Quick Setup Insights:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300 font-mono">
                {docs.setupInstructions.slice(0, 5).map((inst, i) => <li key={i}>{inst}</li>)}
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
