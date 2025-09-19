# Pupperta - Dog Rescue Hugo CMS

This project has been converted to use Hugo CMS for managing journal entries and rescued dogs content.

## Project Structure

```
pupperta/
├── archetypes/           # Content templates
│   ├── journal.md       # Template for journal entries
│   └── dogs.md          # Template for rescued dogs
├── content/             # Content files
│   ├── journal/         # Journal entries (stories)
│   ├── dogs/           # Rescued dogs profiles
│   ├── presentacion.md # About page
│   └── collabs.md      # Collaborations page
├── themes/             # Hugo theme
│   └── pupperta-theme/ # Custom theme files
├── static/             # Static assets
│   ├── style.css      # Custom styles
│   └── script.js      # JavaScript functionality
└── hugo.toml          # Hugo configuration
```

## Content Types

### Journal Entries
Fields available for journal entries:
- **Title**: Story title
- **Author**: Author name
- **Story**: Main story content
- **Featured Image**: Story image URL
- **Reading Time**: Estimated reading time in minutes
- **Tags**: Story tags
- **Categories**: Story categories

### Rescued Dogs
Fields available for rescued dogs:
- **Temporal Name**: Current name of the dog
- **Description**: Dog description
- **Picture**: Dog photo URL
- **Age**: Dog's age
- **Weight**: Dog's weight
- **Size**: Dog's size (Small, Medium, Large)
- **Reactive**: Whether the dog is reactive (true/false)
- **Status**: Available, Adopted, or Pending
- **Breed**: Dog's breed
- **Gender**: Male or Female
- **Vaccinated**: Vaccination status
- **Spayed/Neutered**: Spay/neuter status
- **Special Needs**: Any special care requirements
- **Tags**: Dog characteristics
- **Categories**: Dog categories

## How to Use

### 1. Start Hugo Development Server
```bash
hugo server --buildDrafts
```

### 2. Create New Journal Entry
```bash
hugo new journal/my-new-story.md
```

### 3. Create New Dog Profile
```bash
hugo new dogs/dog-name.md
```

### 4. Build Static Site
```bash
hugo --minify
```

## Content Management

### Adding Journal Entries
1. Use the command: `hugo new journal/story-name.md`
2. Edit the generated file in `content/journal/`
3. Fill in the front matter fields
4. Write your story content below the front matter

### Adding Rescued Dogs
1. Use the command: `hugo new dogs/dog-name.md`
2. Edit the generated file in `content/dogs/`
3. Fill in all the dog information fields
4. Add any additional content below the front matter

### Publishing Content
- Set `draft: false` in the front matter to publish
- Keep `draft: true` to keep content as draft

## Features

- **Responsive Design**: Works on all devices
- **Search Functionality**: Built-in search (currently mocked)
- **Filtering**: Filter dogs by size, age, etc.
- **Modal Views**: Detailed views for dogs and stories
- **SEO Optimized**: Proper meta tags and structure
- **Fast Loading**: Static site generation for speed

## Customization

### Styling
- Edit `static/style.css` for custom styles
- The theme uses Tailwind CSS for utility classes

### Templates
- Modify files in `themes/pupperta-theme/layouts/` to change page layouts
- Update partials in `themes/pupperta-theme/layouts/partials/` for reusable components

### Configuration
- Edit `hugo.toml` to change site settings, menus, and parameters

## Deployment

The site can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any web server

Simply run `hugo --minify` and upload the `public/` directory contents.
