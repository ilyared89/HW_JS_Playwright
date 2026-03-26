// tests/4.2.3.EditArticle.test.js
import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { EditorPage } from '../src/pages/editor.page.js';
import { ArticlePage } from '../src/pages/article.page.js';
import { loadArticleData } from './shared/article-data.js';

test.describe('4.2.3: Редактирование статьи', () => {
    test('изменение содержимого статьи', async ({ page }) => {
        
        const article = loadArticleData();
        
        // ✅ Проверка без if: expect бросит ошибку, если title нет
        await expect(article?.title, '❌ Статья не найдена. Запустите тест 4.1!').toBeTruthy();
        
        // 🔹 Инициализация страниц
        const mainPage = new MainPage(page);
        const editorPage = new EditorPage(page);
        const articlePage = new ArticlePage(page);
        
        // 🔹 Навигация к статье (все клики — в методах страниц)
        await mainPage.open();
        await mainPage.clickGlobalFeed();
        await mainPage.waitForArticles();
        
        // 🔹 Поиск по части заголовка (метод страницы делает клик!)
        await mainPage.clickArticleByTitle(article.title);
        
        // 🔹 Проверки
        await expect(page).toHaveURL(/.*#\/article\//);
        await expect(page.locator('h1')).toContainText(article.title);
        /*await expect(page.locator('h1')).toContainText(article.title);
        await expect(page).toHaveURL(/.*#\/article\//);*/
        
        // 🔹 Редактирование (клик по кнопке — внутри clickEditArticle)
        await articlePage.clickEditArticle();
        await expect(page).toHaveURL(/.*#\/editor\//);
        
        const updatedContent = 'Updated: ' + Date.now();
        await editorPage.updateContent(updatedContent);
        await editorPage.save();
        
        await expect(page).toHaveURL(/.*#\/article\//);
        console.log('✅ 4.2.3: Статья отредактирована');
    });
});