/**
 * Strip Tailwind `dark:…` variants (light-only UI).
 * Charset excludes quotes/backticks/newlines — avoids eating closing quotes.
 */
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve('src')

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) walk(p, acc)
    else if (/\.tsx?$/.test(name)) acc.push(p)
  }
  return acc
}

// Tailwind arbitrary may use brackets, slash, parentheses, commas, #: 
const DARK_RE = /\s+dark:[^\s"'`]+/g
const BRACE_RE = /\}dark:[^\s"'`]+\}/g

function stripPass(s) {
  return s.replace(DARK_RE, ' ').replace(BRACE_RE, '}')
}

function stripAll(s) {
  let cur = s
  let prev = ''
  while (prev !== cur) {
    prev = cur
    cur = stripPass(cur)
  }
  return cur
}

for (const file of walk(ROOT)) {
  const txt = fs.readFileSync(file, 'utf8')
  const next = stripAll(txt)
  if (next !== txt) {
    fs.writeFileSync(file, next)
    console.log(path.relative(process.cwd(), file))
  }
}
