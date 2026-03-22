// tests/4.2.OpenArticle.test.js
import { test, expect } from '@playwright/test';
import { AuthPage } from '../src/pages/auth.page.js';
import { MainPage } from '../src/pages/main.page.js';
import { EditorPage } from '../src/pages/editor.page.js';
import { ArticlePage } from '../src/pages/article.page.js';

test.describe('4.2: Открытие статьи из ленты', () => {
    test('открытие созданной статьи', async ({ page }) => {
        
        // 1. Авторизация
        const authPage = new AuthPage(page);
        await authPage.login('test@example.com', 'password123');
        
        // 2. Создаём статью
        const mainPage = new MainPage(page);
        await mainPage.open();
        await mainPage.clickNewArticle();
        
        const editorPage = new EditorPage(page);
        const articleTitle = `Article-4.2-${Date.now()}`;
        
        await editorPage.createArticle(
            articleTitle,
            'Description for 4.2',
            'Content for 4.2',
            'test42'
        );
        await editorPage.createArticle(
    articleTitle,
    'Description for 4.2',
    'Content for 4.2',
    'test42'
);

        // ⏱️ Ждём, пока статья появится в API (критично!)
        //await page.waitForTimeout(3000);

        // Теперь переходим в Global Feed
        await mainPage.open();
        await mainPage.clickGlobalFeed();
        await mainPage.clickArticleByTitle(articleTitle);
        // 3. Возвращаемся в «Вашу ленту»
        await mainPage.open();
        await mainPage.clickGlobalFeed();
        
        // 4. Ждём загрузки списка статей (убрали networkidle — он может виснуть)
        await page.locator('.article-preview').first().waitFor({ state: 'visible'});
        
        // 5. Открываем статью (ОДИН вызов!)
        await mainPage.clickArticleByTitle(articleTitle);
        
        // 6. Проверка
        await expect(page).toHaveURL(/.*#\/article\//);
        const articlePage = new ArticlePage(page);
        await expect(articlePage.articleTitle).toContainText(articleTitle);
        
        console.log('✅ 4.2: Статья открыта:', articleTitle);
    });
});