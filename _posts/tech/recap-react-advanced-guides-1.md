---
title: 'Recap React - Accessibility / Code splitting'
desc: '重讀React advanced guides的筆記'
type: 'tech'
coverImage: '/assets/posts/tech/recap_react_advanced_guides.png'
date: '2021-11-20T00:00:00.000Z'
labels: [
    'react',
    'advanced guides',
    'accessibility',
    'code-splitting',
]
---

### Accessibility

- web accessibility (a11y)
- all `aria-*` HTML attributes are fully supported in JSX (hyphen-cased)
- every HTML form control needs to be labeled accessibly
	```javascript
	<label htmlFor="namedInput">Name:</label>
	<input id="namedInput" type="text" name="name"/>
	```
- able to be `fully operated` with keyboard
- cases depending on `only pointer and mouse events` will break functionality for keyboard users
- setting the language
- setting the document title (describe the current page content)
- color contrast
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)

***

### Code-splitting

- bundling - the process of `following imported files` and `merging` them into `a single file`
- create react app / Next.js / Gatsby uses `Webpack`
- create multiple bundles that can be `dynamically loaded at runtime` (improve performance)
- lazy-load only the things needed to improve performance

#### Dynamic import()
- when Webpack comes across dynamic import, it automatically starts `code-splitting` th app
```javascript
import("./math").then(math => {
  console.log(math.add(16,26));
})
```

#### React.lazy
- render a dynamic import as a regular component
- takes a function that must call a dynamic `import()` and return a `Promise` which resolves to a module with a `default` export containing a React component
- a lazy component should render inside a `Suspense` component (with fallback content, ex: loading)
- wrap the lazy component with an error boundary to show a error message when modules fails to load

```jsx
import React, { Suspense } from 'react';
import MyErrorBoundary from './MyErrorBoundary';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```