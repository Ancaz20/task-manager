import puppeteer from 'puppeteer'
import { mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DOCS_DIR = resolve(__dirname, '../docs')
const APP_URL = process.env.APP_URL || 'http://localhost:5173'
const API_URL = process.env.API_URL || 'http://localhost:8080'

const TEST_USER = { username: 'demo', password: 'demo123' }

mkdirSync(DOCS_DIR, { recursive: true })

async function registerIfNeeded() {
  try {
    await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: TEST_USER.username, email: 'demo@demo.com', password: TEST_USER.password })
    })
  } catch {
    // user may already exist — proceed
  }
}

async function waitForSelector(page, selector, timeout = 5000) {
  await page.waitForSelector(selector, { timeout })
}

async function run() {
  await registerIfNeeded()
  const browser = await puppeteer.launch({ headless: 'new' })

  // 1. Login page
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle2' })
  await waitForSelector(page, 'input[type="text"]')
  await page.type('input[type="text"]', TEST_USER.username)
  await page.type('input[type="password"]', TEST_USER.password)
  await page.screenshot({ path: `${DOCS_DIR}/screenshot-login.png` })
  console.log('✅ screenshot-login.png')

  // 2. Dashboard
  await page.click('button[type="submit"]')
  await page.waitForNavigation({ waitUntil: 'networkidle2' })
  await page.screenshot({ path: `${DOCS_DIR}/screenshot-dashboard.png` })
  console.log('✅ screenshot-dashboard.png')

  // 3. New task form
  await page.click('button ::-p-text(New Task)')
  await waitForSelector(page, 'form input[name="title"]')
  await page.type('input[name="title"]', 'Deploy to production')
  await page.type('textarea[name="description"]', 'Deploy backend to Render and frontend to Vercel')
  await page.select('select[name="status"]', 'IN_PROGRESS')
  await page.select('select[name="priority"]', 'HIGH')
  await page.screenshot({ path: `${DOCS_DIR}/screenshot-form.png` })
  console.log('✅ screenshot-form.png')

  // 4. Mobile view
  const mobilePage = await browser.newPage()
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true })
  await mobilePage.goto(`${APP_URL}/login`, { waitUntil: 'networkidle2' })
  await waitForSelector(mobilePage, 'input[type="text"]')
  await mobilePage.type('input[type="text"]', TEST_USER.username)
  await mobilePage.type('input[type="password"]', TEST_USER.password)
  await mobilePage.click('button[type="submit"]')
  await mobilePage.waitForNavigation({ waitUntil: 'networkidle2' })
  await mobilePage.screenshot({ path: `${DOCS_DIR}/screenshot-mobile.png` })
  console.log('✅ screenshot-mobile.png')

  // 5. Swagger UI
  const swaggerPage = await browser.newPage()
  await swaggerPage.setViewport({ width: 1280, height: 900 })
  await swaggerPage.goto(`${API_URL}/swagger-ui.html`, { waitUntil: 'networkidle2' })
  await swaggerPage.screenshot({ path: `${DOCS_DIR}/screenshot-swagger.png` })
  console.log('✅ screenshot-swagger.png')

  await browser.close()
  console.log(`\n📁 All screenshots saved to: ${DOCS_DIR}`)
}

run().catch(err => { console.error(err); process.exit(1) })
