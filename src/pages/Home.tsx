import HeroCarousel from '../sections/HeroCarousel'
import Experience from '../sections/Experience'
import Shelf from '../sections/Shelf'
import Story from '../sections/Story'
import RightNow from '../sections/RightNow'
import DealBand from '../sections/DealBand'
import VisitTeaser from '../sections/VisitTeaser'

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <Experience />
      <Shelf />
      <Story />
      <RightNow />
      <DealBand />
      <VisitTeaser />
    </>
  )
}
