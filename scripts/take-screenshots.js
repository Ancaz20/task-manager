import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DOCS_DIR = resolve(__dirname, '../docs')
const APP_URL = process.env.APP_URL || 'http://localhost:5173'
const API_URL = process.env.API_URL || 'http://localhost:8080'

const TEST_USER = { username: 'demo', password: 'demo123' }

mkdirSync(DOCS_DIR, { recursive: true })

async function registerIfNeeded(page) {
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

async function run() {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await context.newPage()

  await registerIfNeeded(page)

  // 1. Login page
  await page.goto(`${APP_URL}/login`)
  await page.waitForLoadState('networkidle')
  await page.fill('input[type="text"]', TEST_USER.username)
  await page.fill('input[type="password"]', TEST_USER.password)
  await page.screenshot({ path: `${DOCS_DIR}/screenshot-login.png`, fullPage: false })
  console.log('✅ screenshot-login.png')

  // 2. Dashboard (after login)
  await page.click('button[type="submit"]')
  await page.waitForURL(`${APP_URL}/`)
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: `${DOCS_DIR}/screenshot-dashboard.png`, fullPage: false })
  console.log('✅ screenshot-dashboard.png')

  // 3. New task form
  await page.click('button:has-text("New Task")')
  await page.waitForSelector('form')
  await page.fill('input[name="title"]', 'Deploy to production')
  await page.fill('textarea[name="description"]', 'Deploy backend to Render and frontend to Vercel')
  await page.selectOption('select[name="status"]', 'IN_PROGRESS')
  await page.selectOption('select[name="priority"]', 'HIGH')
  await page.screenshot({ path: `${DOCS_DIR}/screenshot-form.png`, fullPage: false })
  console.log('✅ screenshot-form.png')

  // 4. Mobile view
  await context.close()
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const mobilePage = await mobileContext.newPage()
  await mobilePage.goto(`${APP_URL}/login`)
  await mobilePage.fill('input[type="text"]', TEST_USER.username)
  await mobilePage.fill('input[type="password"]', TEST_USER.password)
  await mobilePage.click('button[type="submit"]')
  await mobilePage.waitForURL(`${APP_URL}/`)
  await mobilePage.waitForLoadState('networkidle')
  await mobilePage.screenshot({ path: `${DOCS_DIR}/screenshot-mobile.png`, fullPage: false })
  console.log('✅ screenshot-mobile.png')
  await mobileContext.close()

  // 5. Swagger UI
  const swaggerContext = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const swaggerPage = await swaggerContext.newPage()
  await swaggerPage.goto(`${API_URL}/swagger-ui.html`)
  await swaggerPage.waitForLoadState('networkidle')
  await swaggerPage.screenshot({ path: `${DOCS_DIR}/screenshot-swagger.png`, fullPage: false })
  console.log('✅ screenshot-swagger.png')
  await swaggerContext.close()

  await browser.close()
  console.log(`\n📁 All screenshots saved to: ${DOCS_DIR}`)
}

run().catch(err => { console.error(err); process.exit(1) })
