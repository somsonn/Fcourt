import { Link } from 'react-router-dom';
import { Scale, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <p className={`font-serif text-lg font-semibold ${language === 'am' ? 'font-ethiopic' : ''}`}>
                  {t('Federal Court', 'ፌዴራል ፍርድ ቤት')}
                </p>
                <p className={`text-xs text-primary-foreground/70 ${language === 'am' ? 'font-ethiopic' : ''}`}>
                  {t('Finote Selam Branch', 'ፍኖተ ሰላም ቅርንጫፍ')}
                </p>
              </div>
            </div>
            <p className={`text-sm text-primary-foreground/80 leading-relaxed ${language === 'am' ? 'font-ethiopic' : ''}`}>
              {t(
                'Delivering justice with integrity, transparency, and respect for all citizens.',
                'ለሁሉም ዜጎች በታማኝነት፣ በግልጽነት እና በአክብሮት ፍትህ ማድረስ።'
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className={`font-serif text-lg font-semibold ${language === 'am' ? 'font-ethiopic' : ''}`}>
              {t('Quick Links', 'ፈጣን አገናኞች')}
            </h3>
            <ul className="space-y-2">
              {[
                { to: '/about', en: 'About Us', am: 'ስለ እኛ' },
                { to: '/services', en: 'Our Services', am: 'አገልግሎቶቻችን' },
                { to: '/news', en: 'News & Announcements', am: 'ዜናዎች እና ማስታወቂያዎች' },
                { to: '/contact', en: 'Contact Us', am: 'አግኙን' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`text-sm text-primary-foreground/70 hover:text-secondary transition-colors ${language === 'am' ? 'font-ethiopic' : ''}`}
                  >
                    {t(link.en, link.am)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className={`font-serif text-lg font-semibold ${language === 'am' ? 'font-ethiopic' : ''}`}>
              {t('Contact Information', 'የመገናኛ መረጃ')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
                <span className={language === 'am' ? 'font-ethiopic' : ''}>
                  {t('Finote Selam, Amhara Region, Ethiopia', 'ፍኖተ ሰላም፣ አማራ ክልል፣ ኢትዮጵያ')}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4 text-secondary shrink-0" />
                <span>+251 58 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4 text-secondary shrink-0" />
                <span>info@finoteselamcourt.gov.et</span>
              </li>
            </ul>
          </div>

          {/* Office Hours */}
          <div className="space-y-4">
            <h3 className={`font-serif text-lg font-semibold ${language === 'am' ? 'font-ethiopic' : ''}`}>
              {t('Office Hours', 'የስራ ሰዓታት')}
            </h3>
            <div className="flex items-start gap-3 text-sm text-primary-foreground/80">
              <Clock className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
              <div className={language === 'am' ? 'font-ethiopic' : ''}>
                <p>{t('Monday - Friday', 'ሰኞ - ዓርብ')}</p>
                <p className="text-secondary font-medium">
                  {t('8:30 AM - 5:30 PM', '8:30 ጥዋት - 5:30 ከሰዓት')}
                </p>
                <p className="mt-2">{t('Saturday - Sunday', 'ቅዳሜ - እሁድ')}</p>
                <p className="text-primary-foreground/60">{t('Closed', 'ዝግ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`text-sm text-primary-foreground/60 ${language === 'am' ? 'font-ethiopic' : ''}`}>
              © {new Date().getFullYear()} {t('Federal Court - Finote Selam Branch. All rights reserved.', 'ፌዴራል ፍርድ ቤት - ፍኖተ ሰላም ቅርንጫፍ። መብቱ በህግ የተጠበቀ ነው።')}
            </p>
            <Link
              to="/admin"
              className="text-xs text-primary-foreground/40 hover:text-primary-foreground/60 transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
