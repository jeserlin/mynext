[![Quality Checks](https://github.com/jeserlin/mynext/actions/workflows/lint.yml/badge.svg)](https://github.com/jeserlin/mynext/actions/workflows/lint.yml)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project requires Node.js 24. With `nvm`, install and select it before running the project:

```bash
nvm install 24
nvm use 24
```

## Adding A New Recipe

This project stores recipes as markdown files in `_posts/cooking` and `_posts/baking`.

Create a new recipe draft with:

```bash
npm run new-recipe -- cooking "麻婆豆腐"
```

or

```bash
npm run new-recipe -- baking "Basque Cheesecake"
```

That command creates a ready-to-edit markdown file with the correct frontmatter and suggests the matching image path in `public/assets/posts/...`.

Recommended workflow:

1. Run the scaffold command.
2. Add your cover image to `public/assets/posts/cooking/` or `public/assets/posts/baking/`.
3. Fill in the generated markdown file's `ingredient`, `labels`, and steps.
4. Run `npm run dev` and open `http://localhost:3000/cooking` or `http://localhost:3000/baking` to check the result.

## Adding Books from the Admin Page

`/admin/new-book` looks up a pasted ISBN with Open Library, then lets you edit the title and author and paste a cover URL and notes. If `GOOGLE_BOOKS_API_KEY` is configured, it tries Google Books first and falls back to Open Library. It saves new books to a separate Notion database. Existing `_posts/books` files remain visible; saving rejects an ISBN already present in either source.

The existing [books database](https://app.notion.com/p/406ea9196e4680aa9958e44b3b8a2457) is shared with the `mynext recipes` integration and has these properties:

| Property | Type |
| --- | --- |
| Name | Title |
| ISBN | Text |
| Author | Text |
| Cover Image | URL |
| Read Date | Date |
| Notes | Text |

Set `NOTION_BOOKS_DATABASE_ID` to that database's ID in local and Vercel environment variables. The admin page uses the same `ADMIN_SECRET` as the recipe editor and reads the saved secret from this browser. Optionally set `GOOGLE_BOOKS_API_KEY` for additional ISBN coverage. Do not put these values in committed files. After adding the database ID to Vercel, redeploy once; saving a book then revalidates `/books` automatically.

## Validating Markdown Content

Before publishing content changes, run:

```bash
npm run validate:content
```

This checks required frontmatter, dates, recipe fields, image paths, duplicate slugs, and Markdown parsing across `_posts`. GitHub Actions runs the same check for every pull request and push to `main`.

You can start editing the home page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
