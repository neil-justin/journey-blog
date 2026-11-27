/* Variant test screenshots: both variants, desktop + mobile. */
const { chromium } = require("playwright");
const fs = require("fs");

const BASE = process.env.BASE_URL || "http://localhost:3100";
const OUT = ".impeccable/review";

const shots = [
  { path: "/variant/terminal", name: "terminal" },
  { path: "/variant/horizon", name: "horizon" },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath:
      "/home/neil/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell",
  });

  for (const { path, name } of shots) {
    for (const [tag, viewport, fullPage] of [
      ["desktop", { width: 1440, height: 900 }, true],
      ["mobile", { width: 390, height: 844 }, true],
    ]) {
      const page = await browser.newPage({ viewport });
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      // let type-in animations settle: scroll through, then back to top
      await page.evaluate(async () => {
        await new Promise((res) => {
          let y = 0;
          const step = () => {
            y += 600;
            window.scrollTo(0, y);
            if (y < document.body.scrollHeight) setTimeout(step, 60);
            else res();
          };
          step();
        });
      });
      await page.waitForTimeout(1200);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}/${name}-${tag}.png`, fullPage });
      console.log(`captured ${name}-${tag}.png`);
      await page.close();
    }
  }
  await browser.close();
})();
