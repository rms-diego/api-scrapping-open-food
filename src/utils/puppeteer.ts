import puppeteer from 'puppeteer';

export async function getPuppeteerClient() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  return { browser, page };
}
