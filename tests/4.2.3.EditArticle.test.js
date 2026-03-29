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

    const article = loadArticleData();
    await expect(article?.slug, '❌ Статья не найдена. Запустите тест 4.1!').toBeTruthy();

    // 🔹 Открываем статью
    await mainPage.openArticleBySlugAndTitle(article.slug, article.title);

    // 🔹 🔥 НОВОЕ: Нажимаем "Edit Article" для перехода в редактор
    const editButton = page.locator('button:has-text("Edit Article")').first();
    await expect(editButton).toBeVisible();
    await editButton.click();

    // 🔹 Ждём загрузки редактора
    await page.locator('input[name="title"]').waitFor({ state: 'visible' });

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
