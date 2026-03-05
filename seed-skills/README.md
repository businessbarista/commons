# Seed Skills

This directory contains the initial set of curated AI skills that ship with Commons at launch.

## Directory Structure

```
seed-skills/
├── marketing/       # Marketing & Growth skills
├── engineering/     # Engineering & Product skills
├── sales/           # Sales & GTM skills
└── README.md        # This file
```

## Frontmatter Format

Every `.md` file in a category subdirectory must include YAML frontmatter with the following fields:

```yaml
---
name: "Email Subject Line Generator"           # Required — display name
short_description: "Generate high-converting email subject lines from campaign context" # Required — max 500 chars
category: "marketing"                           # Required — must match parent directory (marketing | engineering | sales)
llm_tags: ["Claude", "GPT-4", "Gemini"]        # Required — which LLMs this skill works well with
author_name: "Alex Lieberman"                   # Required — who wrote or sourced this skill
author_url: "https://twitter.com/businessbarista" # Optional — author's public URL (dofollow link on site)
author_bio: "Co-founder of Morning Brew"        # Optional — short bio (max 500 chars)
example_output_model: "Claude 3.5 Sonnet"       # Required — which model generated the example output
is_expert: false                                # Optional — default false. True = Featured Expert badge
---
```

## File Content

Everything below the frontmatter closing `---` is treated as two sections:

1. **Skill Content** — The actual `.md` skill/prompt that users will copy. This is the main body.
2. **Example Output** — An `## Example Output` section at the end showing a real output from running the skill through an LLM. This section is extracted and displayed separately on the skill detail page.

### Example File

```markdown
---
name: "Cold Email Personalizer"
short_description: "Transform generic cold emails into personalized outreach using prospect research"
category: "sales"
llm_tags: ["Claude", "GPT-4"]
author_name: "Jane Smith"
example_output_model: "Claude 3.5 Sonnet"
---

# Cold Email Personalizer

You are an expert cold email writer...

[skill content here]

## Example Output

**Input:** [brief description of the input used]

**Output:**
[the actual output from running the skill]
```

## Adding New Skills

1. Create a new `.md` file in the appropriate category directory
2. Add required frontmatter fields
3. Write the skill content (the prompt/instructions)
4. Add an `## Example Output` section with a real output
5. Run `pnpm seed` to upsert into the database

## Slug Generation

Slugs are auto-generated from the file name:
- `email-subject-line-generator.md` → slug: `email-subject-line-generator`
- Slugs must be unique across all categories
- The seed script will warn on duplicate slugs

## Idempotency

The seed script uses **upsert on slug** — re-running `pnpm seed` will update existing skills without creating duplicates. This means you can edit a seed skill file and re-run the script to update it in the database.
