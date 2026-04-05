// tests/4.1.CreateArticle.test.js
import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { EditorPage } from '../src/pages/editor.page.js';
import { ArticlePage } from '../src/pages/article.page.js';
import { saveArticleData } from './shared/article-data.js';

test.describe('4.1: Создание статьи', () => {
  test('создание новой статьи', async ({ page }) => {
    // 🔹 Инициализация страниц
    const mainPage = new MainPage(page);
    const editorPage = new EditorPage(page);
    const articlePage = new ArticlePage(page);

    // 🔹 Навигация к редактору
    await mainPage.open();
    await mainPage.clickNewArticle();

    // 🔹 Генерация уникальных данных
    const timestamp = Date.now();
    const articleTitle = `Article-${timestamp}`;
    const articleDescription = `Description for ${timestamp}`;
    const articleContent = `Content body for ${timestamp}`;
    const articleTags = `tag-${timestamp}`;

    // 🔹 🔥 ОТЛАДКА ПЕРЕД публикацией (если нужна — только ДО createArticle)
    // console.log('🔹 Title value:', await editorPage.titleInput.inputValue()); // ❌ Удалить или закомментировать

    // 🔹 Создание статьи
    const result = await editorPage.createArticle(
      articleTitle,
      articleDescription,
      articleContent,
      articleTags
    );

    // 🔹 Сохраняем данные для зависимых тестов
    saveArticleData({
      title: result.title,
      slug: result.slug,
    });

    // 🔹 Финальный ассерт: заголовок статьи содержит ожидаемый текст
    await expect(articlePage.articleTitle).toContainText(articleTitle);

    console.log('✅ 4.1: Статья создана:', articleTitle, '| Slug:', result.slug);

    // 🔹 Опционально: отладка ПОСЛЕ создания (но без обращения к полям редактора)
    console.log('🔹 Final URL:', page.url());
  });
});
