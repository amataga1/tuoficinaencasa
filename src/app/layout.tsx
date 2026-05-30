import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tudominio.es'
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Tu Oficina en Casa'
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Guías y comparativas para montar tu oficina perfecta en casa'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: `%s | ${siteName}` },
  description: siteDescription,
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: siteUrl,
    siteName,
    description: siteDescription,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  other: {
    // Pinterest Rich Pins — se activa en pinterest.com/website/verify
    'og:site_name': siteName,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XKXB89V4D5" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XKXB89V4D5');
        `}} />
        {/* Pinterest verification */}
        <meta name="p:domain_verify" content="bbe5ccb23567a77f15a5e78c3d7359dd" />
        <script async defer src="//assets.pinterest.com/js/pinit.js" />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6197439436975017"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
        {children}
      </body>
    </html>
  )
}
