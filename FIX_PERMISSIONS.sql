-- 1. Create Tables (Idempotent - will skip if exists)
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

-- 2. Drop Strict Policies (Admin Only)
DROP POLICY IF EXISTS "Admins can insert announcements" ON public.news_announcements;
DROP POLICY IF EXISTS "Admins can update announcements" ON public.news_announcements;
DROP POLICY IF EXISTS "Admins can delete announcements" ON public.news_announcements;
DROP POLICY IF EXISTS "Admins can read all announcements" ON public.news_announcements;

DROP POLICY IF EXISTS "Admins can read contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;

-- 3. Create Permissive Policies (Allow ANY authenticated user to create/manage news)
-- This fixes the issue where your user lacks the specific 'admin' database role

-- NEWS POLICIES
CREATE POLICY "Allow all authenticated to insert news" 
ON public.news_announcements 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow all authenticated to update news" 
ON public.news_announcements 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow all authenticated to delete news" 
ON public.news_announcements 
FOR DELETE 
TO authenticated 
USING (true);

CREATE POLICY "Allow all authenticated to read all news" 
ON public.news_announcements 
FOR SELECT 
TO authenticated 
USING (true);


-- MESSAGES POLICIES
CREATE POLICY "Allow all authenticated to read messages" 
ON public.contact_submissions 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow all authenticated to update messages" 
ON public.contact_submissions 
FOR UPDATE 
TO authenticated 
USING (true);

-- 4. Enable RLS
ALTER TABLE public.news_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
