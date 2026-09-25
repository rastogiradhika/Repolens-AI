import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xl font-bold mb-4">
        404
      </div>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-slate-400 text-sm max-w-md mb-6">
        The requested repository intelligence resource or page does not exist.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-dark-900 font-semibold text-sm transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
