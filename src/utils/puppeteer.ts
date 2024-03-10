import puppeteer from 'puppeteer';

export async function getPuppeteerClient() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  return { browser, page };
}
