/*
:: 1. Убедитесь, что файл статьи не повреждён (опционально)
del tests\shared\article-data.json 2>nul

:: 2. Запустите создание статьи (это создаст JSON)
npx playwright test tests/4.1.NewArticle.test.js

:: 3. Сразу запустите проверку открытия
v
:: ИЛИ одной командой:
npx playwright test tests/4.1.NewArticle.test.js tests/4.2.OpenNewArticle.test.js
*/

import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { saveArticleData } from './shared/article-data.js';  // 🔹 Импорт

test('создание статьи (уже авторизован)', async ({ page }) =>
{   const mainPage = new MainPage(page);
    const articleTitle = `Article-${Date.now()}`;
    const articleDescription = 'Test description';  

    await mainPage.open();
    await expect(mainPage.yourFeedTab).toBeVisible();
    await mainPage.clickNewArticle();
    await expect(page).toHaveURL(/.*\/editor/);

    
    await page.locator('input[placeholder="Article Title"]').fill(articleTitle);
    await page.locator('input[placeholder="What\'s this article about?"]').fill(articleDescription);
    await page.locator('textarea[placeholder="Write your article (in markdown)"]').fill('Content');
    await page.locator('input[placeholder="Enter tags"]').fill('test');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/.*\/article\//, { timeout: 15000 });
    await expect(page.locator('h1')).toContainText(articleTitle);

    saveArticleData ({
        title: articleTitle,
        description: articleDescription,
        content: 'Content',
        tags: 'test',
    });
    
    console.log('✅ Статья создана и сохранена:', articleTitle);

});