import { test, expect } from '@playwright/test';
require('dotenv').config();

// Fungsi untuk membangun URL dengan query string
const buildURL = () => {
    const params = {
        email: process.env.USER_EMAIL,
        fullname: process.env.USER_FULLNAME,
        token: process.env.USER_TOKEN
    };
    const queryString = new URLSearchParams(params).toString();
    return `${process.env.BASE_URL}?${queryString}`;
};

// Fungsi untuk navigasi tombol
const navigateSteps = async (page, steps) => {
    for (const step of steps) {
        await page.getByRole('button', { name: step }).click();
    }
};

test('Access Moter (Event Active)', async ({ page }) => {
    const fullURL = buildURL();
    await page.goto(fullURL);

    // Navigasi langkah-langkah
    await navigateSteps(page, ['Selanjutnya', 'Kembali', 'Selanjutnya', 'Selanjutnya', 'Mulai']);

    const event = page.locator('.block');
    await event.click();
    await expect(page.locator('//*[@id="__nuxt"]/div/section/div/img')).toBeVisible();

    await page.locator('svg.nuxt-icon--fill.w-10').click();
    await page.waitForSelector('text="Merchandise Moter"');

    // Assertion untuk memastikan elemen tertentu terlihat
    await expect(page.getByRole('heading', { name: 'Merchandise Moter' })).toBeVisible();
});

test('Access Moter', async ({ page }) => {
    const fullURL = buildURL();
    await page.goto(fullURL);

    // Navigasi langkah-langkah
    await navigateSteps(page, ['Selanjutnya', 'Kembali', 'Selanjutnya', 'Selanjutnya', 'Mulai']);

    const event = page.locator('img.w-80.max-w-fit');
    if (await event.isVisible()) {
        await page.locator('div.fixed.left-0.top-0.z-50.flex.h-full.min-h-[100dvh].w-full.items-end.justify-center').click();
    }

    await page.waitForSelector('text="Merchandise Moter"');

    // Assertion untuk memastikan elemen tertentu terlihat
    await expect(page.getByRole('heading', { name: 'Merchandise Moter' })).toBeVisible();
});

test('Access Moter (Do Event)', async ({ page }) => {
    const fullURL = buildURL();
    await page.goto(fullURL);

    // Navigasi langkah-langkah
    await navigateSteps(page, ['Selanjutnya', 'Kembali', 'Selanjutnya', 'Selanjutnya', 'Mulai']);

    const event = page.locator('.block');
    await event.click();
    await expect(page.locator('//*[@id="__nuxt"]/div/section/div/img')).toBeVisible();

    await page.getByRole('link', { name: 'Mulai Top-Up Pulsa Sekarang' }).click();
    await expect(page.getByRole('heading', { name: 'Pulsa' })).toBeVisible();

    await page.getByRole('textbox', { name: 'No Hp' }).fill('087872789599');
    await page.locator('select#dropdown-operatorUser').click();
    await page.selectOption('#dropdown-operatorUser', { value: 'Telkomsel' });
    await page.locator('//*[@id="__nuxt"]/div/div[2]/section[2]/div/ol/li[1]/label').click();
    await page.getByRole('button', { name: 'Tukar' }).click();
    await expect(page.getByRole('heading', { name: 'Barang Anda' })).toBeVisible();
});
