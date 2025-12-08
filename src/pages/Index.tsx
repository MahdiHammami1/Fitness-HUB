import { Layout } from '@/component/layout/Layout';
import { HeroSection } from '@/component/home/HeroSection';
import { CoachingPreview } from '@/component/home/CoachingPreview';
import { EventsPreview } from '@/component/home/EventsPreview';
import { ProductsPreview } from '@/component/home/ProductsPreview';
import { TestimonialsSection } from '@/component/home/TestimonialsSection';
import { CTASection } from '@/component/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CoachingPreview />
      <EventsPreview />
      <ProductsPreview />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
