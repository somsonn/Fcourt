import { Link } from 'react-router-dom';
import { ArrowRight, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export function HeroSection() {
  const { t, language } = useLanguage();

  return (
    <section className="hero-section relative min-h-[600px] lg:min-h-[700px] flex items-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary mb-8"
          >
            <Scale className="h-4 w-4" />
            <span className={`text-sm font-medium ${language === 'am' ? 'font-ethiopic' : ''}`}>
              {t('Federal Judiciary of Ethiopia', 'የኢትዮጵያ ፌዴራል ፍትህ')}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight ${language === 'am' ? 'font-ethiopic' : ''}`}
          >
            {t('Federal Court', 'ፌዴራል ፍርድ ቤት')}
            <br />
            <span className="text-secondary">
              {t('Finote Selam Branch', 'ፍኖተ ሰላም ቅርንጫፍ')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed ${language === 'am' ? 'font-ethiopic' : ''}`}
          >
            {t(
              'Committed to delivering justice with integrity, transparency, and respect for all citizens of Ethiopia.',
              'ለሁሉም የኢትዮጵያ ዜጎች በታማኝነት፣ በግልጽነት እና በአክብሮት ፍትህ ለማድረስ ቁርጠኛ።'
            )}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/services" className={`gap-2 ${language === 'am' ? 'font-ethiopic' : ''}`}>
                {t('Our Services', 'አገልግሎቶቻችን')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="xl">
              <Link to="/contact" className={language === 'am' ? 'font-ethiopic' : ''}>
                {t('Contact Us', 'አግኙን')}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}
