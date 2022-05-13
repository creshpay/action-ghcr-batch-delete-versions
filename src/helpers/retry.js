const wait = require('util').promisify(setTimeout)

const retry = async (fn, max=5, curr=0) => {
    await wait(Math.pow(2, curr) * 100)
    try {
        return await fn()
    } catch(e) {
        if(e.message.includes('Package version not found')){
            return
        }
        if (curr < max){
            curr++
            return retry(fn, max, curr)
        }
        console.log('Error during version deletion')
        console.log(JSON.stringify(e))
        throw e
    }
}

module.exports =
{
    retry
}