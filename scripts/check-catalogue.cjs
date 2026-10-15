const { chromium } = require(
  process.env.PLAYWRIGHT_PACKAGE ||
    'C:/Users/shadr/AppData/Roaming/Python/Python314/site-packages/playwright/driver/package',
);
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const origin = process.env.CATALOGUE_ORIGIN || 'http://localhost:3611';
const output = path.join(process.env.TEMP, 'koolink-catalogue-check');
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  try {
    for (const device of [
      { name: 'desktop', viewport: { width: 1440, height: 1000 } },
      {
        name: 'phone',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
      {
        name: 'small-phone',
        viewport: { width: 320, height: 740 },
        isMobile: true,
        hasTouch: true,
        reducedMotion: 'reduce',
      },
    ]) {
      const { name, ...options } = device;
      const context = await browser.newContext(options);
      const page = await context.newPage();
      page.on('pageerror', (error) => errors.push(`${name}: ${error.message}`));
      await page.goto(`${origin}/products`, { waitUntil: 'networkidle' });
      await page
        .locator('figure img')
        .first()
        .evaluate((img) => img.decode());
      assert.equal(await page.locator('figure.gallery-item').count(), 29);
      assert.equal(await page.locator('.gallery-cta').count(), 29);
      assert.equal(await page.locator('figure .product-stamp').count(), 29);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await page.screenshot({ path: path.join(output, `${name}.png`) });
      await page.getByRole('button', { name: /Mould machines/ }).click();
      assert.equal(await page.locator('figure').count(), 3);
      await page
        .getByRole('button', { name: /View photo:/ })
        .first()
        .click();
      await page.locator('dialog[open]').waitFor();
      assert.equal(
        await page.getByRole('button', { name: 'Previous photo' }).isDisabled(),
        true,
      );
      const firstSrc = await page.locator('dialog img').getAttribute('src');
      await page.getByRole('button', { name: 'Next photo' }).click();
      await page.locator('dialog img').evaluate((img) => img.decode());
      await page.waitForTimeout(350);
      assert.ok(
        await page.locator('dialog').evaluate((node) => {
          const box = node.getBoundingClientRect();
          return box.top >= 0 && box.bottom <= innerHeight;
        }),
      );
      assert.notEqual(
        await page.locator('dialog img').getAttribute('src'),
        firstSrc,
      );
      const booking = decodeURIComponent(
        await page.locator('dialog a').getAttribute('href'),
      );
      assert.ok(booking.includes('mould type machines'));
      assert.ok(
        booking.includes(await page.locator('dialog img').getAttribute('src')),
      );
      await page.screenshot({ path: path.join(output, `${name}-viewer.png`) });
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('dialog').open);
      assert.ok(
        await page.evaluate(() =>
          document.activeElement.classList.contains('gallery-preview'),
        ),
      );
      assert.equal(await page.evaluate(() => document.body.style.overflow), '');
      if (name === 'desktop') {
        await page
          .getByRole('button', { name: 'Scroll stack', exact: true })
          .click();
        await page.waitForFunction(
          () =>
            document.querySelector('[data-scroll-stack]').dataset
              .stackActive === 'true',
        );
        const result = await page.evaluate(() => {
          const card = document.querySelector('[data-scroll-stack-card]');
          const y = card.getBoundingClientRect().top + scrollY + 450;
          window.__lenis?.scrollTo(y, { immediate: true });
          return getComputedStyle(card).position;
        });
        assert.equal(result, 'sticky');
        await page.waitForTimeout(350);
        await page.screenshot({ path: path.join(output, 'desktop-stack.png') });
        await page
          .getByRole('button', { name: 'Photo grid', exact: true })
          .click();
        await page.waitForFunction(
          () =>
            document.querySelector('[data-scroll-stack]').dataset
              .stackActive === 'false',
        );
      }
      await page.getByRole('button', { name: /Cold rooms/ }).click();
      assert.equal(await page.locator('figure').count(), 6);
      await page.goBack();
      await page.waitForFunction(
        () => document.querySelectorAll('figure').length === 3,
      );
      await page.goto(`${origin}/products#solar`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('figure').count(), 1);
      assert.ok(
        await page.locator('#heading-solar').evaluate((node) => {
          const box = node.getBoundingClientRect();
          return box.top >= 0 && box.top < innerHeight;
        }),
      );
      await page.goto(`${origin}/#products`, { waitUntil: 'networkidle' });
      await page.locator('#products').scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
      assert.equal(await page.locator('#products article').count(), 4);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await page.screenshot({ path: path.join(output, `${name}-home.png`) });
      console.log(
        `${name}: content, filters, viewer, booking, history, deep links and overflow passed`,
      );
      await context.close();
    }
    assert.deepEqual(errors, []);
    console.log(`Screenshots: ${output}`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
