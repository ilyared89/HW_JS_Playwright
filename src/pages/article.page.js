// src/pages/article.page.js
import { BasePage } from './base.page.js';
import { expect } from '@playwright/test';

export class ArticlePage extends BasePage {
    constructor(page) {
        super(page);
        
        this.articleTitle = page.locator('h1');
        this.articleContent = page.locator('.article-content, .article-page p').first();
        this.articleMeta = page.locator('.article-meta');
        
        // 🔹 Кнопка редактирования: текст ИЛИ иконка ИЛИ позиция
        this.editArticleButton = page.locator(
            'button:has-text("Edit Article"), ' +
            'button:has(.ion-edit), ' +
            '.article-meta button.btn-outline-secondary:first-child'
        ).first();
        
        // Кнопки лайка
        this.favoriteButton = page.locator('.btn-outline-primary:has-text("Favorite"), .btn-outline-primary:has-text("♥")').first();
        this.favoritedButton = page.locator('.btn-primary:has-text("Favorited")').first();
        
        // Кнопка удаления
        this.deleteArticleButton = page.locator('button:has-text("Delete Article")').first();
    }

    async isFavorited() {
        return this.favoritedButton.isVisible().catch(() => false);
    }

    async clickFavorite() {
        await this.favoriteButton.waitFor({ state: 'visible' });
        await this.favoriteButton.scrollIntoViewIfNeeded();
        await this.favoriteButton.click();
    }

    async waitForFavoriteState() {
        await expect(this.favoritedButton).toBeVisible();
    }
   
    async clickEditArticle() {
        await this.articleTitle.waitFor({ state: 'visible' });
          
    // 🔹 Проверка: видим ли мы кнопку редактирования?
    const isVisible = await this.editArticleButton.isVisible().catch(() => false);
    if (!isVisible) {
        // 🔹 Отладка: кто автор, кто текущий пользователь
        const articleAuthor = await this.page.locator('.article-meta a[href*="#/profile/"]').first().textContent();
        const currentUser = await this.page.locator('.nav-link[href*="#/profile/"]').first().textContent();
        throw new Error(`❌ Кнопка "Edit" не видна. Автор: "${articleAuthor?.trim()}", Текущий: "${currentUser?.trim()}"`);
    }
        await this.editArticleButton.waitFor({ state: 'visible' });
        await this.editArticleButton.scrollIntoViewIfNeeded();
        await this.editArticleButton.click();
    }
    
    async isEditButtonVisible() {
        // 🔹 Важно: .catch(() => false) — полная запись!
        return this.editArticleButton.isVisible().catch(() => false);
    }
    
    async waitForArticleLoaded() {
        await this.articleTitle.waitFor({ state: 'visible' });
    }
}  