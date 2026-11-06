import Script from 'next/script';
import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://getyouraiprompt.com'),
  title: {
    default: 'GetYourAIPrompt — Studio-Grade AI Video Prompts & Formulas',
    template: '%s | GetYourAIPrompt',
  },
  description: 'Specialized AI video prompt library. Copy and paste commercial, product, and cinematic prompts engineered for generative video models.',
  keywords: ['AI video prompts', 'cinematic AI prompt', 'commercial video prompt', 'e-commerce AI video', 'camera motion prompt', 'generative video blueprints'],
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'GetYourAIPrompt',
    title: 'GetYourAIPrompt — Studio-Grade AI Video Prompts & Formulas',
    description: 'Studio-quality AI video prompts engineered for high-performance generative video. Copy proven camera angles, lighting cues, and pacing formulas.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GetYourAIPrompt — Studio-Grade AI Video Prompts & Formulas',
    description: 'Copy and paste proven, commercial-grade video prompts for generative AI video.',
  },
  other: {
    'google-adsense-account': 'ca-pub-4726881193237202',
  },
};

export default function RootLayout({ children }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-4726881193237202';

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="dark"
    >
      <head>
        <meta name="google-adsense-account" content={adsenseClient} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0d1117] text-[#F0F6FC] antialiased selection:bg-[#45A29E]/30 selection:text-[#66FCF1]">
        {children}
        {adsenseClient && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
