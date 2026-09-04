import React from 'react'

type FaqItem = {
  question: string
  answer: string
}

/**
 * Render an FAQ list and emit FAQPage JSON-LD structured data for search engines.
 *
 * Usage in MDX:
 *   <FAQ items={[{ question: '...', answer: '...' }]} />
 */
export default function FAQ({ items }: { items: FaqItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <div>
      {items.map((item) => (
        <React.Fragment key={item.question}>
          <p>
            <strong>{item.question}</strong>
          </p>
          <p>{item.answer}</p>
        </React.Fragment>
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
