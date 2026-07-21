import { useEffect } from 'react';
import HomeNavbar from '@components/home/HomeNavbar';
import Hero from '@components/home/Hero';
import SearchBox from '@components/home/SearchBox';
import StatisticsSection from '@components/home/Statistics/StatisticsSection';
import FeaturesSection from '@components/home/Features/FeaturesSection';
import CompaniesSection from '@components/home/Companies/CompaniesSection';
import DestinationsSection from '@components/home/Destinations/DestinationsSection';
import HowItWorksSection from '@components/home/HowItWorks/HowItWorksSection';
import MobileAppSection from '@components/home/MobileApp/index';
import TestimonialsSection from '@components/home/Testimonials/TestimonialsSection';
import FAQSection from '@components/home/FAQ/FAQSection';
import NewsletterSection from '@components/home/Newsletter/NewsletterSection';
import FinalCTASection from '@components/home/FinalCTA/index';
import HomeFooter from '@components/home/Footer/HomeFooter';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page">
      <HomeNavbar />
      <Hero />
      <SearchBox />
      <StatisticsSection />
      <FeaturesSection />
      <CompaniesSection />
      <DestinationsSection />
      <HowItWorksSection />
      <MobileAppSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />
      <FinalCTASection />
      <HomeFooter />
    </div>
  );
};

export default HomePage;
