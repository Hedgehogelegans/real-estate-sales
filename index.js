const puppeteer = require('puppeteer-extra');
const scrap = require("./scraper/scrap");



// Initiate browser using puppeteer
(async () => {
    const StealthPlugin = require('puppeteer-extra-plugin-stealth');
    await puppeteer.use(StealthPlugin());

    const browser = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox",
        "--window-size=1200,800",
        "--user-data-dir='/var/tmp/Chrome'", "--disable-web-security", "--allow-running-insecure-content",
        ],
        'ignoreHTTPSErrors': true
    });;

    const page = await browser.newPage();

    // Then visit centris homepage
    await page.goto('https://www.centris.ca/fr/propriete~a-vendre~montreal?view=Thumbnail', { waitUntil: 'networkidle2' });

    await page.waitForTimeout(5000);
    await page.setRequestInterception(true);
    await page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        }
        else {
            req.continue();
        }
    });
    // Navigate to first item
    await Promise.all([
        page.mouse.click(138, 380, { button: 'left' }),
        page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 6000 })
    ]);
    await page.waitForTimeout(2000);
    // Scrap data
    await scrap.scrap(page);
    // Close Puppeteer
    await browser.close();
})();