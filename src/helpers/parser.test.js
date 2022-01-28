const Parser = require('./parser')
const Operation = require('./operation')

describe('Parser', () => {

  describe('#startsWith', () => {
    test.each([
      {
        input: {
          name: 'pr-12',
          value: 'pr-',
        },
        expected: true
      }, {
        input: {
          name: 'latest',
          value: 'pr-',
        },
        expected: false
      },
    ])('Should test is $input.name startsWith $input.value ', ({ input, expected }) => {
      expect(Parser.startsWith(input.value)(input.name)).toEqual(expected)
    })
  });

  describe('#isEqual', () => {
    test.each([
      {
        input: {
          name: 'pr-12',
          value: 'pr-12',
        },
        expected: true
      }, {
        input: {
          name: 'latest',
          value: 'pr-12',
        },
        expected: false
      },
    ])('Should test is $input.name equals $input.value ', ({ input, expected }) => {
      expect(Parser.isEqual(input.value)(input.name)).toEqual(expected)
    })
  });

  describe('#someEndsWith', () => {
    test.each([
      {
        input: {
          name: 'pr-12',
          value: '-12',
        },
        expected: true
      }, {
        input: {
          name: 'latest',
          value: '-12',
        },
        expected: false
      },
    ])('Should test if $input.name ends with $input.value ', ({ input, expected }) => {
      expect(Parser.endsWith(input.value)(input.name)).toEqual(expected)
    })
  });

  describe('#someContains', () => {
    test.each([
      {
        input: {
          name: 'pr-12',
          value: 'r-',
        },
        expected: true
      }, {
        input: {
          name: 'latest',
          value: 'pr-',
        },
        expected: false
      },
    ])('Should test if $input.name contains $input.value ', ({ input, expected }) => {
      expect(Parser.contains(input.value)(input.name)).toEqual(expected)
    })
  });

  describe('#someStartsWith', () => {
    test.each([
      {
        input: {
          tags: ['pr-12'],
          value: 'pr-',
        },
        expected: true
      }, {
        input: {
          tags: ['pr-12', 'pr-12-fgt56s'],
          value: 'pr-',
        },
        expected: true
      }, {
        input: {
          tags: ['latest', '1.0.0'],
          value: 'pr-',
        },
        expected: false
      },
    ])('Should test is some of $input.tags startsWith $input.value ', ({ input, expected }) => {
      expect(Parser.someStartsWith(input.value)(input.tags)).toEqual(expected)
    })
  });

  describe('#someEquals', () => {
    test.each([
      {
        input: {
          tags: ['pr-12'],
          value: 'pr-12',
        },
        expected: true
      }, {
        input: {
          tags: ['pr-12', 'pr-12-fgt56s'],
          value: 'pr-12-fgt56s',
        },
        expected: true
      }, {
        input: {
          tags: ['latest', '1.0.0'],
          value: 'pr-',
        },
        expected: false
      },
    ])('Should test is some of $input.tags equals $input.value ', ({ input, expected }) => {
      expect(Parser.someEquals(input.value)(input.tags)).toEqual(expected)
    })
  });

  describe('#someEndsWith', () => {
    test.each([
      {
        input: {
          tags: ['pr-12'],
          value: '-12',
        },
        expected: true
      }, {
        input: {
          tags: ['pr-12', 'pr-12-fgt56s'],
          value: '-fgt56s',
        },
        expected: true
      }, {
        input: {
          tags: ['latest', '1.0.0'],
          value: 'pr-',
        },
        expected: false
      },
    ])('Should test is some of $input.tags ends with $input.value ', ({ input, expected }) => {
      expect(Parser.someEndsWith(input.value)(input.tags)).toEqual(expected)
    })
  });

  describe('#someContains', () => {
    test.each([
      {
        input: {
          tags: ['pr-12'],
          value: 'r-',
        },
        expected: true
      }, {
        input: {
          tags: ['pr-12'],
          value: 'pr-',
        },
        expected: true
      }, {
        input: {
          tags: ['pr-12', 'pr-12-fgt56s'],
          value: 'fgt56s',
        },
        expected: true
      }, {
        input: {
          tags: ['latest', '1.0.0'],
          value: 'pr-',
        },
        expected: false
      },
    ])('Should test is some of $input.tags contains $input.value ', ({ input, expected }) => {
      expect(Parser.someContains(input.value)(input.tags)).toEqual(expected)
    })
  });

  describe('#arrayCountEquals', () => {
    test.each([
      {
        input: {
          tags: ['pr-12'],
          value: '1',
        },
        expected: true
      }, {
        input: {
          tags: [],
          value: '0',
        },
        expected: true
      }, {
        input: {
          tags: ['pr-12', 'pr-12-fgt56s'],
          value: '2',
        },
        expected: true
      }, {
        input: {
          tags: ['latest', '1.0.0'],
          value: '0',
        },
        expected: false
      },
    ])('Should test is count of $input.tags equals $input.value ', ({ input, expected }) => {
      expect(Parser.arrayCountEquals(input.value)(input.tags)).toEqual(expected)
    })
  });

  describe('#arrayCountGreaterThan', () => {
    test.each([
      {
        input: {
          tags: ['pr-12'],
          value: '0',
        },
        expected: true
      }, {
        input: {
          tags: [],
          value: '-1',
        },
        expected: true
      }, {
        input: {
          tags: ['pr-12', 'pr-12-fgt56s'],
          value: '1',
        },
        expected: true
      }, {
        input: {
          tags: ['latest', '1.0.0'],
          value: '2',
        },
        expected: false
      },
    ])('Should test is count of $input.tags greater than $input.value ', ({ input, expected }) => {
      expect(Parser.arrayCountGreaterThan(input.value)(input.tags)).toEqual(expected)
    })
  });

  describe('#arrayCountGreaterThanOrEqual', () => {
    test.each([
      {
        input: {
          tags: ['pr-12'],
          value: '1',
        },
        expected: true
      }, {
        input: {
          tags: [],
          value: '0',
        },
        expected: true
      }, {
        input: {
          tags: ['pr-12', 'pr-12-fgt56s'],
          value: '2',
        },
        expected: true
      }, {
        input: {
          tags: ['latest', '1.0.0'],
          value: '3',
        },
        expected: false
      },
    ])('Should test is count of $input.tags greater than or equals $input.value ', ({ input, expected }) => {
      expect(Parser.arrayCountGreaterThanOrEqual(input.value)(input.tags)).toEqual(expected)
    })
  });

  describe('#arrayCountLessThan', () => {
    test.each([
      {
        input: {
          tags: ['pr-12'],
          value: '2',
        },
        expected: true
      }, {
        input: {
          tags: [],
          value: '1',
        },
        expected: true
      }, {
        input: {
          tags: ['pr-12', 'pr-12-fgt56s'],
          value: '3',
        },
        expected: true
      }, {
        input: {
          tags: ['latest', '1.0.0'],
          value: '2',
        },
        expected: false
      },
    ])('Should test is count of $input.tags less than $input.value ', ({ input, expected }) => {
      expect(Parser.arrayCountLessThan(input.value)(input.tags)).toEqual(expected)
    })
  });

  describe('#arrayCountLessThanOrEqual', () => {
    test.each([
      {
        input: {
          tags: ['pr-12'],
          value: '1',
        },
        expected: true
      }, {
        input: {
          tags: [],
          value: '0',
        },
        expected: true
      }, {
        input: {
          tags: ['pr-12', 'pr-12-fgt56s'],
          value: '2',
        },
        expected: true
      }, {
        input: {
          tags: ['latest', '1.0.0'],
          value: '1',
        },
        expected: false
      },
    ])('Should test is count of $input.tags less than or equals $input.value ', ({ input, expected }) => {
      expect(Parser.arrayCountLessThanOrEqual(input.value)(input.tags)).toEqual(expected)
    })
  });

  describe('#olderThan', () => {
    test.each([
      {
        input: {
          updated_at: new Date((new Date().setFullYear(new Date().getFullYear() - 2))).toISOString(),
          value: '1Y',
        },
        expected: true
      }, {
        input: {
          updated_at: new Date((new Date().setMonth(new Date().getMonth() - 11))).toISOString(),
          value: '10M',
        },
        expected: true
      }, {
        input: {
          updated_at: new Date((new Date().setDate(new Date().getDate() - 10))).toISOString(),
          value: '7d',
        },
        expected: true
      }, {
        input: {
          updated_at: new Date((new Date().setDate(new Date().getDate() - 1))).toISOString(),
          value: '22h',
        },
        expected: true
      }, {
        input: {
          updated_at: new Date((new Date().setMinutes(new Date().getMinutes() - 6))).toISOString(),
          value: '5m',
        },
        expected: true
      }, {
        input: {
          updated_at: new Date((new Date().setSeconds(new Date().getSeconds() - 30))).toISOString(),
          value: '15s',
        },
        expected: true
      }, {
        input: {
          updated_at: new Date((new Date().setFullYear(new Date().getFullYear() - 3))).toISOString(),
          value: '1Y11M30d23h59s',
        },
        expected: true
      },
    ])('Should test if latest update on $input.updated_at is older than now minus $input.value ', ({ input, expected }) => {
      expect(Parser.olderThan(input.value)(input.updated_at)).toEqual(expected)
    })
  });

  describe('#youngerThan', () => {
    test.each([
      {
        input: {
          updated_at: new Date((new Date().setFullYear(new Date().getFullYear() - 2))).toISOString(),
          value: '3Y',
        },
        expected: true
      }, {
        input: {
          updated_at: new Date((new Date().setMonth(new Date().getMonth() - 11))).toISOString(),
          value: '12M',
        },
        expected: true
      }, {
        input: {
          updated_at: new Date((new Date().setDate(new Date().getDate() - 10))).toISOString(),
          value: '15d',
        },
        expected: true
      }, {
        input: {
          updated_at: new Date((new Date().setHours(new Date().getHours() - 5))).toISOString(),
          value: '8h',
        },
        expected: true
      }, {
        input: {
          updated_at: new Date((new Date().setMinutes(new Date().getMinutes() - 6))).toISOString(),
          value: '15m',
        },
        expected: true
      }, {
        input: {
          updated_at: new Date((new Date().setSeconds(new Date().getSeconds() - 30))).toISOString(),
          value: '45s',
        },
        expected: true
      }, {
        input: {
          updated_at: new Date((new Date().setFullYear(new Date().getFullYear() - 2))).toISOString(),
          value: '2Y1s',
        },
        expected: true
      }, {
        input: {
          updated_at: new Date((new Date().setFullYear(new Date().getFullYear() - 2))).toISOString(),
          value: '2Y1M1d1h1s',
        },
        expected: true
      },
    ])('Should test if latest update on $input.updated_at is younger than now minus $input.value ', ({ input, expected }) => {
      expect(Parser.youngerThan(input.value)(input.updated_at)).toEqual(expected)
    })
  });

  describe('#parseLine', () => {
    test.each([
      {
        input: 'type=tagCount;operator=equals;value=1',
        expected: new Operation({
          type: 'tagCount',
          operator: Parser.arrayCountEquals,
          value: '1',
          operation: Parser.arrayCountEquals('1')
        })
      }, {
        input: 'type=tagCount;value=1',
        expected: new Operation({
          type: 'tagCount',
          operator: Parser.arrayCountEquals,
          value: '1',
          operation: Parser.arrayCountEquals('1')
        })
      }, {
        input: 'type=tagCount;operator=equals;value=1',
        expected: new Operation({
          type: 'tagCount',
          operator: Parser.arrayCountEquals,
          value: '1',
          operation: Parser.arrayCountEquals('1')
        })
      }, {
        input: 'type=tagCount;operator=greaterThan;value=1',
        expected: new Operation({
          type: 'tagCount',
          operator: Parser.arrayCountGreaterThan,
          value: '1',
          operation: Parser.arrayCountGreaterThan('1')
        })
      }, {
        input: 'type=tagCount;operator=greaterThanOrEqual;value=1',
        expected: new Operation({
          type: 'tagCount',
          operator: Parser.arrayCountGreaterThanOrEqual,
          value: '1',
          operation: Parser.arrayCountGreaterThanOrEqual('1')
        })
      }, {
        input: 'type=tagCount;operator=lessThan;value=1',
        expected: new Operation({
          type: 'tagCount',
          operator: Parser.arrayCountLessThan,
          value: '1',
          operation: Parser.arrayCountLessThan('1')
        })
      }, {
        input: 'type=tagCount;operator=lessThanOrEqual;value=1',
        expected: new Operation({
          type: 'tagCount',
          operator: Parser.arrayCountLessThanOrEqual,
          value: '1',
          operation: Parser.arrayCountLessThanOrEqual('1')
        })
      }, {
        input: 'type=tags;operator=startsWith;value=pr-1-',
        expected: new Operation({
          type: 'tags',
          operator: Parser.someStartsWith,
          value: 'pr-1-',
          operation: Parser.someStartsWith('pr-1-')
        })
      }, {
        input: 'type=tags;operator=endsWith;value=-branch',
        expected: new Operation({
          type: 'tags',
          operator: Parser.someEndsWith,
          value: '-branch',
          operation: Parser.someEndsWith('-branch')
        })
      }, {
        input: 'type=tags;operator=contains;value=pr',
        expected: new Operation({
          type: 'tags',
          operator: Parser.someContains,
          value: 'pr',
          operation: Parser.someContains('pr')
        })
      }, {
        input: 'type=tags;operator=equals;value=pr-1-g2v9q1',
        expected: new Operation({
          type: 'tags',
          operator: Parser.someEquals,
          value: 'pr-1-g2v9q1',
          operation: Parser.someEquals('pr-1-g2v9q1')
        })
      }, {
        input: 'type=age;operator=olderThan;value=7d',
        expected: new Operation({
          type: 'age',
          operator: Parser.olderThan,
          value: '7d',
          operation: Parser.olderThan('7d')
        })
      }, {
        input: 'type=age;operator=youngerThan;value=7d',
        expected: new Operation({
          type: 'age',
          operator: Parser.youngerThan,
          value: '7d',
          operation: Parser.youngerThan('7d')
        })
      }, {
        input: 'type=name;operator=startsWith;value=pr-1-',
        expected: new Operation({
          type: 'name',
          operator: Parser.startsWith,
          value: 'pr-1-',
          operation: Parser.startsWith('pr-1-')
        })
      }, {
        input: 'type=name;operator=isEqual;value=pr-1',
        expected: new Operation({
          type: 'name',
          operator: Parser.isEqual,
          value: 'pr-1',
          operation: Parser.isEqual('pr-1')
        })
      }, {
        input: 'type=name;operator=endsWith;value=-1',
        expected: new Operation({
          type: 'name',
          operator: Parser.endsWith,
          value: '-1',
          operation: Parser.endsWith('-1')
        })
      }, {
        input: 'type=name;operator=contains;value=-1',
        expected: new Operation({
          type: 'name',
          operator: Parser.contains,
          value: '-1',
          operation: Parser.contains('-1')
        })
      }, {
        input: 'type=name;value=pr-1',
        expected: new Operation({
          type: 'name',
          operator: Parser.isEqual,
          value: 'pr-1',
          operation: Parser.isEqual('-1')
        })
      }
    ])('Should successfully parse line $input', ({ input, expected }) => {
      const result = Parser.parseLine(input)
      expect(result).toEqual(expected)
    })

    test.each([
      {
        input: 'operator=equals;value=1'
      }, {
        input: 'type=tagCount;operator=equals'
      }, {
        input: 'operator=equals'
      },
    ])('Should throw $input', ({ input }) => {
      expect(() => Parser.parseLine(input)).toThrow()
    }
    )
  })

  describe('#parseRules', () => {
    test.each([{
      input: `type=tags;operator=startsWith;value=pr-
        type=age;operator=olderThan;value=5d
        type=tagCount;operator=greaterThanOrEqual;value=1`,
      expected: [
        new Operation({
          type: 'tags',
          operator: Parser.someStartsWith,
          value: 'pr-',
          operation: Parser.someStartsWith('pr-')
        }), new Operation({
          type: 'age',
          operator: Parser.olderThan,
          value: '5d',
          operation: Parser.olderThan('5d')
        }), new Operation({
          type: 'tagCount',
          operator: Parser.arrayCountGreaterThanOrEqual,
          value: '1',
          operation: Parser.arrayCountGreaterThanOrEqual('1')
        })
      ]
    }, {
      input: `
        type=tags;operator=startsWith;value=pr-

        type=age;operator=olderThan;value=5d

        type=tagCount;operator=greaterThanOrEqual;value=1
        `,
      expected: [
        new Operation({
          type: 'tags',
          operator: Parser.someStartsWith,
          value: 'pr-',
          operation: Parser.someStartsWith('pr-')
        }), new Operation({
          type: 'age',
          operator: Parser.olderThan,
          value: '5d',
          operation: Parser.olderThan('5d')
        }), new Operation({
          type: 'tagCount',
          operator: Parser.arrayCountGreaterThanOrEqual,
          value: '1',
          operation: Parser.arrayCountGreaterThanOrEqual('1')
        })
      ]
    }, {
      input: `
        type=tags;value=pr-

        type=age;value=5d

        type=tagCount;value=1
        `,
      expected: [
        new Operation({
          type: 'tags',
          operator: Parser.someEquals,
          value: 'pr-',
          operation: Parser.someEquals('pr-')
        }), new Operation({
          type: 'age',
          operator: Parser.olderThan,
          value: '5d',
          operation: Parser.olderThan('5d')
        }), new Operation({
          type: 'tagCount',
          operator: Parser.arrayCountEquals,
          value: '1',
          operation: Parser.arrayCountEquals('1')
        })
      ]
    }])('Should parse rules to array or operations', ({ input, expected }) => {
      const result = Parser.parseRulesFromString(input)
      expect(result).toEqual(expected)
    })
  })
})