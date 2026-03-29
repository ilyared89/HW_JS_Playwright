// tests/4.2.1.OpenArticle.test.js
import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { loadArticleData } from './shared/article-data.js';

test.describe('4.2.1: Открытие статьи из ленты', () => {
  test('открытие созданной статьи', async ({ page }) => {
    const mainPage = new MainPage(page);

    const article = loadArticleData();
    await expect(article?.title, '❌ Статья не найдена. Запустите сначала тест 4.1!').toBeTruthy();

    console.log(`📰 Ищем статью: "${article.title}"`);

    // ✅ Используем правильный метод с двумя параметрами
    await mainPage.openArticleBySlugAndTitle(article.slug, article.title);

    console.log('✅ 4.2.1: Статья открыта:', article.title);
  });
});
