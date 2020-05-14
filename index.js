const stdout = process.stdout
const write = text => stdout.write(text)
process.stdout = ()=>{}
console.log = ()=>{}                                                            // Default console.log function removed
console.info = ()=>{}
console.warn = ()=>{}

const fs = require("fs")
const path = require("path")

const red = "\033[31m"
const reset = "\x1b[0m"

function it(message, code){
    /**Takes a message (text displayed when testing and identifier) and a function, and adds it to a global tests object
     *(which is created if it doesn't already exist).*/
    if(!global["tests"]){
        global["tests"] = {}
    }
    tests[message] = code
}

function multiPrint(messages, step){
    /**Creates interval for printing */
    var index = 0
    return setInterval(()=>{
        write(messages[index])
        index = (index + 1) % messages.length
    }, step)
}

async function works(testList, err = false){
    /**Tests all functions in the tests object, considers them failed if the throw an error (which is displayed). 
     * err argument throws an error instead of exiting with non-zero code.
    */
    if(!testList){
        testList = tests
    }
    var testsFinished = 0;
    for (var [message, code] of Object.entries(testList)){
        write(`[.]: It ${message}\r`)
        var inter = multiPrint([`[ ]: It ${message}\r`, `[.]: It ${message}\r`], 1000)
        try{
            await code()
            clearInterval(inter)
            write(`[O]: It ${message}\n`)
            testsFinished += 1
        }catch(err){
            clearInterval(inter)
            write(`[X]: It ${message}${red} FAILED: ${err ? err.message : "(No Error Message)"}\n${reset}`)
        }
    }
    if(testsFinished == Object.entries(testList).length){
        write(`\nTest PASSED, Result: ${testsFinished}/${Object.entries(tests).length}\n`)
        write("\nIt Works!\n")
        return
    }
    else if(err){
        throw new Error(`Test FAILED, Result: ${testsFinished}/${Object.entries(tests).length}`)
    }
    else{
        write(`Test FAILED, Result: ${testsFinished}/${Object.entries(tests).length}\n`)
        process.exit(1)
    }
}

function functions(imports){
    /**Imports given functions from file given in the .from() function */
    return {from: function(fileName){
        fileName = path.resolve(process.cwd(), fileName)
        var fileText = fs.readFileSync(fileName, "utf8")
        var tempFile = fileName.replace(".js", "temp.js")
        var moduleExports = ""
        for(element of imports){
            moduleExports += `${element}:${element},`
        }
        fs.writeFileSync(tempFile, fileText + `;module.exports = {${moduleExports}}`)
        var newModule = require(tempFile)
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