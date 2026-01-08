import { Shield, Users, Eye, Scale, Lightbulb, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const values = [
  {
    icon: Shield,
    titleEn: 'Integrity',
    titleAm: 'ታማኝነት',
    descEn: 'Upholding the highest ethical standards in all our proceedings and decisions.',
    descAm: 'በሁሉም ሂደቶቻችን እና ውሳኔዎቻችን ከፍተኛውን የስነምግባር ደረጃ መጠበቅ።',
  },
  {
    icon: Eye,
    titleEn: 'Transparency',
    titleAm: 'ግልጽነት',
    descEn: 'Ensuring open and accountable judicial processes accessible to all.',
    descAm: 'ለሁሉም ተደራሽ የሆነ ግልጽ እና ተጠያቂ የፍትህ ሂደትን ማረጋገጥ።',
  },
  {
    icon: Scale,
    titleEn: 'Fairness',
    titleAm: 'ፍትሃዊነት',
    descEn: 'Treating all parties equally before the law without discrimination.',
    descAm: 'ሁሉንም ወገኖች ያለ አድልዎ በህግ ፊት እኩል ማስተናገድ።',
  },
  {
    icon: Users,
    titleEn: 'Respect',
    titleAm: 'አክብሮት',
    descEn: 'Valuing the dignity and rights of every individual who enters our court.',
    descAm: 'ወደ ፍርድ ቤታችን የሚመጣ የእያንዳንዱ ግለሰብ ክብር እና መብት መዋጋት።',
  },
  {
    icon: Lightbulb,
    titleEn: 'Innovation',
    titleAm: 'ፈጠራ',
    descEn: 'Continuously improving our services through modern technology and methods.',
    descAm: 'በዘመናዊ ቴክኖሎጂ እና ዘዴዎች አገልግሎታችንን ያለማቋረጥ ማሻሻል።',
  },
  {
    icon: Heart,
    titleEn: 'Service',
    titleAm: 'አገልግሎት',
    descEn: 'Dedicated to serving the community with excellence and compassion.',
    descAm: 'ማህበረሰቡን በልዩ ብቃት እና ርህራሄ ለማገልገል መወሰን።',
  },
];

export function ValuesSection() {
  const { t, language } = useLanguage();

  return (
    <section className="py-20 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className={`text-secondary font-semibold mb-2 ${language === 'am' ? 'font-ethiopic' : ''}`}>
              {t('Our Foundation', 'መሰረታችን')}
            </p>
            <h2 className={`font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 ${language === 'am' ? 'font-ethiopic' : ''}`}>
              {t('Vision, Mission & Values', 'ራዕይ፣ ተልዕኮ እና እሴቶች')}
            </h2>
            <div className="gold-accent mx-auto mb-6" />
            <p className={`text-muted-foreground text-lg leading-relaxed ${language === 'am' ? 'font-ethiopic' : ''}`}>
              {t(
                'Our court is built on a foundation of six core values that guide every decision we make and every service we provide.',
                'ፍርድ ቤታችን የምናደርገውን ውሳኔ እና የምንሰጠውን አገልግሎት የሚመራ በስድስት ዋና እሴቶች መሰረት ላይ የተገነባ ነው።'
              )}
            </p>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <motion.div
              key={value.titleEn}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="value-card group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className={`font-serif text-xl font-semibold text-foreground ${language === 'am' ? 'font-ethiopic' : ''}`}>
                  {t(value.titleEn, value.titleAm)}
                </h3>
              </div>
              <p className={`text-muted-foreground leading-relaxed ${language === 'am' ? 'font-ethiopic' : ''}`}>
                {t(value.descEn, value.descAm)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
