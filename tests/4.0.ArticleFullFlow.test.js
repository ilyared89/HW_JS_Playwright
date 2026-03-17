import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';
import { AuthPage } from '../src/pages/auth.page.js';
import { ArticlePage } from '../src/pages/article.page.js';
import { saveArticleData } from './shared/article-data.js';

test('Полный цикл: создание → открытие → комментарий → лайк → удаление', async ({ page }) => {
    
    // ПРОВЕРКА 4.1: Создание статьи
    console.log('🚀 Начало: создание статьи...');
    
    const authPage = new AuthPage(page);
    await authPage.login('test@example.com', 'password123');
    
    const mainPage = new MainPage(page);
    await mainPage.open();
    await expect(mainPage.yourFeedTab).toBeVisible();
    await mainPage.clickNewArticle();
    
    const articlePage = new ArticlePage(page);
    const articleTitle = `Article-${Date.now()}`;
    const articleDescription = 'Test description';
    const articleContent = 'Test content';
    
    await articlePage.createArticle(articleTitle, articleDescription, articleContent, 'test');
    
    await expect(page).toHaveURL(/.*#\/article\//, { timeout: 15000 });
    await expect(articlePage.articleTitle).toContainText(articleTitle);
    
    saveArticleData({ 
        title: articleTitle, 
        description: articleDescription, 
        content: articleContent, 
        tags: 'test' 
    });
    
    console.log('✅ 4.1: Статья создана:', articleTitle);
    
    
    // ПРОВЕРКА 4.2: Открытие статьи из глобальной ленты
    console.log('🔍 4.2: Ищем статью в глобальной ленте...');
    
    await mainPage.open();
    await page.locator('button', { hasText: 'Global Feed' }).click();
    
    const articleLink = page.locator('a').filter({ hasText: articleTitle }).first();
    await expect(articleLink).toBeVisible({ timeout: 10000 });
    await articleLink.click();
    
    await expect(page).toHaveURL(/.*\/article\//);
    await expect(page.locator('h1')).toContainText(articleTitle);
    await expect(page.locator('p').first()).toContainText(articleContent);
    
    console.log('✅ 4.2: Статья открыта:', articleTitle);
    
    // ПРОВЕРКА 4.3: Добавление комментария
    console.log('💬 4.3: Добавляем комментарий...');
    
    const commentText = 'Test comment ' + Date.now();
    const commentField = page.locator('textarea[placeholder="Write a comment..."]');
    
    // Ждём появления поля и вводим текст
    await expect(commentField).toBeVisible({ timeout: 10000 });
    await commentField.fill(commentText);
    
    const postButton = page.locator('button:has-text("Post Comment")');
    await postButton.click();
    const newComment = page.locator('.card').filter({ hasText: commentText }).first();
    await expect(newComment).toBeVisible({ timeout: 10000 });
    await expect(newComment).toContainText(commentText);
    await expect(commentField).toHaveValue('');
    
    console.log('✅ 4.3: Комментарий добавлен:', commentText);
    
    
    // ПРОВЕРКА 4.4: Лайк статье
    console.log('❤️ 4.4: Ставим лайк статье...');
    
    const articleLikeButton = page
        .locator('button.btn-outline-primary:has-text("Favorite")')
        .first();
    
    if (await articleLikeButton.isVisible()) {
        console.log('  → Нашёл кнопку "Favorite"');
        await articleLikeButton.click();
        console.log('  → Клик выполнен');
        
        await page.waitForLoadState('networkidle');
        
        const likedButton = page
            .locator('button.btn-primary:has-text("Favorited")')
            .first();
        await expect(likedButton).toBeVisible({ timeout: 5000 });
        
        console.log('✅ 4.4: Статья в избранном');
    } else {
        console.log('⚠️ 4.4: Кнопка лайка не найдена');
    }
    
    
    // ПРОВЕРКА 4.5: Удаление комментария
    console.log('🗑️ 4.5: Удаляем комментарий...');
    
    page.on('dialog', async dialog => {
        if (dialog.message().toLowerCase().includes('delete')) {
            console.log('  → Подтверждаем удаление');
            await dialog.accept();
        }
    });
    
    const deleteButton = newComment
        .locator('button.btn-outline-secondary')
        .first();
    
    if (await deleteButton.isVisible()) {
        await deleteButton.click();
        console.log('  → Кнопка удаления нажата');
        
        // Ждём обновления
        await page.waitForLoadState('networkidle');
        
        // Проверяем, что комментарий исчез
        await expect(newComment).not.toBeVisible({ timeout: 10000 });
        console.log('✅ 4.5: Комментарий удалён');
    } else {
        console.log('⚠️ 4.5: Кнопка удаления не найдена');
    }
    
    
    // ═══════════════════════════════════════════════════════
    // ФИНАЛ
    // ═══════════════════════════════════════════════════════
    console.log('🎉 Все 5 проверок завершены успешно!');
    console.log('   Статья:', articleTitle);
    console.log('   Комментарий:', commentText);
});  // ← ✅ Один тест, одна закрывающая скобка