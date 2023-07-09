---
title: 'Typescript - Everyday types'
desc: '學習typescript的筆記'
type: 'tech'
coverImage: '/assets/posts/tech/ts_logo.png'
date: '2023-04-04T00:00:00.000Z'
labels: [
    'typescript'
]
---

### Everyday Types

#### The primitives
- string
- number
- boolean

#### Arrays
- The type of [1,2,3] can be `number[]` or `Array<number>`, there are the same

#### any
- Can be used whenever you don’t want a particular value to cause typechecking errors
- `noImplicitAny` - when there is no type specified, the compiler will default take it as `any`.With this flag, we can ask compiler to throw error when the type is `any`.

#### Type Annotations on Variables
- After the thing being typed

<img src='/assets/posts/tech/typescript_every_day_types/typescript_every_day_types_1.png'/>

- TypeScript tries to automatically infer the types in your code

<img src='/assets/posts/tech/typescript_every_day_types/typescript_every_day_types_2.png'/>

#### Functions
- Parameter Type Annotations
- Return Type Annotations - usually don’t need a return type annotation because TypeScript will infer the function’s return type based on its return statements
```typescript
function rabbit(name: string, age: number): string {
  return `${name} is ${age} years old!`;
}
```

#### Object Types
- Can use `;` or `,` to separate the properties
- The type of each property is optional, default `any`
```typescript
function rabbit(info: { name: string, age: number} ) {
  return `${info.name} is ${info.age} years old!`;
}
```

#### Optional Properties
- Add `?` after the property name
```typescript
function rabbit(info: { name: string, age?: number} ) {
  return `${info.name} is ${info.age} years old!`;
}
```

#### Union Types
- Can define more than one type to an argument, but TypeScript will `only allow` an operation if it is valid for `every` member of the union

<img src='/assets/posts/tech/typescript_every_day_types/typescript_every_day_types_3.png'/>

- The solution to narrow the union by using `typeof` (or if it's an array, can use `Array.isArray`) to separate each condition

#### Type Aliases
- Can create a type and reuse it, can be any kind of type
- Can not be used to create different/distinct “versions” of the same type.
- Can be extended
- Can not be changed after created

<img src='/assets/posts/tech/typescript_every_day_types/typescript_every_day_types_4.png'/>

```typescript
// Extend
type Basic = {
  name: string,
  age: number
}

type Rabbit = Basic & { 
  likeFruit: boolean 
}

// Add property
type Rabbit = {
  name: string
}

type Rabbit = {
  age: number
}
---> ERROR: Duplicate identifier 'Rabbit'
```

#### Interfaces
- Similar to Type
- Can be extended
- Can add new fields to existing interface

<img src='/assets/posts/tech/typescript_every_day_types/typescript_every_day_types_5.png'/>

```typescript
// Extend
interface Basic {
  name: string;
  age: number;
}

interface Rabbit extends Basic {
  likeFruit: boolean
}

// Add property
interface Rabbit {
  name: string;
  age: number;
}

interface Rabbit {
  likeFruit: boolean
}
```

#### Type Assertions
```typescript
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
// or
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

#### Literal Types
- Can be used to limit the value of a parameter
- The type `boolean` itself is actually just an alias for the union `true | false`.
```typescript
let rabbit: "yuan yuan" | "fen" | "nii";
```

#### `null` and `undefined`
- `strictNullChecks`on, when a value is null or undefined, you will need to `test` for those values before using methods or properties on that value
```typescript
function doSomething(x: string | null) {
  // --> check here
  if (x === null) {   
    // do nothing
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```
- Non-null Assertion Operator (`!`), for removing null and undefined from a type without doing any explicit checking

#### Enums
```typescript
enum Colors {
  Red = 0,
  Blue = 1,
  Green = 2,
}
```

### Reference
- <a href='https://www.typescriptlang.org/docs/handbook/2/everyday-types.html' target="_blank">Everyday Types</a>
