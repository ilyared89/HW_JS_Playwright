// tests/4.2.2.AddComment.test.js
import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { CommentsPage } from '../src/pages/comments.page.js';
import { loadArticleData } from './shared/article-data.js';

test.describe('4.2.2: Добавление комментария', () => {
  test('добавление комментария к статье', async ({ page }) => {
    const mainPage = new MainPage(page);
    const commentsPage = new CommentsPage(page);

    // 🔹 Загружаем данные статьи из 4.1
    const article = loadArticleData();
    await expect(article?.slug, '❌ Статья не найдена. Запустите тест 4.1!').toBeTruthy();

    // 🔹 Открываем статью НАПРЯМУЮ по slug + проверяем заголовок
    await mainPage.openArticleBySlugAndTitle(article.slug, article.title);

    // 🔹 Добавляем комментарий
    const commentText = `Comment-${Date.now()}`;
    await commentsPage.addComment(commentText);

    console.log('✅ 4.2.2: Комментарий добавлен:', commentText);
  });
});
