// tests/4.3.DeleteComment.test.js
import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { CommentsPage } from '../src/pages/comments.page.js';
import { loadArticleData } from './shared/article-data.js';

test.describe('4.3: Удаление комментария', () => {
  test('удаление комментария из статьи', async ({ page }) => {
    const mainPage = new MainPage(page);
    const commentsPage = new CommentsPage(page);

    // 🔹 1. Загружаем данные статьи из теста 4.1
    const article = loadArticleData();
    await expect(article?.slug, '❌ Статья не найдена. Запустите тест 4.1 сначала!').toBeTruthy();
    console.log('✅ Используем статью:', article.title, '| slug:', article.slug);

    // 🔹 2. Открываем статью (метод сам проверит 404)
    await mainPage.openArticleBySlugAndTitle(article.slug, article.title);

    // 🔹 3. Проверяем заголовок (уже проверено в методе, но для надёжности)
    await expect(mainPage.articlePageTitle).toBeVisible();

    // 🔹 4. Добавляем комментарий
    const commentText = `Comment-del-${Date.now()}`;
    await commentsPage.addComment(commentText);
    console.log('✅ Комментарий добавлен:', commentText);

    // 🔹 5. Удаляем комментарий
    await commentsPage.deleteComment(commentText);

    // 🔹 6. Проверка удаления
    const texts = await commentsPage.getCommentTexts();
    expect(texts.some((t) => t.includes(commentText))).toBe(false);

    console.log('✅ 4.3: Комментарий удалён');
  });
});
