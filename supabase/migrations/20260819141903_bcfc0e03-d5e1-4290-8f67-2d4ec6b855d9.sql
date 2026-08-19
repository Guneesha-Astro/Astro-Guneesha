-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  birth_date DATE,
  birth_time TIME,
  birth_place TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- charts
CREATE TABLE public.charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  birth_date DATE,
  birth_time TIME,
  birth_place TEXT,
  ascendant TEXT,
  moon_sign TEXT,
  sun_sign TEXT,
  nakshatra TEXT,
  planetary_positions JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.charts TO authenticated;
GRANT ALL ON public.charts TO service_role;
ALTER TABLE public.charts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "charts_own" ON public.charts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  consultation_type TEXT NOT NULL,
  slot_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'pending',
  meeting_link TEXT,
  notes TEXT,
  amount_inr INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings_own" ON public.bookings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price_inr INT NOT NULL DEFAULT 0,
  image_url TEXT,
  external_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON public.products FOR SELECT TO anon, authenticated USING (is_active);

-- orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'created',
  shipping_status TEXT NOT NULL DEFAULT 'processing',
  tracking_number TEXT,
  total_inr INT NOT NULL DEFAULT 0,
  shipping_name TEXT,
  shipping_phone TEXT,
  shipping_address TEXT,
  payment_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_own" ON public.orders FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price_inr INT NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_own" ON public.order_items FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- articles
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,
  cover_url TEXT,
  tag TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.articles TO anon;
GRANT SELECT ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "articles_public_read" ON public.articles FOR SELECT TO anon, authenticated USING (published);

-- panchanga
CREATE TABLE public.panchanga (
  day DATE PRIMARY KEY,
  tithi TEXT,
  nakshatra TEXT,
  yoga TEXT,
  karana TEXT,
  sunrise TEXT,
  sunset TEXT,
  note TEXT
);
GRANT SELECT ON public.panchanga TO anon;
GRANT SELECT ON public.panchanga TO authenticated;
GRANT ALL ON public.panchanga TO service_role;
ALTER TABLE public.panchanga ENABLE ROW LEVEL SECURITY;
CREATE POLICY "panchanga_public_read" ON public.panchanga FOR SELECT TO anon, authenticated USING (true);

-- profile auto-create
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- seed data
INSERT INTO public.products (slug, name, category, description, price_inr, external_url) VALUES
('natural-ruby-manik','Natural Ruby (Manik)','gemstone','Certified unheated ruby for a strengthened Sun. Energised before dispatch.',18500,'https://topmate.io/guneesha_kaushik/'),
('blue-sapphire-neelam','Blue Sapphire (Neelam)','gemstone','Ceylon neelam for Saturn, recommended only after chart analysis.',32000,'https://topmate.io/guneesha_kaushik/'),
('emerald-panna','Emerald (Panna)','gemstone','Colombian panna to support Mercury, clarity and communication.',21000,'https://topmate.io/guneesha_kaushik/'),
('five-mukhi-rudraksha','5 Mukhi Rudraksha Mala','rudraksha','108 bead Nepali rudraksha mala, hand knotted in pure silk thread.',3200,'https://topmate.io/guneesha_kaushik/'),
('gauri-shankar-rudraksha','Gauri Shankar Rudraksha','rudraksha','For harmony in relationships and marital balance.',5600,'https://topmate.io/guneesha_kaushik/'),
('shri-yantra-copper','Shri Yantra (Copper)','yantra','Hand engraved copper Shri Yantra, energised with 108 chants.',4500,'https://topmate.io/guneesha_kaushik/'),
('kuber-yantra','Kuber Yantra','yantra','Traditional Kuber yantra for wealth flow and stability.',2900,'https://topmate.io/guneesha_kaushik/'),
('ebook-nakshatra-guide','The Nakshatra Handbook','ebook','A 120 page guide decoding all 27 nakshatras, padas and their life themes.',699,'https://topmate.io/guneesha_kaushik/'),
('ebook-saturn-transit','Saturn: The Slow Teacher','ebook','Understanding Sade Sati, Dhaiya and how to work with Saturn.',549,'https://topmate.io/guneesha_kaushik/'),
('ebook-remedies','Everyday Vedic Remedies','ebook','Simple, safe remedies you can practise at home without any props.',399,'https://topmate.io/guneesha_kaushik/'),
('course-kundali-basics','Kundali Reading: Foundations','course','6 week live course covering houses, signs, planets and chart synthesis.',7999,'https://topmate.io/guneesha_kaushik/'),
('course-transits','Transits & Timing Mastery','course','4 week intensive on gochar, dashas and predicting timelines.',9999,'https://topmate.io/guneesha_kaushik/'),
('course-tarot-basics','Intuitive Tarot for Beginners','course','Self paced course on reading tarot with a Vedic sensibility.',4999,'https://topmate.io/guneesha_kaushik/'),
('treasure-parad-shivling','Parad Shivling','sacred_treasure','Solidified mercury shivling for daily abhishek and peace at home.',11500,'https://topmate.io/guneesha_kaushik/'),
('treasure-sphatik-mala','Sphatik Crystal Mala','sacred_treasure','Natural quartz mala for cooling energy and calm japa practice.',2400,'https://topmate.io/guneesha_kaushik/'),
('treasure-tulsi-mala','Vrindavan Tulsi Mala','sacred_treasure','Hand carved tulsi beads sourced from Vrindavan.',1200,'https://topmate.io/guneesha_kaushik/'),
('puja-navagraha-shanti','Navagraha Shanti Puja','puja','Nine planet peace ritual performed on your behalf with sankalp in your name.',8500,'https://topmate.io/guneesha_kaushik/'),
('puja-mahamrityunjaya','Mahamrityunjaya Jaap','puja','1.25 lakh jaap for health, protection and longevity.',15000,'https://topmate.io/guneesha_kaushik/'),
('puja-lakshmi-kuber','Lakshmi Kuber Puja','puja','Prosperity ritual performed on an auspicious muhurat.',6500,'https://topmate.io/guneesha_kaushik/'),
('consult-30-min','30 Minute Consultation','consultation','A focused call on one or two pressing questions.',2100,'https://topmate.io/guneesha_kaushik/'),
('consult-kundali-full','Full Kundali Reading','consultation','90 minute deep dive across career, relationships, health and dashas.',5100,'https://topmate.io/guneesha_kaushik/'),
('consult-transit','Transit & Year Ahead Analysis','consultation','60 minute session mapping the next 12 months of transits.',3600,'https://topmate.io/guneesha_kaushik/');

INSERT INTO public.articles (slug, title, excerpt, body, tag) VALUES
('jupiter-in-gemini','Jupiter in Gemini: A Year of Many Doors','Guru changes signs and scatters opportunity across communication, learning and short journeys.','Jupiter''s movement into Gemini shifts the growth axis toward curiosity. Where Jupiter sits in your chart marks the house that suddenly becomes noisy with options. The work of this year is not collecting more doors, it is choosing one and walking through it.','Transit'),
('understanding-sade-sati','Understanding Sade Sati Without Fear','Saturn''s seven and a half year passage is a rebuilding, not a punishment.','Sade Sati begins when Saturn enters the sign before your Moon. What it removes is usually what was never structurally sound. Track the three phases, keep your commitments small and consistent, and Saturn becomes a patient teacher instead of an adversary.','Saturn'),
('mercury-retrograde-truth','What Mercury Retrograde Actually Means','Less doom, more revision. A practical reading of the most misunderstood transit.','Retrograde Mercury asks for the re-words: review, revise, reconnect, repair. It is a poor time to sign and a wonderful time to rethink. Check which house holds the retrograde in your own chart before assuming chaos.','Transit'),
('choosing-a-gemstone','Choosing a Gemstone the Right Way','Never wear a stone because it looked beautiful in a shop window.','A gemstone amplifies a planet. Amplifying a malefic planet without analysis can intensify exactly what you were trying to soften. Always begin with the chart, the dasha and the lagna lord before choosing any stone.','Remedies');

INSERT INTO public.panchanga (day, tithi, nakshatra, yoga, karana, sunrise, sunset, note)
VALUES (CURRENT_DATE, 'Shukla Panchami', 'Rohini', 'Siddhi', 'Bava', '06:12', '18:44', 'A steady day for beginnings and devotional practice.')
ON CONFLICT (day) DO NOTHING;