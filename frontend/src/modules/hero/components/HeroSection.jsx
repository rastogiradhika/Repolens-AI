import RepositoryInput from './RepositoryInput';
import ProductPreview from './ProductPreview';
import { Globe } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden" id="overview">
      {/* Background effects */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40" />

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 section-badge mb-8 animate-fade-in">
          <Globe size={11} />
          Open Source World-Simple
          <span className="text-white/30">·</span>
          <span className="text-white/60">AI</span>
          <span className="text-white/30">·</span>
          <span className="text-cyan-400">Lens</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5 animate-slide-up">
          Contribute to GitHub repos with
          <br />
          <span className="text-gradient-cyan">total confidence.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed animate-slide-up"
          style={{ animationDelay: '0.1s' }}>
          RepoLens decodes architecture, contribution guides, and PR requirements
          into clear, step-by-step developer guidance in seconds.
        </p>

        {/* Repository input */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <RepositoryInput />
        </div>

        {/* Product preview */}
        <div className="animate-slide-up" style={{ animationDelay: '0.35s' }}>
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
