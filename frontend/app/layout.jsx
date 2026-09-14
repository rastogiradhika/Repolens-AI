import './globals.css';

export const metadata = {
  title: 'RepoLens AI — Contribute to GitHub repos with confidence',
  description:
    'RepoLens AI decodes architecture, contribution guides, and PR requirements into clear, step-by-step developer guidance in seconds.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-dark-900 text-slate-200 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
