import { expect, test } from 'vitest'
import { classNames } from '../classNames'

test('should not filter out truthy values', values => {
  expect(
    classNames(
      'hello-world',
      1 && '1',
      {} && 'object',
      [] && 'array',
      true && 'true',
    ),
  ).toBe('hello-world 1 object array true')
})

test('should filter out falsy values', values => {
  expect(
    classNames(
      '',
      undefined,
      null,
      false,
      0,
      undefined && 'undefined',
      null && 'null',
      false && 'false',
      0 && '0',
    ),
  ).toBe('')
})

test('should flatten values', values => {
  expect(
    classNames(
      ['hello-world'],
      [1 && '1'],
      [{} && 'object'],
      [[] && 'array'],
      [true && 'true'],
    ),
  ).toBe('hello-world 1 object array true')
})
