---
title: 'Typescript - Narrowing'
desc: '學習typescript的筆記'
type: 'tech'
coverImage: '/assets/posts/tech/ts_logo.png'
date: '2023-07-09T00:00:00.000Z'
labels: [
    'typescript'
]
---

### Narrowing
TypeScript follows possible paths of execution that our programs can take to analyze the most specific possible type of a value at a given position. It looks at these special checks (called `type guards`) and assignments, and the process of refining types to more specific types than declared is called `narrowing`. In many editors we can observe these types as they change, and we’ll even do so in our examples.

```javascript
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") { // type gard
    return " ".repeat(padding) + input; // narrowing           
  }
  return padding + input;
}
```

### Type guard
#### `typeOf` narrowing
- ex: `string`, `number`, `object`, `undefined` ...
- `null` is also `object` (example as below)

```javascript
function printAll(strs: string | string[] | null) {
  if (typeof strs === "object") {
    for (const s of strs) { // 'strs' is possibly 'null'.
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  } else {
    // do nothing
  }
}
```

#### Truthiness narrowing
In JavaScript, we can use any expression in conditionals, `&&s`, `||s`, `if` statements, Boolean negations (`!`), and more.

```javascript
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === "object") { // exclude null and undefined
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  }
}
```

#### Equality narrowing
TypeScript also uses switch statements and equality checks like `===`, `!==`, `==`, and `!=` to narrow types.
- `== null` and `== undefined` check whether a value is either `null` or `undefined`

#### The `in` operator narrowing
JavaScript has an operator for determining if an object or its prototype chain has a property with a name: the in operator.

#### `instanceof` narrowing
JavaScript has an operator for checking whether or not a value is an “instance” of another value. (x `instanceof` Foo checks whether the prototype chain of `x` contains `Foo.prototype`)

#### Using type predicates
We’ve worked with existing JavaScript constructs to handle narrowing so far, however sometimes you want more direct control over how types change throughout your code.

To define a user-defined type guard, we simply need to define a function whose return type is a type predicate:

```javascript
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

#### Assertion functions
There’s a specific set of functions that throw an error if something unexpected happened. They’re called “assertion” functions.
```javascript
function multiply(x, y) {
  assert(typeof x === "number");
  assert(typeof y === "number");
  return x * y;
}
```

#### Discriminated unions
For dealing with complex structures.
```javascript
interface Circle {
  kind: "circle";
  radius: number;
}
 
interface Square {
  kind: "square";
  sideLength: number;
}

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
                        
(parameter) shape: Circle
    case "square":
      return shape.sideLength ** 2;
              
(parameter) shape: Square
  }
}
```

#### The `never` type
TypeScript will use a never type to represent a state which shouldn’t exist.

#### Exhaustiveness checking
The `never` type is assignable to every type; however, no type is assignable to `never` (except `never` itself). This means you can use narrowing and rely on `never` turning up to do exhaustive checking in a `switch` statement.

```javascript
interface Triangle {
  kind: "triangle";
  sideLength: number;
}

type Shape = Circle | Square | Triangle;
 
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape; // --> error: Type 'Triangle' is not assignable to type 'never'.
      return _exhaustiveCheck;
  }
}
```

### Reference
- <a href='https://www.typescriptlang.org/docs/handbook/2/narrowing.html' target="_blank">Narrowing</a>
