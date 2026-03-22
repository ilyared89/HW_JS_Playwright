// tests/4.1.CreateArticle.test.js
import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { EditorPage } from '../src/pages/editor.page.js';
import { saveArticleData } from './shared/article-data.js';

test.describe('4.1: Создание статьи', () => {
    test('создание новой статьи', async ({ page }) => {
        
        // Переход к созданию
        const mainPage = new MainPage(page);
        await mainPage.open();
        await expect(mainPage.yourFeedTab).toBeVisible();
        await mainPage.clickNewArticle();
        
        // Создание статьи
        const editorPage = new EditorPage(page);
        const articleTitle = `Article-${Date.now()}`;
        
        await editorPage.createArticle(
            articleTitle,
            'Test description',
            'Test content',
            'test'
        );
        
        // Проверки
        await expect(page).toHaveURL(/.*#\/article\//);
        await expect(editorPage.articleTitle).toContainText(articleTitle);
        
        // Сохранение данных для следующих тестов
        saveArticleData({ 
            title: articleTitle,
            description: 'Test description',
            content: 'Test content',
            tags: 'test'
        });
         console.log('✅ 4.1: Статья создана');
    });
});