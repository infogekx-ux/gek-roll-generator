// Screenshot helper — renders a local HTML at 3 viewports.
// Usage: node shot.js <html> <outPrefix>
const { chromium } = require('/opt/node22/lib/node_modules/playwright/index.js') ||
  require('playwright');
const path = require('path');

const [, , htmlArg, prefixArg] = process.argv;
const html = path.resolve(htmlArg || 'bento-K.html');
const prefix = prefixArg || 'shot';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1200 },
  { name: 'tablet', width: 768, height: 1400 },
  { name: 'mobile', width: 390, height: 2200 },
];

(async () => {
  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await page.goto('file://' + html, { waitUntil: 'networkidle' });
    // trigger any IntersectionObserver reveals + give fonts a beat
    await page.evaluate(() => {
      document.querySelectorAll('.feature-card, .bento-card, .fade-in')
        .forEach(el => el.classList.add('visible', 'in-view'));
      // capture the revealed end-state (scroll reveal strips pre-reveal live)
      document.querySelectorAll('.pre-reveal')
        .forEach(el => el.classList.remove('pre-reveal'));
    });
    await page.waitForTimeout(700);
    const out = `${prefix}-${vp.name}.png`;
    // screenshot just the features section to keep it tight
    const sec = await page.$('#features');
    if (sec) await sec.screenshot({ path: out });
    else await page.screenshot({ path: out, fullPage: true });
    console.log('wrote', out, `(${vp.width}x${vp.height})`);
    await ctx.close();
  }
  await browser.close();
})();
