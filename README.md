# itworks
A simple node unit testing library. It is completly error driven and doesn't need any additional dependencies.

## Installation
```
npm install --save-dev itworksjs
```

## Usage
Create a test file, and set it as `npm test` in the `package.json` file. In the test file, follow this example:
```javascript
const {it, works} = require("itworksjs")

it("should be able to evaluate expressions", ()=>{
    if(1+1*2 != 3){
        throw new Error(`Evaluated 1+1*2 as ${1+1*2} instead of 3`)
    }
})

it("should think 1+1=3",()=>{
    if(1+1 != 3){
        throw new Error(`Evaluated 1+1 as ${1+1} instead of 3`)
    }
})

works()
```
Then, when testing
```
[O]: It should be able to evaluate expressions
[X]: It should think 1+1=3 FAILED: Evaluated 1+1 as 2 instead of 3
Tests Finished, Result: 1/2 Passed    
```
---
Example using `functions`

```javascript
// tested.js
function a(y,z){
    return z+y
}

function b(y,z){
    return y-z
}

module.exports = {a:a}

// test.js
const {it, works, functions} = require("itworksjs")

const {a,b} = functions(["a", "b"]).from("./tested.js")

it("should be able to add", ()=>{
    if(a(1,1) != 2){
        throw new Error(`a(1,1) = ${a(1,1)}`)
    }
})

it("should be able to substract", ()=>{
    if(b(3,4) != -1){
        throw new Error(`b(3,4) = ${b(3,4)}`)
    }
})

works()
```
Which gives the result:
```
[O]: It should be able to add
[O]: It should be able to substract

Tests Finished, Result: 2/2 Passed

It Works!
```

## Functions
- `it(message, code)`: Takes a message (text displayed when testing and identifier) and a function, and adds it to a global `tests` object (which is created if it doesn't already exist).

- `works()`: Tests all functions in the `tests` object, considers them failed if they throw an error (which is displayed). The function also returns [passedTests, totalTests].

- `functions(functionlist).from(file)`: Similar to the require function. Imports the functions (given as an array of strings) even if they are not in `module.exports`.

- `arrayEquals(array1, array2)`: Checks recursively if two arrays are equal.

---
### Note
`console` functions were replaced with empty ones, to suppress console logs. Use the new `console.print` function instead. 