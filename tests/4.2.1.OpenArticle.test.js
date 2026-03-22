import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { loadArticleData } from './shared/article-data.js';

test.describe('4.2.1: Открытие статьи из ленты', () => {
    test('открытие созданной статьи', async ({ page }) => {
        
        const article = loadArticleData();
        if (!article?.title) {
            throw new Error('❌ Статья не найдена. Запустите сначала тест 4.1!');
        }
        console.log(`📰 Ищем статью: "${article.title}"`);
        
        const mainPage = new MainPage(page);
        await mainPage.open();
        
        // 🔹 ГЛОБАЛЬНАЯ ЛЕНТА — статья там гарантированно есть
        await mainPage.clickGlobalFeed();
        
        // 🔹 Ждём загрузки статей
        await page
            .locator('a[href*="/article/"]:has(h1)')
            .first()
            .waitFor({ state: 'visible', timeout: 10000 });
        
        // 🔹 Ищем и открываем конкретную статью
        const articleLink = page
            .locator(`a[href*="/article/"]:has(h1:has-text("${article.title}"))`)
            .first();
        
        await articleLink.waitFor({ state: 'visible' });
        await articleLink.click();
        
        await expect(page).toHaveURL(/.*#\/article\//);
        console.log('✅ 4.2.1: Статья открыта:', article.title);
    });
});