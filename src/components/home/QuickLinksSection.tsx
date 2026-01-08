import { Link } from 'react-router-dom';
import { FileText, Calendar, MessageSquare, Info, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const quickLinks = [
  {
    icon: FileText,
    titleEn: 'Court Services',
    titleAm: 'የፍርድ ቤት አገልግሎቶች',
    descEn: 'Learn about the services we provide',
    descAm: 'ስለምንሰጣቸው አገልግሎቶች ይወቁ',
    path: '/services',
    color: 'bg-primary',
  },
  {
    icon: Calendar,
    titleEn: 'News & Updates',
    titleAm: 'ዜናዎች እና መረጃዎች',
    descEn: 'Stay informed with latest announcements',
    descAm: 'በቅርብ ጊዜ ማስታወቂያዎች ይዘምኑ',
    path: '/news',
    color: 'bg-accent',
  },
  {
    icon: MessageSquare,
    titleEn: 'Contact Us',
    titleAm: 'አግኙን',
    descEn: 'Get in touch with our office',
    descAm: 'ከቢሮአችን ጋር ይገናኙ',
    path: '/contact',
    color: 'bg-gold-dark',
  },
  {
    icon: Info,
    titleEn: 'About the Court',
    titleAm: 'ስለ ፍርድ ቤቱ',
    descEn: 'Learn about our history and mission',
    descAm: 'ስለ ታሪካችን እና ተልዕኮአችን ይወቁ',
    path: '/about',
    color: 'bg-navy-light',
  },
];

export function QuickLinksSection() {
  const { t, language } = useLanguage();

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={`font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 ${language === 'am' ? 'font-ethiopic' : ''}`}>
              {t('Quick Access', 'ፈጣን መዳረሻ')}
            </h2>
            <div className="gold-accent mx-auto" />
          </motion.div>
        </div>

        {/* Quick Links Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={link.path}
                className="block group hover-card rounded-xl overflow-hidden bg-card border border-border h-full"
              >
                <div className={`${link.color} p-6`}>
                  <link.icon className="h-8 w-8 text-white" />
                </div>
                <div className="p-6">
                  <h3 className={`font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors ${language === 'am' ? 'font-ethiopic' : ''}`}>
                    {t(link.titleEn, link.titleAm)}
                  </h3>
                  <p className={`text-sm text-muted-foreground mb-4 ${language === 'am' ? 'font-ethiopic' : ''}`}>
                    {t(link.descEn, link.descAm)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    {t('Learn more', 'ተጨማሪ ይወቁ')}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
