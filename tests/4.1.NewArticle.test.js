import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';

test('создание статьи (уже авторизован)', async ({ page }) => {
    const mainPage = new MainPage(page);
    const title = `Article-${Date.now()}`;
    //comit
    await mainPage.open();
    await expect(mainPage.yourFeedTab).toBeVisible();
    await mainPage.clickNewArticle();
    
    await page.locator('input[placeholder="Article Title"]').fill(title);
    await page.locator('input[placeholder="What\'s this article about?"]').fill('Description');
    await page.locator('textarea[placeholder="Write your article (in markdown)"]').fill('Content');
    await page.locator('input[placeholder="Enter tags"]').fill('test');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/.*\/article\//, { timeout: 15000 });
    await expect(page.locator('h1')).toContainText(title);
});