// src/pages/article.page.js
import { BasePage } from './base.page.js'; 

export class ArticlePage extends BasePage {
    constructor(page) {
        super(page);
        
        this.articleTitle = page.locator('h1');
        this.articleContent = page.locator('p').first();
        this.articleMeta = page.locator('.article-meta');
        
        // Кнопки управления (оставляем и лайк, и редактирование)
        this.favoriteButton = page
            .locator('.btn-outline-primary:has-text("Favorite")')
            .first();
        this.favoritedButton = page
            .locator('.btn-primary:has-text("Favorited")')
            .first();
        
        // Кнопки статьи
        this.deleteArticleButton = page.locator('button:has-text("Delete Article")').first();
        this.editArticleButton = page.locator('button:has-text("Edit Article")').first();
    }

    async isFavorited() {
        return this.favoritedButton.isVisible().catch(() => false);
    }

    async clickFavorite() {
        if (await this.isFavorited()) {
            console.log('ℹ️ Статья уже в избранном');
            return;
        }
        await this.favoriteButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.favoriteButton.scrollIntoViewIfNeeded();
        await this.favoriteButton.click();
    }

    async waitForFavoriteState() {
        await expect(this.favoritedButton).toBeVisible();
    }
    
   
    async clickEditArticle() {
        await this.editArticleButton.click();
    }
    
    async isEditButtonVisible() {
        return this.editArticleButton.isVisible().catch(() => false);
    }
}