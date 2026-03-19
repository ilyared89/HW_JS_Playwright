// tests/4.4.EditArticle.test.js
import { test, expect } from '@playwright/test';
import { AuthPage } from '../src/pages/auth.page.js';
import { MainPage } from '../src/pages/main.page.js';
import { EditorPage } from '../src/pages/editor.page.js';
import { ArticlePage } from '../src/pages/article.page.js';

test.describe('4.4: Редактирование статьи', () => {
    test('изменение содержимого статьи', async ({ page }) => {
        
        //  1. Авторизация
        const authPage = new AuthPage(page);
        await authPage.login('test@example.com', 'password123');
        
        //  2. Создаём статью (тест самодостаточен!)
        const mainPage = new MainPage(page);
        await mainPage.open();
        await mainPage.clickNewArticle();
        
        const editorPage = new EditorPage(page);
        const articleTitle = `Article-4.4-${Date.now()}`;
        const originalContent = 'Original content for 4.4';
        const updatedContent = `Updated content ${Date.now()}`;
        
        await editorPage.createArticle(
            articleTitle,
            'Description for 4.4',
            originalContent,
            'test44'
        );
        
        //  3. Возвращаемся и открываем статью через ленту
        await mainPage.open();
        await mainPage.clickGlobalFeed();
                
        await expect(page).toHaveURL(/.*#\/article\//);
        const articlePage = new ArticlePage(page);
        await expect(articlePage.articleTitle).toContainText(articleTitle);
        
        //  4. Редактируем статью
        await articlePage.clickEditArticle();
        await expect(page).toHaveURL(/.*#\/editor\//);
        
        //  5. Меняем контент и сохраняем
        await editorPage.updateContent(updatedContent);
        await editorPage.save();
        
        console.log('✅ 4.4: Статья отредактирована:', articleTitle);
    });
});