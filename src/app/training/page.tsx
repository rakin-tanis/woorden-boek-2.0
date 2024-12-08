import LanguageGame from '@/components/game/LanguageGame'
import SSProtectedComponent from '@/components/SSProtectedComponent'
import { checkIsMobile } from '@/lib/utils'
import { headers } from 'next/headers'
import React from 'react'


type PageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const source = (params['source'] as string) || "green"
  const level = (params['level'] as string) || '1'
  const themes = params['themes']
    ? Array.isArray(params['themes'])
      ? params['themes']
      : [params['themes']]
    : ['1']

  const isMobile = checkIsMobile((await headers()).get('user-agent') || '');

  return (
    <SSProtectedComponent allowedPermissions={[{ resource: 'trainingPage', action: 'view' }]} redirectToLogin={true}>

      <LanguageGame
        mode={'training'}
        source={source}
        level={level}
        themes={themes}
      />

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
    </SSProtectedComponent>
  )
}

export default page