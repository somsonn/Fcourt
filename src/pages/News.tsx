import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface NewsItem {
  id: string;
  title_en: string;
  title_am: string;
  content_en: string;
  content_am: string;
  published_at: string | null;
  created_at: string;
}

const News = () => {
  const { t, language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news_announcements')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      
      if (!error && data) {
        setNews(data);
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  return (
    <Layout>
      <section className="hero-section py-20">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4 ${language === 'am' ? 'font-ethiopic' : ''}`}
          >
            {t('News & Announcements', 'ዜናዎች እና ማስታወቂያዎች')}
          </motion.h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-4xl">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
          ) : news.length === 0 ? (
            <div className={`text-center py-12 text-muted-foreground ${language === 'am' ? 'font-ethiopic' : ''}`}>
              {t('No announcements at this time.', 'በአሁኑ ጊዜ ምንም ማስታወቂያዎች የሉም።')}
            </div>
          ) : (
            <div className="space-y-8">
              {news.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 hover-card"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(item.published_at || item.created_at), 'MMMM d, yyyy')}
                  </div>
                  <h2 className={`font-serif text-2xl font-semibold mb-3 ${language === 'am' ? 'font-ethiopic' : ''}`}>
                    {language === 'en' ? item.title_en : item.title_am}
                  </h2>
                  <p className={`text-muted-foreground whitespace-pre-wrap ${language === 'am' ? 'font-ethiopic' : ''}`}>
                    {language === 'en' ? item.content_en : item.content_am}
                  </p>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default News;
