import { Player, type PlayerRef } from '@remotion/player'
import { useEffect, useRef } from 'react'
import ThirsteaLogoReveal from './ThirsteaLogoReveal'

export default function ThirsteaLogoPlayer() {
  const playerRef = useRef<PlayerRef>(null)

  useEffect(() => {
    /*
     * Make sure the ident actually runs, and re-arm it if it only thinks it is.
     *
     * StrictMode mounts every component twice in development. The Player
     * survives that with its `playing` flag still set but its internal frame
     * loop detached, so it sits on frame 0 forever while reporting
     * isPlaying() === true. Frame 0 is the pre-reveal state — pearl offscreen,
     * wordmark at opacity 0 — so the logo isn't merely still, it's invisible.
     * A production build never double-mounts, which is why this only ever went
     * wrong while working on the site.
     *
     * Because it believes it's playing, play() alone is a no-op. Pausing first
     * is what re-arms the loop.
     *
     * Two rules keep the retry from becoming the bug:
     *   - a moved frame is the only trustworthy signal, since isPlaying() lies
     *     in exactly the state being repaired;
     *   - retries are spaced by a timeout, never per animation frame. Kicking
     *     it every frame restarts the loop before it can advance, which pins
     *     the ident to frame 0 — indistinguishable from the fault itself.
     *
     * Nothing seeks in here either; a seek on each attempt would reset the
     * reveal every time it fired. Ten attempts, then it gives up after ~2s.
     */
    let timer = 0
    let attempts = 0

    const tryStart = () => {
      const player = playerRef.current

      if (player && player.getCurrentFrame() > 0) return

      if (player?.isPlaying()) player.pause()
      player?.play()

      if (attempts++ < 10) timer = window.setTimeout(tryStart, 200)
    }

    timer = window.setTimeout(tryStart, 0)
    return () => window.clearTimeout(timer)
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
      /* Silences the licensing notice this build logs on every mount. The shop
         is far below Remotion's free-tier company-size threshold. */
      acknowledgeRemotionLicense
      style={{ height: '100%', width: '100%' }}
    />
  )
}
