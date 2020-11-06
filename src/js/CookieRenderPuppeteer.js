#!/usr/bin/env node

/* eslint-disable */
const fs = require('fs');
const puppeteer = require("puppeteer");
const path = require('path');

const directory =  path.resolve(__dirname, '..', '..');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto('https://online.seranking.com/login.html');
    await page.setViewport({width: 1920, height: 4200});
    await page.waitFor(5000);
    await page.focus("input[name='aItem[login]']");
    page.keyboard.type('YOUR_MAIL');

    await page.waitFor(2000);
    await page.focus("input[name='aItem[password]']");
    page.keyboard.type('YOUR_PASSWORD');

    await page.waitFor(2000);
    await page.click('.f_btn_blue');
    await page.waitFor(5000);
    await page.hover('.dl-trigger');
    await page.waitFor(2000);
    await page.click('ul.dl-menu >  li:nth-child(1) > a');
    await page.waitFor(5000);
    await page.focus("input#search-home");
    page.keyboard.type('example.com');

    await page.waitFor(2000);
    await page.click('#search-button-start');
    await page.waitFor(5000);
    const cookies = await page.cookies();

    const file = directory + '/storage/datas/cookies.json';
    fs.writeFileSync(file, JSON.stringify(cookies));
    await browser.close();
})();
