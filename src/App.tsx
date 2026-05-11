import { useLenis } from './hooks/useLenis';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import OurStory from './sections/OurStory';
import Location from './sections/Location';
import MenuStack from './sections/MenuStack';
import Catering from './sections/Catering';
import Footer from './sections/Footer';

function App() {
  useLenis();

  return (
    <div className="relative bg-obsidian text-offwhite min-h-screen">
      {/* Sticky Navigation */}
      <Navigation />

      {/* Main content */}
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Our Story / The Vibe */}
        <OurStory />

        {/* Location & Times */}
        <Location />

        {/* Our Menu - Hedonic Stack */}
        <MenuStack />

        {/* Catering / Book the Truck */}
        <Catering />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

export default App;
