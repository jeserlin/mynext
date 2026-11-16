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
nvm install
nvm use
npm ci
```

## Adding A New Recipe

Recipes are managed in Notion through `/admin/new-recipe`. All 26 former Markdown recipes have been published in Notion and removed from `_posts/cooking` and `_posts/baking`; books and technical posts remain in the repo. Keep `public/assets/posts` because some Notion covers still refer to these images.

Set `ADMIN_SECRET`, `NOTION_TOKEN`, and `NOTION_DATABASE_ID` in `.env.local` for local editing, and in Vercel for production. GitHub Actions also needs repository secrets named `NOTION_TOKEN` and `NOTION_DATABASE_ID` for recipe browser tests and builds. Never commit actual values.

The Markdown scaffold remains available for an optional local draft; the primary publishing workflow is the admin page:

Create a new recipe draft with:

```bash
npm run new-recipe -- cooking "麻婆豆腐"
```

or

```bash
npm run new-recipe -- baking "Basque Cheesecake"
```

That command creates a ready-to-edit markdown file with the correct frontmatter and suggests the matching image path in `public/assets/posts/...`.

For the standard workflow, open `/admin/new-recipe`, save your admin secret, edit or create a recipe, upload images, and save to Notion with publishing enabled. The recipe finder at `/recipes` reads published Notion records.

## Adding Books from the Admin Page

`/admin/new-book` lets you enter a title and open a 博客來 search for it. Check the edition there, then paste its ISBN into the form and enter the author, cover URL, and notes manually. It saves new books to a separate Notion database. Existing `_posts/books` files remain visible; saving rejects an ISBN already present in either source.

The existing [books database](https://app.notion.com/p/406ea9196e4680aa9958e44b3b8a2457) is shared with the `mynext recipes` integration and has these properties:

| Property | Type |
| --- | --- |
| Name | Title |
| ISBN | Text |
| Author | Text |
| Cover Image | URL |
| Read Date | Date |
| Notes | Text |

Set `NOTION_BOOKS_DATABASE_ID` to that database's ID in local and Vercel environment variables. The admin page uses the same `ADMIN_SECRET` as the recipe editor and reads the saved secret from this browser. Do not put these values in committed files. After adding the database ID to Vercel, redeploy once; saving a book then revalidates `/books` automatically.

## Editing recipe quantities

Open `/admin/new-recipe`, save your admin secret, and select a recipe under **編輯現有食譜**. Existing recipes are loaded from Notion. Optional new Markdown drafts can also be imported at the same type/slug; the draft file is preserved and the published Notion version takes precedence.

Enable **啟用份量換算** to enter the original recipe quantity, ingredient groups, amounts, optional range upper bounds, units, and notes. Amounts accept decimals or fractions such as `1/2`. For `適量`, leave the amount empty and enter it as a note. At least one ingredient must have an exact numeric amount. Ingredient search names are synchronized from these rows.

With scaling enabled, the Markdown `材料` section is replaced by the structured ingredient table; keep steps and other notes in the Markdown editor. Disabling scaling on a loaded recipe restores its original ingredient quantities as a static Markdown section. Scaling metadata is stored as YAML frontmatter in the existing Notion **Content Markdown** property, so no new database properties or environment variables are needed. Both cooking and baking detail pages support it.

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
