const { chromium } = require('@playwright/test');

const BASE_URL = 'https://immigrationapp.netlify.app';

const pages = [
  { path: '/', name: 'Landing Page' },
  { path: '/auth/login', name: 'Login Page' },
  { path: '/auth/register', name: 'Register Page' },
  { path: '/contact', name: 'Contact Page' },
  { path: '/demo', name: 'Demo Page' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/dashboard/activity', name: 'Activity' },
  { path: '/dashboard/analytics', name: 'Analytics' },
  { path: '/dashboard/appointments', name: 'Appointments' },
  { path: '/dashboard/appointments/new', name: 'New Appointment' },
  { path: '/dashboard/cases', name: 'Cases' },
  { path: '/dashboard/cases/new', name: 'New Case' },
  { path: '/dashboard/communications', name: 'Communications' },
  { path: '/dashboard/documents', name: 'Documents' },
  { path: '/dashboard/leads', name: 'Leads' },
  { path: '/dashboard/leads/new', name: 'New Lead' },
  { path: '/dashboard/profile', name: 'Profile' },
  { path: '/dashboard/reports', name: 'Reports' },
  { path: '/dashboard/settings', name: 'Settings' },
  { path: '/dashboard/settings/automation', name: 'Automation' },
  { path: '/dashboard/settings/reminders', name: 'Reminders' },
  { path: '/dashboard/vault', name: 'Vault' },
  { path: '/dashboard/workflows', name: 'Workflows' },
  { path: '/portal/test-token', name: 'Portal' },
];

async function auditPages() {
  console.log('Starting Playwright Audit...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {
    passed: [],
    failed: [],
    errors: [],
  };

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  for (const p of pages) {
    const url = BASE_URL + p.path;
    console.log(`Testing: ${p.name} (${p.path})...`);

    try {
      const response = await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      if (!response || response.status() >= 400) {
        results.failed.push({ ...p, error: `HTTP ${response?.status()}` });
        console.log(`  ❌ FAILED: HTTP ${response?.status()}`);
        continue;
      }

      // Check for critical errors in page content
      const content = await page.content();
      
      // Check for error boundaries or crash messages
      if (content.includes('Something went wrong') || 
          content.includes('Application error') ||
          content.includes('Cannot read properties')) {
        results.failed.push({ ...p, error: 'Page contains error message' });
        console.log(`  ❌ FAILED: Contains error message`);
        continue;
      }

      // Check for duplicate navigation (menu issue)
      const menus = await page.locator('nav, [class*="sidebar"], [class*="menu"]').count();
      
      // Take screenshot for visual check
      await page.screenshot({ 
        path: `./audit-screenshots/${p.name.replace(/\s+/g, '-')}.png`,
        fullPage: false 
      });

      results.passed.push(p);
      console.log(`  ✅ PASSED`);

    } catch (error) {
      results.errors.push({ ...p, error: error.message });
      console.log(`  ❌ ERROR: ${error.message}`);
    }
  }

  await browser.close();

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('AUDIT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Pages: ${pages.length}`);
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️  Errors: ${results.errors.length}`);

  if (results.failed.length > 0) {
    console.log('\nFailed Pages:');
    for (const f of results.failed) {
      console.log(`  - ${f.name}: ${f.error}`);
    }
  }

  if (results.errors.length > 0) {
    console.log('\nError Pages:');
    for (const e of results.errors) {
      console.log(`  - ${e.name}: ${e.error}`);
    }
  }

  if (results.passed.length === pages.length) {
    console.log('\n🎉 ALL PAGES PASSED!');
  }

  return results;
}

auditPages().catch(console.error);
