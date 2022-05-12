const wait = require('util').promisify(setTimeout)

const retry = async (fn, max=5, curr=0) => {
    await wait(Math.pow(2, curr) * 100)
    try {
        return await fn()
    } catch(e) {
        if (curr < max){
            curr++
            return retry(fn, max, curr)
        }
        throw e
    }
}

module.exports =
{
    retry
}