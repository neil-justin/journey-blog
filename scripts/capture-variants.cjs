/* 3D variant test screenshots: both variants, desktop + mobile. */
const { chromium } = require("playwright");
const fs = require("fs");

const BASE = process.env.BASE_URL || "http://localhost:3100";
const OUT = ".impeccable/review";

const shots = [
  { path: "/variant/deep", name: "deep" },
  { path: "/variant/cluster", name: "cluster" },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath:
      "/home/neil/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell",
    args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
  });

  for (const { path, name } of shots) {
    for (const [tag, viewport] of [
      ["desktop", { width: 1440, height: 900 }],
      ["mobile", { width: 390, height: 844 }],
    ]) {
      const page = await browser.newPage({ viewport });
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      // scroll through so sections mount + camera travels, then settle at a mid-scene view
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
      await page.waitForTimeout(1500);
      // viewport shot at first viewport (the hero scene)
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${OUT}/${name}-${tag}-hero.png`, fullPage: false });
      // full page
      await page.screenshot({ path: `${OUT}/${name}-${tag}.png`, fullPage: true });
      console.log(`captured ${name}-${tag}.png`);
      await page.close();
    }
  }
  await browser.close();
})();
