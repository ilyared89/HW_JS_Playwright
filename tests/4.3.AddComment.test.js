// tests/4.3.AddComment.test.js
import { test, expect } from '@playwright/test';
import { AuthPage } from '../src/pages/auth.page.js';
import { MainPage } from '../src/pages/main.page.js';
import { EditorPage } from '../src/pages/editor.page.js';
import { CommentsPage } from '../src/pages/comments.page.js';

test.describe('4.3: Добавление комментария', () => {
    test('добавление комментария к статье', async ({ page }) => {
        
        // 1. Авторизация
        const authPage = new AuthPage(page);
        await authPage.login('test@example.com', 'password123');
        
        // 2. Создаём статью (тест самодостаточен!)
        const mainPage = new MainPage(page);
        await mainPage.open();
        await mainPage.clickNewArticle();
        
        const editorPage = new EditorPage(page);
        const articleTitle = `Article-4.3-${Date.now()}`;
        
        await editorPage.createArticle(
            articleTitle,
            'Description for 4.3',
            'Content for 4.3',
            'test43'
        );
        
        // 3. Переходим к статье (она уже открыта после создания)
        await mainPage.open();
        await mainPage.clickYourFeed();
        
        await expect(page).toHaveURL(/.*#\/article\//);
        
        // 4. Добавляем комментарий
        const commentsPage = new CommentsPage(page);
        const commentText = `Comment-4.3-${Date.now()}`;
        
        await commentsPage.addComment(commentText);
        
        console.log('✅ 4.3: Комментарий добавлен:', commentText);
    });
});