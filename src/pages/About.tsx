import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Target, Eye, Award } from 'lucide-react';

const About = () => {
  const { t, language } = useLanguage();

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-section py-20">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4 ${language === 'am' ? 'font-ethiopic' : ''}`}
          >
            {t('About Us', 'ስለ እኛ')}
          </motion.h1>
          <p className={`text-primary-foreground/80 text-lg max-w-2xl mx-auto ${language === 'am' ? 'font-ethiopic' : ''}`}>
            {t('Learn about the Federal Court - Finote Selam Branch', 'ስለ ፌዴራል ፍርድ ቤት - ፍኖተ ሰላም ቅርንጫፍ ይወቁ')}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <div className={`text-muted-foreground leading-relaxed space-y-6 ${language === 'am' ? 'font-ethiopic' : ''}`}>
              <p>
                {t(
                  'The Federal Court - Finote Selam Branch serves as a cornerstone of justice in the West Gojjam Zone. Established to provide accessible and efficient judicial services to the people of Finote Selam and surrounding areas, our court upholds the highest standards of fairness and integrity.',
                  'ፌዴራል ፍርድ ቤት - ፍኖተ ሰላም ቅርንጫፍ በምዕራብ ጎጃም ዞን የፍትህ ማዕከል ሆኖ ያገለግላል። ለፍኖተ ሰላም እና አካባቢው ነዋሪዎች ተደራሽ እና ውጤታማ የፍትህ አገልግሎት ለመስጠት የተቋቋመው ፍርድ ቤታችን ከፍተኛውን የፍትሃዊነት እና ታማኝነት ደረጃ ይጠብቃል።'
                )}
              </p>
              <p>
                {t(
                  'As part of the Federal Judiciary of Ethiopia, we are committed to delivering timely justice while respecting the rights and dignity of all who come before the court.',
                  'የኢትዮጵያ ፌዴራል ዳኝነት አካል እንደመሆናችን፣ ወደ ፍርድ ቤት ለሚመጡ ሁሉ መብት እና ክብር በማክበር ወቅታዊ ፍትህ ለማድረስ ቁርጠኞች ነን።'
                )}
              </p>
            </div>
          </motion.div>

          {/* Vision & Mission */}
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h2 className={`font-serif text-2xl font-semibold ${language === 'am' ? 'font-ethiopic' : ''}`}>
                  {t('Our Vision', 'ራዕያችን')}
                </h2>
              </div>
              <p className={`text-muted-foreground ${language === 'am' ? 'font-ethiopic' : ''}`}>
                {t(
                  'To be a model court that delivers accessible, transparent, and timely justice to all citizens.',
                  'ለሁሉም ዜጎች ተደራሽ፣ ግልጽ እና ወቅታዊ ፍትህ የሚያደርስ አርአያ ፍርድ ቤት መሆን።'
                )}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <h2 className={`font-serif text-2xl font-semibold ${language === 'am' ? 'font-ethiopic' : ''}`}>
                  {t('Our Mission', 'ተልዕኮአችን')}
                </h2>
              </div>
              <p className={`text-muted-foreground ${language === 'am' ? 'font-ethiopic' : ''}`}>
                {t(
                  'To administer justice impartially, protect constitutional rights, and serve our community with excellence.',
                  'ፍትህን በገለልተኝነት ማስተዳደር፣ ሕገ መንግሥታዊ መብቶችን መጠበቅ እና ማህበረሰባችንን በልዩ ብቃት ማገልገል።'
                )}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
