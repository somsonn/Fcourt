import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { ValuesSection } from '@/components/home/ValuesSection';
import { QuickLinksSection } from '@/components/home/QuickLinksSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ValuesSection />
      <QuickLinksSection />
    </Layout>
  );
};

export default Index;
