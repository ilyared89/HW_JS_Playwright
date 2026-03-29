// tests/4.1.CreateArticle.test.js
import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { EditorPage } from '../src/pages/editor.page.js';
import { ArticlePage } from '../src/pages/article.page.js'; // 🔹 Добавлен импорт
import { saveArticleData } from './shared/article-data.js';

test.describe('4.1: Создание статьи', () => {
  test('создание новой статьи', async ({ page }) => {
    // 🔹 Инициализация страниц
    const mainPage = new MainPage(page);
    const editorPage = new EditorPage(page);
    const articlePage = new ArticlePage(page); // 🔹 Страница статьи

    // 🔹 Навигация к редактору
    await mainPage.open();
    await mainPage.clickNewArticle();

    // 🔹 Генерация уникальных данных
    const timestamp = Date.now();
    const articleTitle = `Article-${timestamp}`;
    const articleDescription = `Description for ${timestamp}`;
    const articleContent = `Content body for ${timestamp}`;
    const articleTags = `tag-${timestamp}`;

    // 🔹 Создание статьи
    await editorPage.createArticle(articleTitle, articleDescription, articleContent, articleTags);

    // 🔹 Проверка: хэш в URL изменился на /article/
    await expect(page).toHaveURL(/.*#\/article\//);

    // 🔹 ПРОВЕРКА ЗАГОЛОВКА: используем ArticlePage, а не EditorPage
    await expect(articlePage.articleTitle).toContainText(articleTitle);

    // 🔹 Извлекаем название из хэша (для realworld: slug === title)
    const articleName = await page.evaluate(() => {
      const hash = location.hash; // "#/article/Article-123"
      return hash.split('/article/')[1]?.split('?')[0];
    });

    // 🔹 Сохраняем данные для зависимых тестов (4.2.*)
    saveArticleData({ title: articleTitle, slug: articleName });

    console.log('✅ 4.1: Статья создана:', articleTitle, '| Slug:', articleName);
  });
});
