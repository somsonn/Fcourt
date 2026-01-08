import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Gavel, FileText, Users, Shield, Scale, Clock } from 'lucide-react';

const services = [
  {
    icon: Gavel,
    titleEn: 'Civil Cases',
    titleAm: 'የፍትሐብሔር ጉዳዮች',
    descEn: 'Handling disputes related to contracts, property, family matters, and civil rights.',
    descAm: 'ከውል፣ ንብረት፣ የቤተሰብ ጉዳዮች እና የዜጎች መብቶች ጋር የተያያዙ አለመግባባቶችን ማስተናገድ።',
  },
  {
    icon: Scale,
    titleEn: 'Criminal Cases',
    titleAm: 'የወንጀል ጉዳዮች',
    descEn: 'Adjudicating criminal matters under federal jurisdiction with fair proceedings.',
    descAm: 'በፍትሃዊ ሂደት የፌዴራል ስልጣን ስር ያሉ የወንጀል ጉዳዮችን መዳኘት።',
  },
  {
    icon: FileText,
    titleEn: 'Legal Documentation',
    titleAm: 'የህግ ሰነዶች',
    descEn: 'Issuing court orders, certificates, and legal documents.',
    descAm: 'የፍርድ ቤት ትዕዛዞችን፣ የምስክር ወረቀቶችን እና የህግ ሰነዶችን ማውጣት።',
  },
  {
    icon: Users,
    titleEn: 'Mediation Services',
    titleAm: 'የሽምግልና አገልግሎቶች',
    descEn: 'Alternative dispute resolution through court-supervised mediation.',
    descAm: 'በፍርድ ቤት ቁጥጥር ስር ባለ ሽምግልና አማራጭ የአለመግባባት አፈታት።',
  },
  {
    icon: Shield,
    titleEn: 'Rights Protection',
    titleAm: 'የመብቶች ጥበቃ',
    descEn: 'Ensuring constitutional rights are protected through judicial review.',
    descAm: 'ሕገ መንግሥታዊ መብቶች በዳኝነት ክለሳ እንዲጠበቁ ማረጋገጥ።',
  },
  {
    icon: Clock,
    titleEn: 'Case Scheduling',
    titleAm: 'የጉዳይ ቀጠሮ',
    descEn: 'Efficient scheduling and management of court proceedings.',
    descAm: 'የፍርድ ቤት ሂደቶችን ውጤታማ በሆነ መንገድ መርሐ ግብር ማውጣት እና ማስተዳደር።',
  },
];

const Services = () => {
  const { t, language } = useLanguage();

  return (
    <Layout>
      <section className="hero-section py-20">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4 ${language === 'am' ? 'font-ethiopic' : ''}`}
          >
            {t('Our Services', 'አገልግሎቶቻችን')}
          </motion.h1>
          <p className={`text-primary-foreground/80 text-lg max-w-2xl mx-auto ${language === 'am' ? 'font-ethiopic' : ''}`}>
            {t('Comprehensive judicial services for our community', 'ለማህበረሰባችን አጠቃላይ የፍትህ አገልግሎቶች')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.div
                key={service.titleEn}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 hover-card"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className={`font-serif text-xl font-semibold mb-3 ${language === 'am' ? 'font-ethiopic' : ''}`}>
                  {t(service.titleEn, service.titleAm)}
                </h3>
                <p className={`text-muted-foreground ${language === 'am' ? 'font-ethiopic' : ''}`}>
                  {t(service.descEn, service.descAm)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
