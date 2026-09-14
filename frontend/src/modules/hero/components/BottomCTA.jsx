import RepositoryInput from './RepositoryInput';

const techLogos = ['TypeScript', 'Python', 'Go', 'Next', 'React'];

export default function BottomCTA() {
  return (
    <section className="py-24 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative glass-card rounded-3xl overflow-hidden px-6 py-16 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.05), rgba(139,92,246,0.04), transparent)' }}>

          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-cyan-500/10 blur-3xl rounded-full" />

          <div className="relative">
            <p className="section-badge mb-5 mx-auto w-fit">
              ⚡ Instant & Free Analysis
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              Ready to make your next
              <br />contribution count?
            </h2>
            <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              Paste any repository link and get full intelligence and a breakdown of actions, rules, and hints.
            </p>

            <RepositoryInput />

            {/* Language tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {techLogos.map((t) => (
                <span key={t} className="mono-label text-slate-600 text-[10px] px-2 py-1 bg-white/[0.03] border border-white/[0.06] rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
