// src/pages/main.page.js
import { BasePage } from './base.page.js';
import { expect } from '@playwright/test';

export class MainPage extends BasePage {
    
    constructor(page) {
        super(page);
        this.signInLink = page.getByText('Login', { exact: true });
        this.yourFeedTab = page.getByText('Your Feed', { exact: true });
        this.globalFeedButton = page.locator('button:has-text("Global Feed")');
        this.newArticleLink = page.getByRole('link', { name: 'New Article' });
    }

    async open() { await super.open('#/'); }
    async clickSignIn() { await this.signInLink.click(); }
    async clickYourFeed() { await this.yourFeedTab.click(); }
    async clickGlobalFeed() { await this.globalFeedButton.click(); }
    async clickNewArticle() { await this.newArticleLink.click(); }
    
    // 🔹 Исправленный метод — кликаем по ссылке на статью, не на профиль
    async clickArticleByTitle(title) {
        // Ждём появления превью
        await this.page.locator('.article-preview').first().waitFor({ state: 'visible', timeout: 10000 });
        
        // Ищем превью, содержащее наш заголовок
        const articlePreview = this.page
            .locator('.article-preview')
            .filter({ hasText: title })
            .first();
        
        await expect(articlePreview, `Статья "${title}" не найдена`).toBeVisible({ timeout: 5000 });
        
        // ✅ Кликаем по ссылке "Read more..." — она ведёт на статью
        // Или ищем ссылку по href содержащему /article/
        const articleLink = articlePreview.locator('a').filter({ hasText: /Read more/i });
        
        // Если "Read more" не найден, ищем по href
        if (await articleLink.count() === 0) {
            await articlePreview.locator('a[href*="#/article/"]').first().click();
        } else {
            await articleLink.click();
        }
        
        console.log('✅ Статья открыта:', title);
    }
}