const Operation = require('./operation')
const { finder } = require('./finder')
const { someStartsWith, arrayCountGreaterThanOrEqual, olderThan, someEquals, contains } = require('./parser')


const now = new Date()
const nowMinus6Days = new Date(now)
nowMinus6Days.setDate(now.getDate() - 6)
const nowMinus1Month6Days = new Date(nowMinus6Days)
nowMinus1Month6Days.setMonth(nowMinus6Days.getMonth() - 1)

const nowISO = now.toISOString()
const nowISOMinus6Days = nowMinus6Days.toISOString()
const nowISOMinus1Month6Days = nowMinus1Month6Days.toISOString()

describe('Finder', () => {
  async function* generateSequence(arr) {
    for (let i = 0; i < arr.length; i++) {
      await new Promise(resolve => setImmediate(resolve));
      yield arr[i];
    }
  }

  describe('findWantedPackageVersion', () => {
    test.each([
      {
        packageVersionsFromGithub: [{
          data: [
            {
              metadata: {
                container: {
                  tags: ['pr-1', 'pr-1-fgt56s']
                }
              },
              updated_at: nowISO
            }, {
              metadata: {
                container: {
                  tags: ['1.0.2', 'sha-fgt56s']
                }
              },
              updated_at: nowISO
            }, {
              metadata: {
                container: {
                  tags: ['pr-5', 'pr-5-df45s']
                }
              },
              updated_at: nowISO
            }
          ]
        }, {
          data: [
            {
              metadata: {
                container: {
                  tags: ['1.0.0', 'sha-1hv8y5']
                }
              },
              updated_at: nowISO
            }, {
              metadata: {
                container: {
                  tags: ['pr-4', 'pr-4-h45ghbg']
                }
              },
              updated_at: nowISOMinus6Days
            }, {
              metadata: {
                container: {
                  tags: ['pr-3', 'pr-3-ah47h9']
                }
              },
              updated_at: nowISOMinus1Month6Days
            }
          ]
        }],
        includeRules: [
          new Operation({
            type: 'tags',
            operator: someStartsWith,
            value: 'pr-',
            operation: someStartsWith('pr-')
          }), new Operation({
            type: 'age',
            operator: olderThan,
            value: '5d',
            operation: olderThan('5d')
          }), new Operation({
            type: 'tagCount',
            operator: arrayCountGreaterThanOrEqual,
            value: '1',
            operation: arrayCountGreaterThanOrEqual('1')
          })
        ],
        excludeRules: [],
        expected: [
          {
            metadata: {
              container: {
                tags: ['pr-4', 'pr-4-h45ghbg']
              }
            },
            updated_at: nowISOMinus6Days
          }, {
            metadata: {
              container: {
                tags: ['pr-3', 'pr-3-ah47h9']
              }
            },
            updated_at: nowISOMinus1Month6Days
          }
        ]
      }, {
        packageVersionsFromGithub: [{
          data: [
            {
              metadata: {
                container: {
                  tags: ['pr-1', 'pr-1-fgt56s']
                }
              },
              updated_at: nowISO
            }, {
              metadata: {
                container: {
                  tags: ['1.0.2', 'sha-fgt56s']
                }
              },
              updated_at: nowISO
            }, {
              metadata: {
                container: {
                  tags: ['pr-5', 'pr-5-df45s']
                }
              },
              updated_at: nowISO
            }
          ]
        }, {
          data: [
            {
              metadata: {
                container: {
                  tags: ['1.0.0', 'sha-1hv8y5']
                }
              },
              updated_at: nowISO
            }, {
              metadata: {
                container: {
                  tags: ['pr-4', 'pr-4-h45ghbg']
                }
              },
              updated_at: nowISOMinus6Days
            }, {
              metadata: {
                container: {
                  tags: ['pr-3', 'pr-3-ah47h9']
                }
              },
              updated_at: nowISOMinus1Month6Days
            }
          ]
        }],
        includeRules: [
          new Operation({
            type: 'tags',
            operator: someStartsWith,
            value: 'pr-',
            operation: someStartsWith('pr-')
          }), new Operation({
            type: 'age',
            operator: olderThan,
            value: '5d',
            operation: olderThan('5d')
          }), new Operation({
            type: 'tagCount',
            operator: arrayCountGreaterThanOrEqual,
            value: '1',
            operation: arrayCountGreaterThanOrEqual('1')
          })
        ],
        excludeRules: [
          new Operation({
            type: 'tags',
            operator: someEquals,
            value: 'pr-3-ah47h9',
            operation: someEquals('pr-3-ah47h9')
          })],
        expected: [
          {
            metadata: {
              container: {
                tags: ['pr-4', 'pr-4-h45ghbg']
              }
            },
            updated_at: nowISOMinus6Days
          }
        ]
      }, {
        packageVersionsFromGithub: [{
          data: [
            {
              name: '1.16.1-pr146-85222ee',
            }, {
              name: '1.16.1',
            }, {
              name: '1.15.5-pr145-451ebc6',
            }
          ]
        }, {
          data: [
            {
              name: '1.15.5',
            }, {
              name: '1.15.4',
            }, {
              name: '1.15.3-pr146-451ebc6',
            }
          ]
        }],
        includeRules: [
          new Operation({
            type: 'name',
            operator: contains,
            value: '-pr146-',
            operation: contains('-pr146-')
          })
        ],
        excludeRules: [],
        expected: [
          {
            name: '1.16.1-pr146-85222ee',
          }, {
            name: '1.15.3-pr146-451ebc6',
          }
        ]
      },
    ])('Should select only wanted packageVersion', async ({ packageVersionsFromGithub, includeRules, excludeRules, expected }) => {
      const results = await finder(generateSequence(packageVersionsFromGithub), includeRules, excludeRules)
      expect(results).toEqual(expected)
    })
  })
})