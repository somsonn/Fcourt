import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().optional(),
  subject: z.string().trim().min(1, 'Subject is required').max(200),
  message: z.string().trim().min(1, 'Message is required').max(2000),
});

const Contact = () => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('contact_submissions').insert([{
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || null,
      subject: result.data.subject,
      message: result.data.message,
    }]);
    
    if (error) {
      toast.error(t('Failed to send message. Please try again.', 'መልእክት መላክ አልተሳካም። እባክዎ እንደገና ይሞክሩ።'));
    } else {
      toast.success(t('Message sent successfully!', 'መልእክት በተሳካ ሁኔታ ተልኳል!'));
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="hero-section py-20">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4 ${language === 'am' ? 'font-ethiopic' : ''}`}
          >
            {t('Contact Us', 'አግኙን')}
          </motion.h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`font-serif text-2xl font-semibold mb-6 ${language === 'am' ? 'font-ethiopic' : ''}`}>
                {t('Send us a message', 'መልእክት ይላኩልን')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder={t('Your Name', 'ስምዎ')}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className={language === 'am' ? 'font-ethiopic' : ''}
                />
                <Input
                  type="email"
                  placeholder={t('Email Address', 'ኢሜይል አድራሻ')}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className={language === 'am' ? 'font-ethiopic' : ''}
                />
                <Input
                  placeholder={t('Phone (optional)', 'ስልክ (አማራጭ)')}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={language === 'am' ? 'font-ethiopic' : ''}
                />
                <Input
                  placeholder={t('Subject', 'ርዕሰ ጉዳይ')}
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  className={language === 'am' ? 'font-ethiopic' : ''}
                />
                <Textarea
                  placeholder={t('Your Message', 'መልእክትዎ')}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className={language === 'am' ? 'font-ethiopic' : ''}
                />
                <Button type="submit" variant="navy" size="lg" disabled={loading} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? t('Sending...', 'በመላክ ላይ...') : t('Send Message', 'መልእክት ላክ')}
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className={`font-serif text-2xl font-semibold mb-6 ${language === 'am' ? 'font-ethiopic' : ''}`}>
                  {t('Contact Information', 'የመገናኛ መረጃ')}
                </h2>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, label: t('Finote Selam, Amhara Region, Ethiopia', 'ፍኖተ ሰላም፣ አማራ ክልል፣ ኢትዮጵያ') },
                    { icon: Phone, label: '+251 58 123 4567' },
                    { icon: Mail, label: 'info@finoteselamcourt.gov.et' },
                    { icon: Clock, label: t('Monday - Friday: 8:30 AM - 5:30 PM', 'ሰኞ - ዓርብ: 8:30 ጥዋት - 5:30 ከሰዓት') },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className={`text-muted-foreground mt-2 ${language === 'am' ? 'font-ethiopic' : ''}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Map placeholder */}
              <div className="bg-muted rounded-xl h-64 flex items-center justify-center">
                <p className={`text-muted-foreground ${language === 'am' ? 'font-ethiopic' : ''}`}>
                  {t('Map: Finote Selam Court Location', 'ካርታ: የፍኖተ ሰላም ፍርድ ቤት አካባቢ')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
