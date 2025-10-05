import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'),
  title: 'AI/ML Engineer Salaries (Live) — Premium vs SWE, Trends by City & Skill | Mobius',
  description: 'Real-time AI/ML Engineer compensation: base, bonus, equity, and premium vs SWE. Filter by city, level, company, and skill. Updated weekly from millions of postings.',
  openGraph: {
    title: 'What Do AI/ML Engineers Earn Today?',
    description: 'Real-time AI/ML Engineer compensation with premium vs SWE, by city, level, company, and skill.',
    type: 'website',
    images: [
      {
        url: '/og-image-salaries.png',
        width: 1200,
        height: 630,
        alt: 'AI/ML Engineer Salary Trends',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Do AI/ML Engineers Earn Today?',
    description: 'Real-time AI/ML Engineer compensation with premium vs SWE, by city, level, company, and skill.',
    images: ['/og-image-salaries.png'],
  },
}

export default function SalariesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

