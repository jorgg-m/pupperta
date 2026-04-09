# Pupperta

Pupperta is a Hugo-based website for a dog rescue and adoption project. The repository already contains a custom theme, Markdown content collections, and generated site pages. The GitHub-backed CMS authoring layer and the automated deployment workflow are still pending and are the main next step for completing the implementation.

## Current Status

- Hugo site configured in `hugo.toml`
- Custom theme in `themes/pupperta-theme`
- Content sections for rescued dogs, journal stories, and static informational pages
- Front matter-driven publishing using Hugo Markdown files
- No CMS admin panel in the repository yet
- No GitHub Actions workflow in the repository yet

## Repository Structure

```text
pupperta/
├── archetypes/                # Hugo content templates
├── content/
│   ├── dogs/                  # Dog profiles
│   ├── journal/               # Journal/story entries
│   ├── presentacion.md        # Presentation page
│   └── collabs.md             # Collaborations page
├── static/
│   ├── style.css              # Site styles served by Hugo
│   └── script.js              # Client-side interactions served by Hugo
├── themes/
│   └── pupperta-theme/
│       ├── layouts/           # Hugo templates
│       └── theme.toml
├── public/                    # Generated static output
├── vanilla/                   # Legacy prototype HTML files
├── hugo.toml                  # Hugo configuration
└── README.md
```

## Implemented Functionality

### Site Pages

- Home page built from Hugo templates and dog content
- Dogs listing page at `/dogs/`
- Dog detail page at `/dogs/<slug>/`
- Journal listing page at `/journal/`
- Journal detail page at `/journal/<slug>/`
- Static content pages for presentation and collaborations
- Hugo-generated taxonomy pages for tags and categories

### Content Model

- Dog profiles are created from `archetypes/dogs.md`
- Journal entries are created from `archetypes/journal.md`
- Publishing is controlled with `draft: true` or `draft: false`
- Most content is stored as Markdown with front matter
- Current image values are external URLs stored in front matter

### Frontend Behavior

- Responsive sidebar and header shell
- Sticky classification bar on the home page
- Scroll-to-top button
- Card-based layouts for dogs and journal entries
- Tailwind CSS loaded through CDN plus custom CSS from `static/style.css`

## Content Fields

### Dogs

| Field | Purpose |
| --- | --- |
| `title` | Hugo page title |
| `date` | Publication date |
| `draft` | Publish control |
| `temporal_name` | Display name of the dog |
| `description` | Short dog summary |
| `picture` | Main image URL |
| `age` | Dog age |
| `dog_weight` | Weight text |
| `size` | Size label |
| `reactive` | Behavior flag |
| `status` | `available`, `adopted`, or `pending` |
| `breed` | Breed text |
| `gender` | Gender label |
| `vaccinated` | Vaccination flag |
| `spayed_neutered` | Sterilization flag |
| `special_needs` | Care notes |
| `tags` | Taxonomy tags |
| `categories` | Taxonomy categories |

### Journal

| Field | Purpose |
| --- | --- |
| `title` | Story title |
| `date` | Publication date |
| `draft` | Publish control |
| `author` | Author name |
| `story` | Story summary or main text used by the current template |
| `featured_image` | Main image URL |
| `reading_time` | Estimated reading time |
| `tags` | Taxonomy tags |
| `categories` | Taxonomy categories |

### Static Pages

- `content/presentacion.md`
- `content/collabs.md`

These pages use the default Hugo single-page template and render their Markdown body content.

## Local Development

### Prerequisites

- Hugo installed locally

### Common Commands

```bash
hugo server -D
hugo new dogs/my-dog.md
hugo new journal/my-story.md
hugo --gc --minify
```

### Current Authoring Flow

Today, content is created and edited directly in Markdown files inside `content/`. There is not yet an admin interface for non-technical users.

## Current Gaps And Limitations

- There is no CMS or `/admin/` area yet
- There are no GitHub Actions workflows yet
- `baseURL` in `hugo.toml` is still a placeholder domain
- Home page tag buttons are visual only and do not filter content
- The home page dog modal opens, but its fields are not populated from Hugo data
- Search and upload controls in the header are placeholders
- Journal detail pages currently render `story` from front matter instead of the Markdown body
- Adoption/contact actions are UI-only and are not connected to a backend
- Placeholder images from `picsum.photos` are still used
- `public/` is committed as generated output
- `vanilla/` and some root-level HTML/JS/CSS files appear to be legacy prototype assets

## Recommended CMS And Deployment Direction

The most practical next step for this project is to keep Hugo as the site generator and add a GitHub-backed CMS for content authoring. A good fit for this repository is Decap CMS because it works well with Markdown, Hugo front matter, and GitHub-based editorial workflows.

### Recommended Authoring Flow

1. Add a CMS admin area under `static/admin/`
2. Configure collections for `dogs`, `journal`, `presentacion`, and `collabs`
3. Use GitHub authentication for editors
4. Prefer a dedicated GitHub service account or GitHub App to own the integration instead of sharing a personal account
5. Use pull request-based editorial workflow for review and traceability
6. Trigger GitHub Actions when content is created, updated, or deleted
7. Build the site with Hugo and deploy to the selected static hosting platform

### Recommended GitHub Actions Set

- `validate.yml`
  Runs Hugo build validation on push and pull request
- `preview.yml`
  Builds a preview for CMS pull requests
- `deploy.yml`
  Deploys production after approved content changes are merged

### Recommended Trigger Scope

Production deployment should run when the production branch changes in any of these areas:

- `content/**`
- `static/admin/**`
- `static/**`
- `themes/**`
- `hugo.toml`

That setup covers article creation, update, and removal, as well as CMS configuration changes.

## Deployment Notes

The site can be deployed to GitHub Pages, Netlify, Vercel, or another static host. The final implementation should decide:

- the production domain
- whether previews are required
- where secrets are stored
- whether `public/` stays versioned or is generated only in CI

## Next Step

See `BACKLOG.md` for the suggested implementation plan to finish the CMS authoring and deployment workflow.
