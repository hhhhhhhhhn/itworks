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
npm test
[O]: It should be able to evaluate expressions
[X]: It should think 1+1=3 FAILED: Evaluated 1+1 as 2 instead of 3
Tests Finished, Result: 1/2 Passed    
```

## Functions
- `it`: Takes a message (text displayed when testing and identifier) and a function, and adds it to a global `tests` object (which is created if it doesn't already exist).

- `works`: Tests all functions in the `tests` object, considers them failed if they throw an error (which is displayed). The function also returns [passedTests, totalTests].