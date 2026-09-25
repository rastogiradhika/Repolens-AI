import './globals.css';

export const metadata = {
  title: 'RepoLens AI',
  description: 'Repository Intelligence Engine - AI-powered repository onboarding, merge risk analysis, and PR readiness platform.',
  openGraph: {
    title: 'RepoLens AI',
    description: 'Repository Intelligence Engine - AI-powered repository onboarding, merge risk analysis, and PR readiness platform.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-900 text-slate-200 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
