#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pagesDir = path.resolve(__dirname, '../src/pages')
const outDir = path.resolve(__dirname, '../reports')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let files = []
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) files = files.concat(walk(full))
    else if (e.isFile() && e.name.endsWith('.astro')) files.push(full)
  }
  return files
}

function toRoute(file) {
  const rel = path.relative(pagesDir, file).replace(/\\/g, '/')
  if (rel === 'index.astro') return '/'
  if (rel.endsWith('/index.astro')) return '/' + rel.replace(/\/index.astro$/, '')
  // skip dynamic pages with [
  if (rel.includes('[')) return null
  return '/' + rel.replace(/\.astro$/, '')
}

async function fetchHtml(url) {
  const res = await fetch(url, { redirect: 'follow' })
  const status = res.status
  const text = await res.text()
  return { status, text }
}

function extract(html) {
  const out = { title: '', h1: '', canonical: '', jsonld: [] }
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  if (titleMatch) out.title = titleMatch[1].trim().replace(/\s+/g, ' ')
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (h1Match) out.h1 = h1Match[1].trim().replace(/<[^>]+>/g, '').replace(/\s+/g, ' ')
  const canMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i)
  if (canMatch) {
    const href = canMatch[0].match(/href=["']([^"']+)["']/i)
    if (href) out.canonical = href[1]
  }
  const jsonMatches = Array.from(html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/ig))
  for (const m of jsonMatches) {
    try {
      const j = JSON.parse(m[1])
      out.jsonld.push(j)
    } catch (e) {
      // ignore parse errors
      try {
        // try to wrap multiple objects
        const arr = JSON.parse('[' + m[1] + ']')
        out.jsonld.push(...arr)
      } catch (_) {}
    }
  }
  return out
}

async function main() {
  const base = process.argv[2] || 'http://localhost:4321'
  const files = walk(pagesDir)
  const routes = files.map(toRoute).filter(Boolean)
  const results = []
  for (const r of routes) {
    const url = (r === '/' ? base : base.replace(/\/$/, '') + r)
    try {
      const { status, text } = await fetchHtml(url)
      const data = extract(text)
      const types = data.jsonld.map(j => j['@type'] || j.type || null).filter(Boolean)
      results.push({ route: r, url, status, title: data.title, h1: data.h1, canonical: data.canonical, jsonld_types: types, raw_jsonld: data.jsonld })
      console.log('OK', r, status)
    } catch (e) {
      console.error('ERR', r, e.message)
      results.push({ route: r, url, status: 'ERR', title: '', h1: '', canonical: '', jsonld_types: [], raw_jsonld: [] })
    }
  }
  fs.writeFileSync(path.join(outDir, 'crawl-report.json'), JSON.stringify(results, null, 2))
  // also CSV
  const csv = ['route,url,status,title,h1,canonical,jsonld_types']
  for (const row of results) {
    csv.push([row.route, row.url, row.status, '"' + (row.title || '').replace(/"/g, '""') + '"', '"' + (row.h1 || '').replace(/"/g, '""') + '"', row.canonical || '', '"' + (row.jsonld_types.join('|') || '') + '"'].join(','))
  }
  fs.writeFileSync(path.join(outDir, 'crawl-report.csv'), csv.join('\n'))
  console.log('Reports written to', outDir)
}

main().catch(e => { console.error(e); process.exit(1) })
