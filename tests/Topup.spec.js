import { test, expect } from '@playwright/test'
require('dotenv').config();

test('Top up koin moter', async ({ page, context }) => {
    const params = {
        email: process.env.USER_EMAIL,
        fullname: process.env.USER_FULLNAME,
        token: process.env.USER_TOKEN
    };
    const queryString = new URLSearchParams(params).toString();
    const fullURL = `${process.env.BASE_URL}?${queryString}`;

    await page.goto(fullURL);

    await page.getByRole('button', { name: 'Selanjutnya' }).click();
    await page.getByRole('button', { name: 'Kembali' }).click();
    await page.getByRole('button', { name: 'Selanjutnya' }).click();
    await page.getByRole('button', { name: 'Selanjutnya' }).click();
    await page.getByRole('button', { name: 'Mulai' }).click();

    const event = page.locator('.block');
    await event.click();
    await expect(page.locator('//*[@id="__nuxt"]/div/section/div/img')).toBeVisible();

    await page.locator('svg.nuxt-icon--fill.w-10').click();

    await page.waitForSelector('text="Merchandise Moter"');

    // Assertion untuk memastikan elemen tertentu terlihat
    await expect(page.getByRole('heading', { name: 'Merchandise Moter' })).toBeVisible();

    // Memulai proses top up
    await page.locator('href="/coin/top-up"').click();
    await expect(page.getByRole('heading', { name: 'Top Up Coin' })).toBeVisible();
    await page.locator('li.mx-auto label[for="variant-62"]').click();
    await page.getByRole('button', { name: 'Top Up' }).click();

    // Menunggu terkoneksi ke iframe
    await page.waitForSelector('iframe#snap-midtrans');
    await page.waitForTimeout(2000);
    const midtransFrame = page.frameLocator('iframe#snap-midtrans');
    await midtransFrame.getByText('Virtual account').click();
    await midtransFrame.locator('a:nth-child(4)').click();

    // Validasi elemen yang muncul
    await expect(midtransFrame.getByText('Bank BRI')).toBeVisible();
    await expect(midtransFrame.getByText('Virtual account number', { exact: true })).toBeVisible();

    // Mengambil nomor VA
    await page.waitForTimeout(2000);
    const vaNumberNew = await midtransFrame.locator('div.payment-number#vaField').textContent();

    // Masuk page bayar VA
    const simulatorPage = await context.newPage();
    await simulatorPage.goto('https://simulator.sandbox.midtrans.com/openapi/va/index?bank=bri');
    await simulatorPage.locator('input[name="vaNumber"]').fill(vaNumberNew);
    await simulatorPage.waitForTimeout(2000);
    await simulatorPage.getByRole('button', { name: 'inquire' }).click();
    await simulatorPage.waitForTimeout(2000);
    await simulatorPage.getByRole('button', { name: 'Pay' }).click();

    // Kembali ke aplikasi
    await midtransFrame.getByRole('button', { name: 'Check status' }).click();
    await page.waitForTimeout(5000);

    await expect(page.getByRole('heading', { name: 'Penukaran Berhasil' })).toBeVisible();
    await page.getByRole('button', { name: 'Cek Status Pesanan' }).click();
    await expect(page.locator('.buttom-bar')).toBeVisible();

})