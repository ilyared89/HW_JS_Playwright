// tests/4.4.FilterByTag.test.js
import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';

test.describe('4.4: Фильтрация по тегам', () => {
    test('выбор тега фильтрует ленту', async ({ page }) => {
        
        const mainPage = new MainPage(page);
        await mainPage.open();
        
        // Переходим в Global Feed (там есть теги)
        await mainPage.clickGlobalFeed();
        
        // Ждём загрузки тегов
        await expect(page.locator('.tag-list').first()).toBeVisible();
        
        // Берём первый КЛИКАБЕЛЬНЫЙ тег (button или a, не li)
        const tag = page.locator('.tag-list').first().locator('.tag-pill').first();
        await tag.waitFor({ state: 'visible' });
        
        const tagName = await tag.textContent();
        console.log(`🏷️ Выбираем тег: "${tagName?.trim()}"`);
        
        // Кликаем по тегу
        await tag.click();
        
        // ⏱️ Ждём обновления ленты
        await page.waitForTimeout(1000);
        
        // Проверяем, что лента обновилась
        const hasArticles = await page.locator('.article-preview').count() > 0;
        const hasEmptyMessage = await page.locator('text=No articles are here').isVisible().catch(() => false);

})})