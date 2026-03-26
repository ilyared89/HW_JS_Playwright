// src/pages/main.page.js
import { BasePage } from './base.page.js';
import { expect } from '@playwright/test';

export class MainPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Навигация
        this.signInLink = page.getByText('Login', { exact: true });
        this.yourFeedTab = page.getByText('Your Feed', { exact: true });
        this.globalFeedButton = page.locator('button:has-text("Global Feed")');
        this.newArticleLink = page.getByRole('link', { name: 'New Article' });
        
        // Статьи
        this.articleCards = page.locator('.article-preview');
        this.readMoreLink = page.locator('.article-preview a').filter({ hasText: /Read more/i }).first();
    }

    async open() { 
        await super.open('#/'); 
    }
    
    async clickYourFeed() { 
        await this.yourFeedTab.click(); 
    }
    
    async clickGlobalFeed() { 
        await this.globalFeedButton.click(); 
        await expect(this.articleCards.first()).toBeVisible();
    }
    
    async waitForArticles() {
        await expect.poll(async () => {
            return await this.articleCards.count();
        }, {
            message: 'Ожидаем появления статей',
            intervals: [500]
        }).toBeGreaterThan(0);
    }
    
    async clickNewArticle() { 
        await this.newArticleLink.click(); 
    }
    
    async openFirstArticle() {
        await expect(this.readMoreLink).toBeVisible();
        await this.readMoreLink.click();
    }
    
    // ✅ Новый метод: прямой переход по slug
    async openArticleBySlug(slug) {
        await this.page.goto(`https://realworld.qa.guru/#/article/${slug}`);
        await this.page.locator('h1').waitFor({ state: 'visible' });
    }
    
    async clickArticleByTitle(title) {
        const article = this.articleCards.filter({ hasText: title }).first();
        await expect(article, `Статья "${title}" не найдена`).toBeVisible();
        await article.locator('a').filter({ hasText: /Read more/i }).click();
        console.log('✅ Статья открыта:', title);
    }
}