// tests/4.1.CreateArticle.test.js
import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { EditorPage } from '../src/pages/editor.page.js';
import { saveArticleData } from './shared/article-data.js';

// ✅ Используем сессию из global.setup.js
//test.use({ storageState: 'tests/.auth/user.json' });

test.describe('4.1: Создание статьи', () => {
  test('создание новой статьи', async ({ page }) => {
    
    const mainPage = new MainPage(page);
    await mainPage.open();
    await expect(mainPage.yourFeedTab).toBeVisible();
    await mainPage.clickNewArticle();
    
    const editorPage = new EditorPage(page);
    const articleTitle = `Article-${Date.now()}`;
    
    await editorPage.createArticle(
      articleTitle,
      'Test description',
      'Test content'
    );
    
    await expect(page).toHaveURL(/.*#\/article\//);
    await expect(editorPage.articleTitle).toContainText(articleTitle);
    
    const slug = articleTitle.toLowerCase().replace(/\s+/g, '-');
    saveArticleData({ 
      title: articleTitle,
      slug: slug,
      description: 'Test description',
      content: 'Test content'
    });
    
    console.log('✅ 4.1: Статья создана:', articleTitle);
  });
});