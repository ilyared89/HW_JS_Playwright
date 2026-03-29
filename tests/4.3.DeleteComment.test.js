// tests/4.3.DeleteComment.test.js
import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { CommentsPage } from '../src/pages/comments.page.js';

test.describe('4.3: Удаление комментария', () => {
  test('удаление комментария из статьи', async ({ page }) => {
    const mainPage = new MainPage(page);
    const commentsPage = new CommentsPage(page);

    // Открываем первую статью из Global Feed
    await mainPage.open();
    await mainPage.clickGlobalFeed();
    await mainPage.waitForArticles();
    await mainPage.openFirstArticle();

    await expect(page).toHaveURL(/article/);

    // Добавляем комментарий
    const commentText = `Comment-del-${Date.now()}`;
    await commentsPage.addComment(commentText);

    const newComment = commentsPage.getCommentLocator(commentText);
    await expect(newComment).toBeVisible();
    console.log('✅ Комментарий добавлен:', commentText);

    // Удаляем (обработчик диалога уже в конструкторе!)
    await commentsPage.deleteComment(commentText);

    console.log('✅ 4.3: Комментарий удалён');
  });
});
