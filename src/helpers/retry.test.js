const { retry } = require("./retry")

describe('Retryer', () => {
    describe('#retry', () => {
        test('Should return the response', async () => {
            // Arrange
            const p = () => Promise.resolve('success')
            // Act
            const res = await retry(p)
            // Assert
            expect(res).toEqual('success')
        })

        test('Should retry until success (max=5)', async () => {
            // Arrange
            let counter = 0
            const successWhen = 4
            const p = () => new Promise((resolve, reject) => {
                if (counter === successWhen) {
                    resolve('success')
                }
                counter++
                reject(new Error('error'))
            })
            // Act
            const res = await retry(p)
            // Assert
            expect(res).toEqual('success')
        })

        test('Should retry until success (max=10)', async () => {
            // Arrange
            let counter = 0
            const successWhen = 6
            const p = () => new Promise((resolve, reject) => {
                if (counter === successWhen) {
                    resolve('success')
                }
                counter++
                reject(new Error('error'))
            })
            // Act
            const res = await retry(p, 10)
            // Assert
            expect(res).toEqual('success')
        }, 15000)

        test('Should throw if no success before max (max=5)', async () => {
            // Arrange
            let counter = 0
            const successWhen = 10
            const p = () => new Promise((resolve, reject) => {
                if (counter === successWhen) {
                    resolve('success')
                }
                counter++
                reject(new Error('error'))
            })
            // Act and Assert
            await expect(retry(p)).rejects.toEqual(new Error('error'))
        }, 15000)
    })
})
