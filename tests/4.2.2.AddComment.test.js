import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { CommentsPage } from '../src/pages/comments.page.js';
import { loadArticleData } from './shared/article-data.js';

test.describe('4.2.2: Добавление комментария', () => {
    test('добавление комментария к статье', async ({ page }) => {
        
        const article = loadArticleData();
        if (!article?.title) {
            throw new Error('❌ Статья не найдена. Запустите сначала тест 4.1!');
        }
        
        const mainPage = new MainPage(page);
        const commentsPage = new CommentsPage(page);
        
        await mainPage.open();
        await mainPage.clickGlobalFeed();  // 🔹 Глобальная лента
        
        await page.locator('a[href*="/article/"]:has(h1)').first().waitFor({ state: 'visible' });
        
        const articleLink = page
            .locator(`a[href*="/article/"]:has(h1:has-text("${article.title}"))`)
            .first();
        await articleLink.click();
        
        await expect(page).toHaveURL(/.*#\/article\//);
        
        const commentText = `Comment-4.3-${Date.now()}`;
        await commentsPage.addComment(commentText);
        
        await expect(commentsPage.getCommentLocator(commentText)).toBeVisible();
        console.log('✅ 4.2.2: Комментарий добавлен:', commentText);
    });
});