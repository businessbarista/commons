CREATE TYPE "public"."category" AS ENUM('marketing', 'engineering', 'sales');--> statement-breakpoint
CREATE TYPE "public"."skill_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."usage_event_type" AS ENUM('view', 'copy', 'download');--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_id" uuid NOT NULL,
	"star_rating" integer NOT NULL,
	"review_text" text NOT NULL,
	"reviewer_ip_hash" text NOT NULL,
	"session_id" text NOT NULL,
	"flagged" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"short_description" text NOT NULL,
	"content_md" text NOT NULL,
	"category" "category" NOT NULL,
	"llm_tags" text[] DEFAULT '{}' NOT NULL,
	"author_name" text NOT NULL,
	"author_url" text,
	"author_bio" text,
	"example_output_text" text,
	"example_output_image_url" text,
	"example_output_model" text NOT NULL,
	"is_expert" boolean DEFAULT false NOT NULL,
	"status" "skill_status" DEFAULT 'draft' NOT NULL,
	"reviewer_notes" text,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_name" text NOT NULL,
	"short_description" text NOT NULL,
	"category" "category" NOT NULL,
	"llm_tags" text[] DEFAULT '{}' NOT NULL,
	"content_md" text NOT NULL,
	"example_output_text" text,
	"example_output_image_url" text,
	"example_output_model" text NOT NULL,
	"contributor_name" text,
	"contributor_url" text,
	"contributor_bio" text,
	"contributor_email" text,
	"status" "submission_status" DEFAULT 'pending' NOT NULL,
	"reviewer_notes" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "usage_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_id" uuid NOT NULL,
	"event_type" "usage_event_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_events" ADD CONSTRAINT "usage_events_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reviews_skill_id_created_idx" ON "reviews" USING btree ("skill_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "skills_slug_idx" ON "skills" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "skills_category_status_idx" ON "skills" USING btree ("category","status");--> statement-breakpoint
CREATE INDEX "skills_status_published_idx" ON "skills" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "usage_events_skill_type_idx" ON "usage_events" USING btree ("skill_id","event_type");