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
            console.log(`[O]: It ${message}`)
            testsFinished += 1
        }catch(err){
            console.log(`[X]: It ${message} FAILED: ${err.message}`)
        }
    }
    console.log(`\nTests Finished, Result: ${testsFinished}/${Object.entries(tests).length} Passed`)
    if(testsFinished==Object.entries(tests).length){
        console.log("\nIt Works!")
    }
    return [testsFinished, Object.entries(tests).length]
}

module.exports = {it: it, works: works}