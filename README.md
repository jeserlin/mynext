[![Lint & Test](https://github.com/jeserlin/mynext/actions/workflows/lint_test.yml/badge.svg)](https://github.com/jeserlin/mynext/actions/workflows/lint_test.yml)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

If `node` or `npm` is missing in your shell, load the repo's expected Node version first:

```bash
export PATH="$HOME/.nvm/versions/node/v22.14.0/bin:$PATH"
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

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
test
