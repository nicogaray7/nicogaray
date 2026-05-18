'use client'

import { StoryCard } from './StoryCard'

interface Photo {
  id: string
  thumbKeyR2: string
  previewKeyR2: string
  country: string | null
  city: string | null
  orientation: string
  price: number
}

export function PhotoGrid({
  photos,
  locale,
}: {
  photos: Photo[]
  locale: string
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {photos.map((photo, i) => (
        <div
          key={photo.id}
          className="animate-reveal"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <StoryCard photo={photo} locale={locale} />
        </div>
      ))}
    </div>
  )
}
