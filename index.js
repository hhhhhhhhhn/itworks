console.print = console.log;
console.log = ()=>{};          //default console.log function removed
console.info = ()=>{};
console.warn = ()=>{};

const fs = require("fs")
const path = require("path")

function it(message, code){
    /**Takes a message (text displayed when testing and identifier) and a function,
     *  and adds it to a global tests object (which is created if it doesn't already exist).*/
    if(!global["tests"]){
        global["tests"] = {};
    }
    tests[message] = code
}

async function works(testList){
    /**Tests all functions in the tests object, considers them failed if the throw an error
     *  (which is displayed). */
    if(!testList){
        testList = tests
    }
    var testsFinished = 0;
    for ([message, code] of Object.entries(testList)){
        try{
            await code()
            console.print(`[O]: It ${message}`)
            testsFinished += 1
        }catch(err){
            console.print(`[X]: It ${message} FAILED: ${err.message}`)
        }
    }
    console.print(`\nTests Finished, Result: ${testsFinished}/${Object.entries(tests).length} Passed`)
    if(testsFinished==Object.entries(testList).length){
        console.print("\nIt Works!")
    }
    return [testsFinished, Object.entries(testList).length]
}

function functions(imports){
    /**Imports given functions from file given in the .from() function */
    return {from: function(fileName){
        fileName = path.resolve(process.cwd(), fileName)
        fileText = fs.readFileSync(fileName, "utf8")
        tempFile = fileName.replace(".js", "temp.js")
        moduleExports = ""
        for(element of imports){
            moduleExports += `${element}:${element},`
        }
        fs.writeFileSync(tempFile, fileText + `;module.exports = {${moduleExports}}`)
        newModule = require(tempFile)
        fs.unlinkSync(tempFile)
        return newModule
    }}
}

function arrayEquals(array1, array2){
    /**Checks if two arrays are equal (recursive) */
    if(array1 == array2) return true
    if(array1.length != array2.length) return false

    for(var i = 0; i < array1.length; i++){
        if(Array.isArray(array1[i])){
            if(!arrayEquals(array1[i], array2[i])) return false
        }else{
            if(array1[i] != array2[i]) return false
        }
    }
    return true
}

module.exports = {it: it, works: works, functions: functions, arrayEquals: arrayEquals}