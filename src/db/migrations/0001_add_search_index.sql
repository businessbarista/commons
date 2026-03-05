-- Add tsvector column for full-text search
ALTER TABLE "skills" ADD COLUMN "search_vector" tsvector;

-- Populate existing rows
UPDATE "skills" SET "search_vector" =
  setweight(to_tsvector('english', coalesce("name", '')), 'A') ||
  setweight(to_tsvector('english', coalesce("short_description", '')), 'B') ||
  setweight(to_tsvector('english', coalesce("content_md", '')), 'C');

-- Create GIN index for fast full-text search
CREATE INDEX "skills_search_idx" ON "skills" USING gin ("search_vector");

-- Create trigger function to auto-update search_vector on insert/update
CREATE OR REPLACE FUNCTION skills_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.short_description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.content_md, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger
CREATE TRIGGER skills_search_trigger
  BEFORE INSERT OR UPDATE OF name, short_description, content_md
  ON "skills"
  FOR EACH ROW
  EXECUTE FUNCTION skills_search_update();
