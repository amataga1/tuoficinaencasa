-- ============================================================
-- SEO PLATFORM - Supabase Schema
-- Ejecuta este SQL en Supabase > SQL Editor
-- ============================================================

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Keywords
CREATE TABLE keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL UNIQUE,
  search_volume INTEGER,
  difficulty TEXT CHECK (difficulty IN ('low', 'medium', 'high')),
  cpc DECIMAL(10,2),
  intent TEXT CHECK (intent IN ('informational', 'commercial', 'transactional', 'navigational')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done', 'discarded')),
  cluster TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Articles
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'published', 'rejected')),
  schema_markup JSONB,
  faqs JSONB,
  reading_time INTEGER,
  word_count INTEGER,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Internal links tracking
CREATE TABLE internal_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  target_article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  anchor_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_article_id, target_article_id)
);

-- Indexes for performance
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_keywords_status ON keywords(status);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Default categories for home office niche
INSERT INTO categories (name, slug, description, meta_title, meta_description) VALUES
  ('Sillas de Oficina', 'sillas-de-oficina', 'Guías y comparativas de sillas ergonómicas para trabajar desde casa', 'Mejores Sillas de Oficina 2026 | Guía Completa', 'Encuentra la silla de oficina perfecta para tu home office. Comparativas, análisis y recomendaciones para todos los presupuestos.'),
  ('Escritorios', 'escritorios', 'Los mejores escritorios para tu oficina en casa', 'Mejores Escritorios para Casa 2026 | Comparativa', 'Guía completa para elegir el escritorio ideal para trabajar desde casa. Análisis de medidas, materiales y precios.'),
  ('Monitores', 'monitores', 'Monitores para trabajo en casa y productividad', 'Mejores Monitores para Trabajar desde Casa 2026', 'Los mejores monitores para home office según tu presupuesto y necesidades. Comparativas detalladas y análisis.'),
  ('Iluminación', 'iluminacion', 'Lámparas y soluciones de iluminación para oficina en casa', 'Iluminación para Oficina en Casa 2026', 'Mejora tu productividad con la iluminación adecuada. Guías de lámparas de escritorio, LED y luz natural.'),
  ('Productividad', 'productividad', 'Consejos y herramientas para ser más productivo trabajando desde casa', 'Productividad en el Home Office | Guías y Consejos', 'Tips, herramientas y estrategias para maximizar tu productividad trabajando desde casa.');
