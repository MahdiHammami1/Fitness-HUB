import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/component/layout/Layout';
import { HeroSection } from '@/component/home/HeroSection';
import { CoachingPreview } from '@/component/home/CoachingPreview';
import { EventsPreview } from '@/component/home/EventsPreview';
import { ProductsPreview } from '@/component/home/ProductsPreview';
import { TestimonialsSection } from '@/component/home/TestimonialsSection';
import { CTASection } from '@/component/home/CTASection';
import { useUser } from '@/context/UserContext';
import { isAuthenticated } from '@/lib/api';

const Index = () => {
  const navigate = useNavigate();
  const { loading } = useUser();

  useEffect(() => {
    // If user is not authenticated, log out and redirect to sign-in
    if (!loading && !isAuthenticated()) {
      // Clear any stored data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/sign-in', { replace: true });
    }
  }, [loading, navigate]);

  // Show nothing while checking authentication
  if (loading || !isAuthenticated()) {
    return null;
  }

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
