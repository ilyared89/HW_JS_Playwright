// tests/4.3.DeleteComment.test.js
import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { CommentsPage } from '../src/pages/comments.page.js';

test.describe('4.3: Удаление комментария', () => {
    test('удаление комментария из статьи', async ({ page }) => {
        
        // 🔹 1. Инициализируем страницы
        const mainPage = new MainPage(page);
        const commentsPage = new CommentsPage(page);
        
        // 🔹 2. Переходим в Глобальную ленту
        await mainPage.open();
        await mainPage.clickGlobalFeed();
        
        // 🔹 3. Ждём загрузки статей и берём ПЕРВУЮ
        const firstArticleLink = page
            .locator('a[href*="/article/"]:has(h1)')
            .first();
        
        await firstArticleLink.waitFor({ state: 'visible'});
        
        // 🔹 4. Получаем заголовок статьи (для отладки и проверок)
        const articleTitle = await firstArticleLink.locator('h1').textContent();
        console.log(`📰 Открываем статью: "${articleTitle?.trim()}"`);
        
        // 🔹 5. Открываем статью
        await firstArticleLink.click();
        await expect(page).toHaveURL(/.*#\/article\//);
        
        // 🔹 6. Добавляем комментарий
        const commentText = `Comment-del-${Date.now()}`;
        await commentsPage.addComment(commentText);
        
        // 🔹 7. Проверяем, что комментарий появился
        const newComment = commentsPage.getCommentLocator(commentText);
        await expect(newComment).toBeVisible();
        console.log('✅ Комментарий добавлен:', commentText);
        
        // 🔹 8. Удаление комментария
        console.log('🗑️ 4.3: Удаляем комментарий...');
        
        // Обработчик диалога — настраиваем ДО клика
        page.on('dialog', async dialog => {
            if (dialog.message().toLowerCase().includes('delete')) {
                console.log('  → Подтверждаем удаление');
                await dialog.accept();
            }
        });
        
        // Удаляем комментарий через метод из CommentsPage
        await commentsPage.deleteComment(commentText);
        
        // 🔹 9. Проверяем, что комментарий удалён
        await expect(newComment).not.toBeVisible();
        console.log('✅ 4.5: Комментарий удалён');
    });
});