import LanguageGame from '@/components/game/LanguageGame'
import React from 'react'

const page = () => {
  return (
    <div className="h-lvh font-[family-name:var(--font-geist-sans)]">
      <main>
        <div className="flex flex-col items-center justify-center h-lvh text-sm text-center font-[family-name:var(--font-geist-mono)]">
          <LanguageGame></LanguageGame>
        </div>
      </main>
    </div>
  )
}

export default page
