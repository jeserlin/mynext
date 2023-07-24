---
title: 'Typescript - More on Functions (1)'
desc: '學習typescript的筆記'
type: 'tech'
coverImage: '/assets/posts/tech/ts_logo.png'
date: '2023-07-24T00:00:00.000Z'
labels: [
    'typescript'
]
---

#### Function Type Expressions

```javascript
// `(a: string) => void` is the type of fn
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}

// can also use type alias to name a type function
type GreetFunction = (a: string) => void;

// And then we can use GreetFunction to replace `(a: string) => void`
function greeter(fn: GreetFunction) {
  fn("Hello, World");
}
```

#### Call Signatures

```javascript
// functions can have properties in addition to being callable -- call signature
// syntax use `:` between parameter list and return type (rather than using `=>`)
type DescribableFunction = {
  description: string;
  (someArg: number): boolean; 
}
function doSomething(fn: DescribableFunction) {
  console.log(`${fn.description} returned ${fn(6)}`)
}

function myFunc(someArg: number) {
  return someArg > 3;
}
myFunc.description = "default description";

doSomething(myFunc);
```

#### Construct Signatures
Use `new` keyword in front of a call signature to write a construct signature

```javascript
type SomeConstructor = {
  new (s: string): SomeObject;
};
function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}

// Some objects can be called with / without `new` (ex: Date())
// Can combine call and construct signatures
interface CallOrConstruct {
  new (s: string): Date;
  (n?: number): string;
}
```

#### Generic Functions

```javascript
// This works but it returns `any`
function firstElement(arr: any[]) {
  return arr[0];
}

// when defining generic functions can declare a `type parameter` in the function signature
// The `Type` here link between the input of the function and the output
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```

#### Inference
The type was inferred - chosen automatically - by TypeScript

#### Constraints
To limit the kinds of types that a type parameter can accept

```javascript
// extend `length` to `Type`
// ex: when the input is error, it will show error because number doesn't have `length`
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}
```
Common error when using constraint
```javascript
function miniumLength<Type extends { length: number }>(
  obj: Type,
  minium: number
): Type { // should return the same kind of object that passed in
  if(obj.length >= minium) {
    return obj;
  } else {
    return { length: minimum };
    // error here, should be same kind of object that passed in not some object matches the constraint
  }
}
```

### Reference
- <a href='https://www.typescriptlang.org/docs/handbook/2/functions.html' target="_blank">More on Functions</a>
