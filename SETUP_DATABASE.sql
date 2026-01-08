-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Types (Handle existing types gracefully)
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Create Tables
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.court_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value_en TEXT NOT NULL,
    value_am TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.news_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_am TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_am TEXT NOT NULL,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    published_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.court_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- 5. Helper Functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 6. Policies (Drop existing first to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can read court info" ON public.court_info;
DROP POLICY IF EXISTS "Admins can update court info" ON public.court_info;

CREATE POLICY "Anyone can read court info" ON public.court_info FOR SELECT USING (true);
CREATE POLICY "Admins can update court info" ON public.court_info FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can read published announcements" ON public.news_announcements;
DROP POLICY IF EXISTS "Admins can read all announcements" ON public.news_announcements;
DROP POLICY IF EXISTS "Admins can insert announcements" ON public.news_announcements;
DROP POLICY IF EXISTS "Admins can update announcements" ON public.news_announcements;
DROP POLICY IF EXISTS "Admins can delete announcements" ON public.news_announcements;

CREATE POLICY "Anyone can read published announcements" ON public.news_announcements FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can read all announcements" ON public.news_announcements FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert announcements" ON public.news_announcements FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update announcements" ON public.news_announcements FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete announcements" ON public.news_announcements FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can read contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;

CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read contact submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete contact submissions" ON public.contact_submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 7. Triggers
DROP TRIGGER IF EXISTS update_court_info_updated_at ON public.court_info;
CREATE TRIGGER update_court_info_updated_at BEFORE UPDATE ON public.court_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_announcements_updated_at ON public.news_announcements;
CREATE TRIGGER update_news_announcements_updated_at BEFORE UPDATE ON public.news_announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Seed Data (Optional)
INSERT INTO public.court_info (key, value_en, value_am) VALUES
('address', 'Finote Selam, Amhara Region, Ethiopia', 'ፍኖተ ሰላም፣ አማራ ክልል፣ ኢትዮጵያ'),
('phone', '+251 58 123 4567', '+251 58 123 4567'),
('email', 'info@finoteselamcourt.gov.et', 'info@finoteselamcourt.gov.et'),
('office_hours', 'Monday - Friday: 8:30 AM - 5:30 PM', 'ሰኞ - ዓርብ: 8:30 ጥዋት - 5:30 ከሰዓት'),
('latitude', '10.7000', '10.7000'),
('longitude', '37.2667', '37.2667')
ON CONFLICT (key) DO NOTHING;

-- 9. CRITICAL: Grant Admin Access to 'somsonengda@gmail.com'
-- This will only work if the user signed up successfully.
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'somsonengda@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
