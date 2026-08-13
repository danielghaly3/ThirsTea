import { Player } from '@remotion/player'
import ThirsteaLogoReveal from './ThirsteaLogoReveal'

export default function ThirsteaLogoPlayer() {
  return (
    <Player
      component={ThirsteaLogoReveal}
      durationInFrames={120}
      compositionWidth={1000}
      compositionHeight={1000}
      fps={30}
      autoPlay
      controls={false}
      allowFullscreen={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      style={{ height: '100%', width: '100%' }}
    />
  )
}
