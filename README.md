# harshaavinashtanti.github.io

Personal & research portfolio site, built as a Jekyll site and served via GitHub Pages
(GitHub builds Jekyll sites automatically on push — no build step to run yourself).

## Updating content

All editable content lives in `_data/*.yml`. Edit the relevant file, commit, and push —
no HTML editing required for routine updates:

| File | Controls |
|---|---|
| `_data/hero.yml` | Hero eyebrow, name, tagline, description, CTA buttons, header stats |
| `_data/about.yml` | About-me paragraphs and the 4 side cards |
| `_data/skills.yml` | Technical skills grid |
| `_data/research.yml` | Research focus area cards |
| `_data/publications.yml` | Journal papers and conference papers |
| `_data/patents.yml` | Patents list |
| `_data/experience.yml` | Work experience and education timelines |
| `_data/blog.yml` | Blog/writing cards |
| `_data/contact.yml` | Contact tagline, emails, social links |
| `_data/nav.yml` | Top navigation links |

Each YAML file has comments where the format needs explanation (e.g. how to omit an
optional field like a publication link that doesn't exist yet).

To change layout, styling, or add a new section, edit the corresponding file in
`_includes/` (structure) or `assets/css/style.css` (styling). Site-wide chrome
(head, nav, footer, scripts) lives in `_layouts/default.html`.

## Local preview (optional)

Requires Ruby. Then:

```
bundle install
bundle exec jekyll serve
```

and open `http://localhost:4000`. If Ruby/Jekyll isn't installed locally, you can also
just push to a branch/PR — GitHub Pages will build it and report any errors.
