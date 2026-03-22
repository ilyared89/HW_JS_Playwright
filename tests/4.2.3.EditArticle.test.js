import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { EditorPage } from '../src/pages/editor.page.js';
import { ArticlePage } from '../src/pages/article.page.js';
import { loadArticleData } from './shared/article-data.js';

test.describe('4.2.3: Редактирование статьи', () => {
    test('изменение содержимого статьи', async ({ page }) => {
        
        const article = loadArticleData();      
        const mainPage = new MainPage(page);
        const editorPage = new EditorPage(page);
        const articlePage = new ArticlePage(page);
        
        await mainPage.open();
        await mainPage.clickGlobalFeed();  
        
        await page.locator('a[href*="/article/"]:has(h1)').first().waitFor({ state: 'visible' });
        
        const articleLink = page
            .locator(`a[href*="/article/"]:has(h1:has-text("${article.title}"))`)
            .first();
        await articleLink.click();
        
        await expect(page).toHaveURL(/.*#\/article\//);
        
        // Редактируем
        await articlePage.clickEditArticle();
        await expect(page).toHaveURL(/.*#\/editor\//);
        
        const updatedContent = 'Updated: ' + Date.now();
        await editorPage.updateContent(updatedContent);
        await editorPage.save();
        
        await expect(page).toHaveURL(/.*#\/article\//);
        console.log('✅ 4.2.3: Статья отредактирована');
    });
});