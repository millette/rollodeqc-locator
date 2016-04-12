/*
Parse locations to extract city, etc.

Copyright 2016 Robin Millette <robin@millette.info> (<http://robin.millette.info>)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the
[GNU Affero General Public License](LICENSE.md)
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict'

const postal = require('node-postal')
const uniqBy = require('lodash.uniqby')
const deburr = require('lodash.deburr')

const roll = require('./rollodeqc-8000-c.json')

const bla = (str) => str
  .replace(/[:”“"]/g, ' ')
  .toLowerCase()
  .trim()
  .replace(/[.?]$/, '')
  .replace(/\band\b/g, '')
  .replace(/\bcnd\b/g, ' canada ')
  .replace(/\bqc\b/g, ' quebec ')
  .replace(/\bmtl\b/g, ' montreal ')
  .replace(/lanaudiere/g, 'lanaudière')
  .replace(/riviere/g, 'rivière')
  .replace(/montréal/g, 'montreal')
  .replace(/québec/g, 'quebec')
  .split(/[~|/]/)
  .map((z) => z.trim())

const moar = (ar) => ar
  .map((x) => {
    let g = postal.parser.parse_address(x)
    /*
    if (g.length === 1 && g[0].component === 'city' && deburr(g[0].value.trim()) === 'quebec') {
      g[0].component = 'state'
      return g
    }
    */
    g.map((y) => {
      y.value = y.value.trim()
      if (y.component === 'country' &&
        // because y.value === 'canadá' is always false :-(
        (deburr(y.value) === 'canada' || y.value === 'ca' || y.value === 'can')
      ) {
        y.value = 'canada'
      }
      return y
    })
    return g
  })
  .filter((x) => x.length)

const parse = (u) => {
  u.location.toParse = bla(u.location.github)
  u.location.parsed = moar(u.location.toParse)
  // delete u.public_repos
  // delete u.keywords
  return u
}

const massage = (p) => {
  if (p.length === 0 || p.length > 2) { return p }
  const x = p.slice()
  x.push('MISSING')
  return x
}

const isComplete = (i) => {
  if (i.length !== 3) { return '*** ' }
  const k = i.map((x) => x.component).sort()
  // console.log(k)
  if (k[0] === 'city' && k[1] === 'country' && k[2] === 'state') { return '' }
  return '*** '
}

const pretty = (i) => {
  return isComplete(i) + i
    .map((x) => x.value + ' (' + x.component.slice(0, 3) + ')')
    .join('--')
}

module.exports = function () {
  const locs = uniqBy(roll, (u) => u.location && u.location.github)
    .filter((u) => u.location && u.location.github)
    .map((u) => parse(u))
    .map((u) => {
      const massaged = u.location.parsed.map((x) => massage(x))
      return {
        massaged: massaged,
        github: u.location.github,
        parsed: u.location.parsed
      }
    })

  const out = locs.map((l) => {
    return {
  //    m: l.massaged,
      gh: l.github,
      p: l.parsed.map((y) => pretty(y)).join(' && ')
    }
  })

  // console.log(JSON.stringify(out, null, ' '))
  return out
}
