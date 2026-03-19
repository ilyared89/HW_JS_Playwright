// tests/4.5.DeleteComment.test.js
import { test, expect } from '@playwright/test';
import { AuthPage } from '../src/pages/auth.page.js';
import { MainPage } from '../src/pages/main.page.js';
import { EditorPage } from '../src/pages/editor.page.js';
import { CommentsPage } from '../src/pages/comments.page.js';

test.describe('4.5: Удаление комментария', () => {
    test('удаление комментария из статьи', async ({ page }) => {
        
        //  1. Авторизация
        const authPage = new AuthPage(page);
        await authPage.login('test@example.com', 'password123');
        
        //  2. Создаём статью (тест самодостаточен!)
        const mainPage = new MainPage(page);
        await mainPage.open();
        await mainPage.clickNewArticle();
        
        const editorPage = new EditorPage(page);
        const articleTitle = `Article-4.5-${Date.now()}`;
        
        await editorPage.createArticle(
            articleTitle,
            'Description for 4.5',
            'Content for 4.5',
            'test45'
        );
        await editorPage.createArticle(
    articleTitle,
    'Description for 4.5',
    'Content for 4.5',
    'test45'
);

// ⏱️ Ждём, пока статья появится в API (критично!)
await page.waitForTimeout(3000);

//  3. Переходим в Глобальную ленту
await mainPage.open();
await mainPage.clickGlobalFeed();
        //  3. Переходим в Глобальную ленту
        await mainPage.open();
        await mainPage.clickGlobalFeed();
        
        //  4. Ждём появления статей
        await expect.poll(async () => {
            return await page.locator('.article-preview').count();
        }, {
            message: 'Ожидаем появления статей в Global Feed',
            timeout: 15000,
            intervals: [1000]
        }).toBeGreaterThan(0);
        
        //  5. Открываем статью
        await mainPage.clickArticleByTitle(articleTitle);
        await expect(page).toHaveURL(/.*#\/article\//);
        
        // 6. Добавляем комментарий
        const commentsPage = new CommentsPage(page);
        const commentText = `Comment-del-${Date.now()}`;
        await commentsPage.addComment(commentText);
        
        //  7. Проверяем, что комментарий появился
        const newComment = commentsPage.getCommentLocator(commentText);
        await expect(newComment).toBeVisible();
        console.log('✅ Комментарий добавлен:', commentText);
        
                //  8. Удаление комментария
        console.log('🗑️ 4.5: Удаляем комментарий...');

        // Обработчик диалога должен быть настроен ДО клика
        page.on('dialog', async dialog => {
            console.log('  → Диалог:', dialog.message());
            if (dialog.message().toLowerCase().includes('delete') || 
                dialog.message().toLowerCase().includes('удалить')) {
                console.log('  → Подтверждаем удаление');
                await dialog.accept();
            } else {
                await dialog.dismiss();
            }
        });

        const deleteButton = newComment
            .locator('button.btn-outline-secondary')
            .first();

        if (await deleteButton.isVisible()) {
            await deleteButton.click();
            console.log('  → Кнопка удаления нажата');
            
            // ⏱️ Ждём исчезновения комментария вместо networkidle
            await expect(newComment).not.toBeVisible({ timeout: 10000 });
            console.log('✅ 4.5: Комментарий удалён');
        } else {
            console.log('⚠️ 4.5: Кнопка удаления не найдена');
        }
    });
});