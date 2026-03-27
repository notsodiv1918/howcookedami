import type { Metadata } from 'next'
import { Playfair_Display, Outfit, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  weight: ['400', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
})

const outfit = Outfit({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-body',
})

const jetbrains = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'How Cooked Am I? 🔥 — The AI Court of Justice',
  description: 'Describe your situation. The court will decide how cooked you are.',
  openGraph: {
    title: 'How Cooked Am I? 🔥',
    description: 'The AI Court of Justice will judge your situation. Are you cooked?',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${outfit.variable} ${jetbrains.variable}`}>
        {children}
      </body>
    </html>
  )
}
