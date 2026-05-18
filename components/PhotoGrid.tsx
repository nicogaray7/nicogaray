'use client'

import { StoryCard } from './StoryCard'
import { motion } from 'framer-motion'

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {photos.map((photo, i) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
        >
          <StoryCard photo={photo} locale={locale} />
        </motion.div>
      ))}
    </div>
  )
}
