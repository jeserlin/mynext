---
title: 'Typescript - More on Functions (2)'
desc: '學習typescript的筆記'
type: 'tech'
coverImage: '/assets/posts/tech/ts_logo.png'
date: '2023-11-05T00:00:00.000Z'
labels: [
    'typescript'
]
---

#### Function Overloads

In TypeScript, we can specify a function that can be called in different ways by writing overload signatures. To do this, write some number of function signatures (usually two or more), followed by the body of the function:
```javascript
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
```
- First two are called `overload signatures`, then third is called `implementation Signature`
- The signature of the implementation is not visible from the outside. When writing an overloaded function, you should always have two or more signatures above the implementation of the function.
- The implementation signature must also be compatible with the overload signatures.
- Always prefer parameters with union types instead of overloads when possible (ex: x: any[] | string)

Declare this in a Function
```javascript
const user = {
  id: 123,
 
  admin: false,
  becomeAdmin: function () {
    this.admin = true;
  },
};

interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}
 
const db = getDB();
const admins = db.filterUsers(function (this: User) {
  return this.admin;
});
```
- need to use function instead of arrow function

#### Other Types to Know About

- `void`: represents the return value of functions which don’t return a value, but is not the same as `undefined`
- `unknown`: represents any value, similar to `any` but but is safer because it’s not legal to do anything with an `unknown` value
- `never`: represents values which are never observed. In a return type, this means that the function throws an exception or terminates execution of the program.
    - also appears when TypeScript determines there’s nothing left in a union.
    ```javascript
    function fn(x: string | number) {
      if (typeof x === "string") {
          // do something
      } else if (typeof x === "number") {
          // do something else
      } else {
          x; // has type 'never'!
      }
    }
    ```

### Reference
- <a href='https://www.typescriptlang.org/docs/handbook/2/functions.html' target="_blank">More on Functions</a>
