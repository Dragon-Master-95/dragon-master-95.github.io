# Blog images

Convention: each post gets its own folder here, named after the post's slug (the
part of the filename after the date in `_posts/YYYY-MM-DD-slug.md`):

```
assets/images/blog/<post-slug>/
```

Reference images from the post body like this (works regardless of hosting path):

```
![Alt text]({{ '/assets/images/blog/<post-slug>/filename.jpg' | relative_url }})

*Figure N. Caption text.*
```

The blank line + italic line right after an image is styled automatically as a
caption — no extra markup needed.

A post's `featured_image` front-matter field (used only for social-preview `og:image`
tags, not rendered on the page) can point at any image in the post's folder, including
one also used inline as a figure — it will not be shown twice.

Missing image files do **not** break the Jekyll build — they just render as a broken
image in the browser until the file is added, so it's safe to write and publish a post
before its images are ready.
