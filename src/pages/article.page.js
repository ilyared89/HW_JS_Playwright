// src/pages/article.page.js
import { BasePage } from './base.page.js';
import { expect } from '@playwright/test';

export class ArticlePage extends BasePage {
    constructor(page) {
        super(page);
        
        this.articleTitle = page.locator('h1');
        this.articleContent = page.locator('.article-content, .article-page p').first();
        this.articleMeta = page.locator('.article-meta');
        
        // Кнопка редактирования
        this.editArticleButton = page.locator('button:has-text("Edit Article")').first();
        
        // Кнопки лайка
        this.favoriteButton = page.locator('button:has-text("Favorite")').first();
        this.favoritedButton = page.locator('button:has-text("Favorited")').first();
        
        // Кнопка удаления
        this.deleteArticleButton = page.locator('button:has-text("Delete Article")').first();
        
        // Для проверки авторства
        this.articleAuthor = page.locator('.article-meta a[href*="#/profile/"]').first();
        this.currentUser = page.locator('.nav-link[href*="#/profile/"]').first();
    }

    async clickFavorite() {
        await this.favoriteButton.click();
    }

    async waitForFavoriteState() {
        await expect(this.favoritedButton).toBeVisible();
    }
   
    async clickEditArticle() {
        await this.articleTitle.waitFor({ state: 'visible' });
        
        // Проверяем видимость кнопки через expect (без if)
        await expect(this.editArticleButton, 'Кнопка Edit Article не видна').toBeVisible();
        
        await this.editArticleButton.click();
    }
    
    async isEditButtonVisible() {
        return this.editArticleButton.isVisible().catch(() => false);
    }
    
    async waitForArticleLoaded() {
        await this.articleTitle.waitFor({ state: 'visible' });
    }
    
    // ✅ Получение текста для отладки (без if)
    async getAuthorInfo() {
        const author = await this.articleAuthor.textContent();
        const user = await this.currentUser.textContent();
        return { author: author?.trim(), user: user?.trim() };
    }
}