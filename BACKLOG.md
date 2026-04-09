# Pupperta Backlog

## Objective

Complete the current Hugo implementation by adding a GitHub-backed CMS authoring flow and GitHub Actions-based deployment so content changes can be published when an editor creates, updates, or removes an article or dog profile.

## Recommended Target Architecture

1. Hugo remains the static site generator
2. A CMS admin interface is added under `static/admin/`
3. GitHub is used as the source of truth for content
4. Editors authenticate with GitHub and manage content from the CMS
5. GitHub Actions validates, previews, and deploys changes
6. A static hosting platform serves the built site

## Suggested Backlog

### P0 - Required Before Stakeholder Rollout

#### 1. Select The CMS And Editorial Model

Suggested implementation:

- Use Decap CMS with a GitHub backend
- Configure `dogs`, `journal`, `presentacion`, and `collabs` as editable collections
- Prefer pull request-based editorial workflow instead of direct writes to production

Done when:

- Non-technical users can create, edit, and delete content from a browser
- Content changes are stored as Hugo-compatible Markdown files

#### 2. Define GitHub Ownership And Authentication

Suggested implementation:

- Create a dedicated GitHub service account such as `pupperta-cms`, or use a GitHub App
- Avoid using a shared personal account for daily editing
- Keep editors on individual GitHub accounts for auditability
- Store OAuth and deployment secrets in GitHub or the hosting platform

Done when:

- Repo ownership, CMS authentication ownership, and deployment secret ownership are clearly documented

#### 3. Add The CMS Admin Area

Suggested implementation:

- Add `static/admin/index.html`
- Add `static/admin/config.yml`
- Map CMS fields to the existing front matter keys already used by the theme
- Add required fields and controlled value lists for `status`, `size`, `gender`, and boolean care fields

Done when:

- A stakeholder can log in, edit a dog or journal entry, and save a valid content update without touching Git locally

#### 4. Add GitHub Actions Validation

Suggested implementation:

- Create `.github/workflows/validate.yml`
- Run on pull requests and pushes
- Install Hugo in CI
- Execute `hugo --gc --minify`
- Fail fast if content or templates break the build

Done when:

- Every CMS-authored change is automatically validated before production deployment

#### 5. Add Production Deployment Automation

Suggested implementation:

- Create `.github/workflows/deploy.yml`
- Trigger on pushes to the production branch
- Scope the workflow to `content/**`, `static/admin/**`, `static/**`, `themes/**`, and `hugo.toml`
- Build the site with Hugo and deploy to GitHub Pages, Netlify, Vercel, or the selected host

Done when:

- Creating, updating, or deleting content results in an automatic production deployment after merge

#### 6. Add A Preview Workflow For Editorial Review

Suggested implementation:

- Create `.github/workflows/preview.yml`
- Trigger on pull requests opened by the CMS workflow
- Publish a preview artifact or preview environment for review

Done when:

- Stakeholders can review content safely before it reaches production

### P1 - High-Value Product And Technical Follow-Up

#### 7. Normalize The Content Contract

Suggested implementation:

- Decide whether journal entries should use `story`, Markdown body content, or both
- Update the journal templates and CMS schema to follow one consistent rule
- Decide whether the dogs listing should show only available dogs or all dogs with status badges
- Align archetypes, templates, and CMS fields with the same data model

Done when:

- Editors have one clear content structure and templates render it consistently

#### 8. Define The Media Strategy

Suggested implementation:

- Replace placeholder `picsum.photos` URLs with managed assets
- Use `static/uploads/` or Hugo page bundles for images
- Configure CMS media upload and public paths

Done when:

- Editors can upload and reuse images from the CMS without manually pasting remote URLs

#### 9. Clean Up The Repository Structure

Suggested implementation:

- Stop committing generated `public/` output if deployment is handled by CI
- Add a `.gitignore`
- Archive or remove legacy prototype files in `vanilla/`
- Remove unused root-level assets if `static/` is the real source of truth

Done when:

- The repository contains only source files needed for development, review, and deployment

#### 10. Finish Incomplete Frontend Flows

Suggested implementation:

- Make the home page filters functional or remove them
- Populate the home page dog modal with real data or link directly to dog detail pages
- Connect adoption/contact calls to action to a real form backend or CRM
- Implement real search or remove the mocked search UI

Done when:

- The visible site controls behave as expected and no major placeholder flow remains in production

#### 11. Set Production Configuration

Suggested implementation:

- Replace the placeholder `baseURL`
- Confirm the production domain
- Add final metadata, redirects, and analytics requirements

Done when:

- The production site builds with the correct URLs and environment-specific settings

### P2 - Operational Hardening

#### 12. Add QA And Accessibility Checks

Suggested implementation:

- Add smoke tests or link checks in CI
- Review keyboard support, alt text coverage, and contrast
- Add a simple content checklist for editors

Done when:

- Build quality and accessibility issues are caught before publishing

#### 13. Add Operating Documentation

Suggested implementation:

- Document who approves content changes
- Document rollback steps for failed releases
- Add a short editor guide once the CMS is live

Done when:

- The site can be operated without relying on tribal knowledge

## Open Decisions

- Hosting target: GitHub Pages, Netlify, Vercel, or another static host
- Editorial mode: direct publish or pull request review
- Media strategy: repo-tracked uploads or external asset storage
- GitHub integration model: service account or GitHub App
