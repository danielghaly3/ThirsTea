import { Player, type PlayerRef } from '@remotion/player'
import { useEffect, useRef } from 'react'
import ThirsteaLogoReveal from './ThirsteaLogoReveal'

export default function ThirsteaLogoPlayer() {
  const playerRef = useRef<PlayerRef>(null)

  useEffect(() => {
    /* A lazy-loaded Player can miss passive autoplay initialization in some
       browsers. Reset and start it after its ref is attached. The animation is
       silent, so this does not run into media autoplay restrictions. */
    const start = window.requestAnimationFrame(() => {
      playerRef.current?.seekTo(0)
      playerRef.current?.play()
    })

    return () => window.cancelAnimationFrame(start)
  }, [])

  return (
    <Player
      ref={playerRef}
      component={ThirsteaLogoReveal}
      durationInFrames={120}
      compositionWidth={1000}
      compositionHeight={1000}
      fps={30}
      autoPlay
      loop
      controls={false}
      allowFullscreen={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      style={{ height: '100%', width: '100%' }}
    />
  )
}
