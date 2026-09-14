import { clsx } from 'clsx';

export default function Button({ children, variant = 'cyan', size = 'md', className, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 cursor-pointer';

  const variants = {
    cyan: 'bg-cyan-500 text-dark-900 hover:bg-cyan-400 hover:shadow-cyan-glow',
    ghost: 'text-slate-400 border border-white/10 bg-white/0 hover:bg-white/5 hover:text-white hover:border-white/20',
    outline: 'border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-sm',
  };

  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
