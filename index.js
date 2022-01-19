const puppeteer = require('puppeteer-extra');
const scrap = require("./scraper/scrap");



// Initiate browser using puppeteer
(async () => {
    const StealthPlugin = require('puppeteer-extra-plugin-stealth');
    await puppeteer.use(StealthPlugin());

    const browser = await puppeteer.launch({
        headless: false,
        args: ["--disable-setuid-sandbox",
            "--no-sandbox",
            "--window-size=1920,1080",
            "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36",
            "--disable-web-security",
            "--full-memory-crash-report",
            "--enable-crash-reporter",
            "--crash-dumps-dir=/tmp/chrome",
            "--unlimited-storage",
            "--ignore-certificate-errors",
            "--disable-dev-shm-usage",
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