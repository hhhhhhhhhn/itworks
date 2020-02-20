consolelog = console.log;
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

async function works(){
    /**Tests all functions in the tests object, considers them failed if the throw an error
     *  (which is displayed). */
    var testsFinished = 0;
    for ([message, code] of Object.entries(tests)){
        try{
            await code()
            consolelog(`[O]: It ${message}`)
            testsFinished += 1
        }catch(err){
            consolelog(`[X]: It ${message} FAILED: ${err.message}`)
        }
    }
    consolelog(`\nTests Finished, Result: ${testsFinished}/${Object.entries(tests).length} Passed`)
    if(testsFinished==Object.entries(tests).length){
        consolelog("\nIt Works!")
    }
    return [testsFinished, Object.entries(tests).length]
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

module.exports = {it: it, works: works, functions: functions}