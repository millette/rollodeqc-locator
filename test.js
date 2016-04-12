/*eslint arrow-parens: [2, "as-needed"]*/
'use strict'
import test from 'ava'
import fn from './'

test('title', t => {
  const result = fn()
  // console.log(result.length)
  t.is(result.length, 940)
})
