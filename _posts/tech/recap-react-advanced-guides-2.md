---
title: 'Recap React - Context / Error Boundaries'
desc: '重讀React advanced guides的筆記'
type: 'tech'
coverImage: '/assets/posts/tech/recap_react_advanced_guides.png'
date: '2021-12-23T00:00:00.000Z'
labels: [
    'react',
    'advanced guides',
    'context',
    'error Boundaries'
]
---

### Context

- Context provides a way to `share values` like these `between components` without having to explicitly pass a prop through every level of the tree

#### When to Use Context

- share data that can be considered `“global” for a tree of React components`
- when some data needs to be accessible by many components at `different nesting levels`

#### API

React.createContext
```javascript
const MyContext = React.createContext(defaultValue);
```
- The `defaultValue` argument is `only` used when a component does not have a matching Provider above it in the tree

Context.Provider
```javascript
<MyContext.Provider value={/* some value */}>
```
- all consumers that are descendants of a Provider will `re-render` whenever the `Provider’s value prop` changes

Context.Consumer
```javascript
<MyContext.Consumer>
  {value => /* render something based on the context value */}
</MyContext.Consumer>
```

#### Caveats

- to `avoid re-render` on all consumers when Provider re-render, it would be better to `lift` the context value

```javascript
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {something: 'something'},
    };
  }

  render() {
    return (
      <MyContext.Provider value={this.state.value}>
        <Toolbar />
      </MyContext.Provider>
    );
  }
}
```

***

### Error Boundaries

- Catch JavaScript errors anywhere in their child component tree, log those errors, and `display a fallback UI`
- Error boundaries do not catch errors for:
  - Event handlers
  - Asynchronous code
  - Server side rendering
  - Errors thrown in the error boundary itself
- A class component becomes an error boundary if it defines either `static getDerivedStateFromError()` or `componentDidCatch()` to render fallback UI
  ```javascript
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      logErrorToMyService(error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong.</h1>;
      }

      return this.props.children; 
    }
  }

  // can be use like this
    <ErrorBoundary>
      <MyWidget />
    </ErrorBoundary>
  ```
- Error boundaries work like a JavaScript catch {} block, but `for components` (only class components can be error boundaries)

### Reference
- <a href='https://reactjs.org/docs/context.html' target="_blank">Context</a>
- <a href='https://reactjs.org/docs/error-boundaries.html' target="_blank">Error Boundaries</a>