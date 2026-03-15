import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { loadArticleData } from './shared/article-data.js';  // 🔹 Импорт

test('открытие созданной статьи из глобальной ленты', async ({ page }) => {
    const mainPage = new MainPage(page);
    const article = loadArticleData();
    const articleLink = page.locator('a').filter({ hasText: article.title }).first();

    console.log('Загружена статья:', article.title);
    
    await mainPage.open();
    await expect(mainPage.yourFeedTab).toBeVisible();
    await page.locator('button', { hasText: 'Global Feed' }).click();
    await expect(articleLink).toBeVisible({ timeout: 10000 });
    await articleLink.click();
    await expect(page).toHaveURL(/.*\/article\//);
    await expect(page.locator('h1')).toContainText(article.title);
    //await expect(page.locator('p')).toContainText(article.description);
    await expect(page.locator('p').first()).toContainText(article.content);

    console.log('✅ Статья успешно открыта:', article.title);
});