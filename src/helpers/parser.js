const { equal } = require('assert');
const { EOL } = require('os');

const Operation = require('./operation')

const startsWith = (prefix) => (value) => value.startsWith(prefix)
const isEqual = (search) => (value) => value === search
const endsWith = (suffix) => (value) => value.endsWith(suffix)
const contains = (search) => (value) => value.includes(search)

const someStartsWith = (prefix) => (values) => values.some(startsWith(prefix))
const someEquals = (search) => (values) => values.some(isEqual(search))
const someEndsWith = (suffix) => (values) => values.some(endsWith(suffix))
const someContains = (search) => (values) => values.some(contains(search))

const arrayCountEquals = (count) => (arr) => arr.length === +count
const arrayCountGreaterThan = (count) => (arr) => arr.length > +count
const arrayCountGreaterThanOrEqual = (count) => (arr) => arr.length >= +count
const arrayCountLessThan = (count) => (arr) => arr.length < +count
const arrayCountLessThanOrEqual = (count) => (arr) => arr.length <= +count

const convertToOffset = (value) => {
  const { groups: { years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0 } } = /((?<years>\d+)Y)?((?<months>\d+)M)?((?<days>\d+)d)?((?<hours>\d+)h)?((?<minutes>\d+)m)?((?<seconds>\d+)s)?/.exec(value)
  return { years, months, days, hours, minutes, seconds }
}
const nowMinusOffset = (offset) => {
  const offsetDate = new Date()
  offsetDate.setFullYear(offsetDate.getFullYear() - +offset.years)
  offsetDate.setMonth(offsetDate.getMonth() - +offset.months)
  offsetDate.setDate(offsetDate.getDate() - +offset.days)
  offsetDate.setHours(offsetDate.getHours() - +offset.hours)
  offsetDate.setMinutes(offsetDate.getMinutes() - +offset.minutes)
  offsetDate.setSeconds(offsetDate.getSeconds() - +offset.seconds)
  return offsetDate
}
const olderThan = (value) => {
  const offsetDate = nowMinusOffset(convertToOffset(value))
  return (date) => Date.parse(date) < offsetDate.getTime()
}
const youngerThan = (value) => {
  const offsetDate = nowMinusOffset(convertToOffset(value))
  return (date) => Date.parse(date) > offsetDate.getTime()
}

const DEFAULT_OPERATOR = 'equals';

const mapTypeOperatorFunc = {
  tags: {
    startsWith: someStartsWith,
    endsWith: someEndsWith,
    contains: someContains,
    [DEFAULT_OPERATOR]: someEquals,
  },
  tagCount: {
    [DEFAULT_OPERATOR]: arrayCountEquals,
    greaterThan: arrayCountGreaterThan,
    greaterThanOrEqual: arrayCountGreaterThanOrEqual,
    lessThan: arrayCountLessThan,
    lessThanOrEqual: arrayCountLessThanOrEqual,
  },
  age: {
    [DEFAULT_OPERATOR]: olderThan,
    olderThan: olderThan,
    youngerThan: youngerThan,
  },
  name: {
    [DEFAULT_OPERATOR]: isEqual,
    startsWith: startsWith,
    isEqual: isEqual,
    endsWith: endsWith,
    contains: contains,
  },
}

const getValueOrDefault = (str, default_value) => str && str.split('=').length > 1 ? str.split('=')[1].trim() : default_value
const getValueOrNull = (str) => getValueOrDefault(str, null)

const getPart = (parts) => (key) => parts.find(chunk => chunk.includes(key))

const parseLine = (line) => {
  const splitted = line.split(';')

  const typePart = getPart(splitted)('type')
  const operatorPart = getPart(splitted)('operator')
  const valuePart = getPart(splitted)('value')

  if (!typePart || !valuePart) {
    throw new Error('INVALID_PAYLOAD')
  }

  const type = getValueOrNull(typePart)
  const operator = mapTypeOperatorFunc[type][getValueOrDefault(operatorPart, DEFAULT_OPERATOR)]
  const value = getValueOrNull(valuePart)

  return new Operation({
    type,
    operator,
    value,
  })
}

const trimString = (str) => str.trim()

const isNotEmptyString = (str) => str.length > 0

const parseRulesFromString = (rules) => {
  return rules
    .split(EOL)
    .map(trimString)
    .filter(isNotEmptyString)
    .map(parseLine)
}

module.exports = {
  parseRulesFromString: parseRulesFromString,
  parseLine: parseLine,
  startsWith: startsWith,
  isEqual: isEqual,
  endsWith: endsWith,
  contains: contains,
  someStartsWith: someStartsWith,
  someEquals: someEquals,
  someEndsWith: someEndsWith,
  someContains: someContains,
  olderThan: olderThan,
  youngerThan: youngerThan,
  arrayCountEquals: arrayCountEquals,
  arrayCountGreaterThan: arrayCountGreaterThan,
  arrayCountGreaterThanOrEqual: arrayCountGreaterThanOrEqual,
  arrayCountLessThan: arrayCountLessThan,
  arrayCountLessThanOrEqual: arrayCountLessThanOrEqual,
}