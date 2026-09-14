import Navbar from '../src/components/layout/Navbar';
import Footer from '../src/components/layout/Footer';
import HeroSection from '../src/modules/hero/components/HeroSection';
import FeaturePreview from '../src/modules/hero/components/FeaturePreview';
import WorkflowSection from '../src/modules/hero/components/FinalCTA';
import BottomCTA from '../src/modules/hero/components/BottomCTA';

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <WorkflowSection />
      <FeaturePreview />
      <BottomCTA />
      <Footer />
    </main>
  );
}
