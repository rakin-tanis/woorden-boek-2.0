import React from 'react'
import Leaderboard from '@/components/leaderboard/Leaderboard'

const page = () => {
  return (
    <div className="min-h-screen overflow-auto">
      <main className="relative">
        <div className="min-h-screen flex flex-col">
          <div className="relative min-h-screen flex flex-col">
            {/* Header height spacer */}
            <div className="h-[19rem] w-full"></div>

            <div className="flex-grow px-2 py-4 scroll-pt-24 md:scroll-pt-36 scroll-pb-[33vh] flex items-center justify-center min-h-full">
              <Leaderboard />
            </div>

            {/* Keyboard height spacer */}
            <div
              className="-z-50 h-[21.5rem] w-full"
              style={{
                // Dynamically set height to match actual keyboard
                height: `calc(var(--keyboard-height, 33vh))`
              }}
            ></div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default page
