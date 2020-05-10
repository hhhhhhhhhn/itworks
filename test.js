const {it, works, functions} = require(".")

const badError = new Error("This error shouldn't happen")
const goodError = new Error("This error should happen")

it("Should be able to test basic addition (positive)", ()=>{
    if(1 + 1 != 2) throw badError
})

it("Should be able to test basic addition (negative)", ()=>{
    if(2 + 2 == 4) throw goodError
})

it("Should be able to test async methods (positive)", async ()=>{
    var result = await new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(1 + 1)
        }, 5000)
    })
    if(result != 2) throw badError
})

it("Should be able to test async methods (negative)", async ()=>{
    var result = await new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(1 + 1)
        }, 5000)
    })
    if(result == 2) throw goodError
})

it("Should be able to test basic errors (negative)", ()=>{
    return 2()
})

it("Should be able to test async errors (negative)", async ()=>{
    await new Promise((resolve, reject)=>{
        setTimeout(()=>{
            reject()
        }, 5000)
    })
})

async function main(){
    try{
        await works()
        throw new Error("Test PASSED, Result: 6/6")
    }
    catch(err){
        if(!err.message.includes("2/6")) throw new Error("Test Failed")
    }
}

main()