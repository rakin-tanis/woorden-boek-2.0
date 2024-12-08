import LanguageGame from '@/components/game/LanguageGame'
import { checkIsMobile } from '@/lib/utils';
import { GAME_MODE } from '@/types'
import { headers } from 'next/headers';
import React from 'react'

const page = async () => {

  const isMobile = checkIsMobile((await headers()).get('user-agent') || '');

  return (
    <div>
      <LanguageGame mode={GAME_MODE.COMPETITION} />

      {/* Keyboard height spacer */}
      {
        isMobile && <div
          className="-z-50 h-[33vh] w-full"
          style={{
            // Dynamically set height to match actual keyboard
            height: `calc(var(--keyboard-height, 33vh))`
          }}
        ></div>
      }
    </div>
  )
}

export default page
