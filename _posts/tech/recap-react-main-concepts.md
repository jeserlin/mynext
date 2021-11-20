---
title: 'Recap React - Main concepts'
desc: '紀錄重讀React main concepts的筆記。'
type: 'tech'
coverImage: '/assets/posts/tech/recap_react_main_concepts.png'
date: '2021-11-17T00:00:00.000Z'
labels: [
    'react',
    'main concepts',
]
---

### Why JSX

- the logic of rendering is coupled with UI logic
- include markup & logic & create components in a `component`
- able to prevent injection attacks


### Rendering Elements

- instead of creating DOM element --> plain object (cheap to create)
- react elements are `immutable`


### Components and Props
- two ways to define a component: ` function` / `class components`
- props are `read-only`
- extract component when it is used several times / complex enough
- all react component must act like `pure functions` with respect to their props


### State and lifecycle

- do not modify state directly (will not trigger re-render)
- state updates may be `asynchronous`
- state updates are merged


### Handling events

- naming: camelCase
- can not `return false` to prevent default behavior, need to call `preventDefault`


### Conditional Rendering

- return `null` from component will not trigger lifecycle, but will call `componentDidUpdate`


### Lists and key

- keys help React `identify` which items have changed, are added, or are removed
- don't use indexes for keys if the order of items may change (impact performance)
- if keys are not assigned, react will use indexes by default
- keys must only be unique among siblings (global unique not needed)
- keys don't get passed to components


### Forms

- controlled component (an input form element whose values is controlled by react)
- file input tag is an `uncontrolled` component in react
- recommended form lib: https://formik.org/


### Lifting state up

- data that changes in react app should be a `single “source of truth”`
- top-down data flow


### Thinking in react

- single responsibility principle (a component should ideally only do one thing)
- DRY: don't repeat yourself
