import { Player, type PlayerRef } from '@remotion/player'
import { useEffect, useRef } from 'react'
import ThirsteaLogoReveal, { DURATION } from './ThirsteaLogoReveal'

const DURATION_IN_FRAMES = DURATION
/* Hold here rather than at DURATION_IN_FRAMES: the Player rewinds the moment
   it reaches the end, so the stop has to land before it. */
const LAST_FRAME = DURATION_IN_FRAMES - 2

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

    /*
     * Stop on the last frame and stay there.
     *
     * The Player has no "play once and hold" mode. Looping restarts at the
     * blank frame 0, so the finished logo wiped itself every four seconds;
     * NOT looping is worse, because on 'ended' the Player rewinds to frame 0
     * and pauses there, leaving the mark permanently invisible.
     *
     * So the stop is done here, one frame early, while it is still playing.
     * Pausing before the end means the rewind never happens and the composition
     * simply rests on the finished lockup — which is the real logo.
     */
    const player = playerRef.current
    const hold = ({ detail }: { detail: { frame: number } }) => {
      if (detail.frame >= LAST_FRAME) playerRef.current?.pause()
    }
    player?.addEventListener('frameupdate', hold)

    return () => {
      window.clearTimeout(timer)
      player?.removeEventListener('frameupdate', hold)
    }
  }, [])

  return (
    <Player
      ref={playerRef}
      component={ThirsteaLogoReveal}
      durationInFrames={DURATION_IN_FRAMES}
      compositionWidth={1000}
      compositionHeight={1000}
      fps={30}
      autoPlay
      /*
       * Deliberately not looping.
       *
       * Frame 0 of this composition is the pre-reveal state — pearl offscreen,
       * wordmark at opacity 0 — so a loop meant the finished logo blanked out
       * completely every four seconds and rebuilt itself, forever, in the
       * corner of the visitor's eye. It reads as the logo failing to load
       * rather than as an ident.
       *
       * An ident introduces a mark and then gets out of the way. It plays once
       * and holds its last frame, which is the shop's actual logo.
       */
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
