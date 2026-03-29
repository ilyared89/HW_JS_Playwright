// tests/4.2.3.EditArticle.test.js
import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { EditorPage } from '../src/pages/editor.page.js';
import { ArticlePage } from '../src/pages/article.page.js';
import { loadArticleData } from './shared/article-data.js';

test.describe('4.2.3: Редактирование статьи', () => {
    test('изменение содержимого статьи', async ({ page }) => {
        
        const mainPage = new MainPage(page);
        const editorPage = new EditorPage(page);
        const articlePage = new ArticlePage(page);
        
        // 🔹 Загружаем данные статьи из 4.1
        const article = loadArticleData();
        await expect(article?.slug, '❌ Статья не найдена. Запустите тест 4.1!').toBeTruthy();
        
        // 🔹 Открываем статью по slug
        await mainPage.openArticleBySlugAndTitle(article.slug, article.title);
        
        // 🔹 ✅ ИСПРАВЛЕНО: Используем методы из Page Object (не page.locator!)
        await mainPage.clickEditArticle();      // ✅ Вместо editButton.click()
        await mainPage.waitForEditorLoaded();   // ✅ Вместо page.locator(...).waitFor()
        
        // 🔹 Редактируем контент
        const newContent = `Updated content ${Date.now()}`;
        await editorPage.updateContent(newContent);
        
        // 🔹 Сохраняем изменения
        await editorPage.save();
        
        // 🔹 Проверяем обновление
        await expect(articlePage.articleContent).toContainText(newContent);
        
        console.log('✅ 4.2.3: Статья отредактирована');
    });
});