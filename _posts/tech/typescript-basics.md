---
title: 'Typescript - The basics'
desc: '學習typescript的筆記'
type: 'tech'
coverImage: '/assets/posts/tech/ts_logo.png'
date: '2023-04-02T00:00:00.000Z'
labels: [
    'javascript',
    'typescript',
]
---

### What can typescript helps?

- Static type-checking
  Check type error before running the code
  ```javascript
  const rabbit = 'yuan yuan';
  rabbit();
  // This expression is not callable.
  // Type 'String' has no call signatures.
  ```
- Non-exception Failures
  - Call an undefined property
  - typo
  - uncalled function
  - basic logic errors
  ```javascript
  const rabbit = {
    name: 'yuan yuan',
    age: () => 10
  }
  rabbit.habit;
  // Property 'habit' does not exist on type '{ name: string; ';}.

  rabbit.nama;
  // Property 'nama' does not exist on type '{ name: string; ';}.

  rabbit.age < 10;
  // Operator '<' cannot be applied to types '() => number' and 'number'.

  const rabbitName = rabbit.name === 'yuan yuan' ? 'yuan yuan' : 'nii'
  if (rabbitName !== 'yuan yuan') {
    // ...
  } else if (rabbitName === 'nii') {
    // This comparison appears to be unintentional because the types '"yuan yuan"' and '"nii"' have no overlap.
  }
  ```
- Types for Tooling
  - suggest which properties you might want to use
  - deliver “quick fixes” to automatically fix errors
  - jump to definitions of a variable
  - find all references to a given variable

### How to use
- Install
  ```shell
  npm install -g typescript
  ```
- Create a file `hello.ts` and run `tsc hello.ts` you will find out there is a new file created - `hello.js` this is a plain javascript file complies / transforms by `tsc`.
  ```javascript
  console.log('test')
  ```
  <img src='/assets/posts/tech/typescript_basics/typescript_basics_1.png'/>
- Try to create some errors and you can see the error in command line
  ```javascript
  function rabbit(name, age) {
    console.log(`${name} is ${age} age old!`);
  }
  
  rabbit("yuan yuan");
  ```
  <img src='/assets/posts/tech/typescript_basics/typescript_basics_2.png'/>

### Explicit Types
- Add type annotation on the properties
  ```javascript
  function rabbit(name: string, age: number) {
    console.log(`${name} is ${age} years old!`);
  }
  ```

  Before we add annotation, we can not tell what type of value we should pass in.
  <img src='/assets/posts/tech/typescript_basics/typescript_basics_3.png'/>

  After having type annotation, when we hover on the function we can see the type of properties.
  <img src='/assets/posts/tech/typescript_basics/typescript_basics_4.png'/>

  And this is what we have after compiled
  <img src='/assets/posts/tech/typescript_basics/typescript_basics_5.png'/>

### Others
- Downleveling - rewrite code from newer versions of ECMAScript to older ones
- Strictness - there are different level of strictness can be set up in `tsconfig.json`
  - `noImplicitAny` - will issue an error on any variables whose type is implicitly inferred as `any`
  - `strictNullChecks` - makes handling `null` and `undefined` more explicit