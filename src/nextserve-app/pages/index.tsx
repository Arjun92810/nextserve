import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import About from '../components/About';
import FadeInOnScroll from '../components/FadeInOnScroll';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FadeInOnScroll>
        <Features />
        </FadeInOnScroll>
      <FadeInOnScroll>
        <About />
      </FadeInOnScroll>
      <Footer />
    </main>

  );
}
