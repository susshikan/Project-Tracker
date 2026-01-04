import Header from "./Header"
import HeroContent from "./HeroContent"
import PulsingCircle from "./PulsingCircle"
import ShaderBackground from "./ShaderBackground"

export default function HeroSection() {
  return (
    <ShaderBackground>
      <Header />
      <HeroContent />
      <PulsingCircle />
    </ShaderBackground>
  )
}
