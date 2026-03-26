// tests/4.2.1.OpenArticle.test.js
import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { loadArticleData } from './shared/article-data.js';

test.describe('4.2.1: Открытие статьи из ленты', () => {
    test('открытие созданной статьи', async ({ page }) => {
        
        const article = loadArticleData();
        await expect(article?.title, 'Статья не найдена').toBeTruthy();
        
        console.log(`📰 Ищем статью: "${article.title}"`);
        
        const mainPage = new MainPage(page);
        
        // ✅ Прямой переход по slug
        const slug = article.slug || article.title.toLowerCase().replace(/\s+/g, '-');
        await mainPage.openArticleBySlug(slug);
        
        // Проверка
        await expect(page.locator('h1')).toContainText(article.title);
        console.log('✅ 4.2.1: Статья открыта:', article.title);
    });
});