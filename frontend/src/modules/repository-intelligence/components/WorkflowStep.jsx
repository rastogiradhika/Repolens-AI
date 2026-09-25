import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

export default function WorkflowStep({ number, title, description, isComplete = true }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-dark-900 border border-white/5">
      <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xs shrink-0">
        {isComplete ? <Check className="w-3.5 h-3.5" /> : number}
      </div>
      <div>
        <h4 className="text-xs font-semibold text-white">{title}</h4>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
