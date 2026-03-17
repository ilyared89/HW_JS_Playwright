// src/pages/article.page.js
import { BasePage } from './base.page.js';

export class ArticlePage extends BasePage {
    
    constructor(page) {
        super(page);
        
        this.titleInput = page.locator('input[placeholder="Article Title"]');
        this.descriptionInput = page.locator('input[placeholder="What\'s this article about?"]');
        this.contentInput = page.locator('textarea[placeholder="Write your article (in markdown)"]');
        this.tagsInput = page.locator('input[placeholder="Enter tags"]');
        this.submitButton = page.locator('button[type="submit"]');
        
        this.articleTitle = page.locator('h1');
        this.articleContent = page.locator('p').first();
        
        this.commentField = page.locator('textarea[placeholder="Write a comment..."]');
        this.postCommentButton = page.locator('button:has-text("Post Comment")');
        
        this.favoriteButton = page.locator('button.ion-heart').filter({ hasText: 'Favorite' }).first();
        this.favoritedButton = page.locator('button.ion-heart').filter({ hasText: 'Favorited' }).first();   
    }

    async createArticle(title, description, content, tags) {
        await this.titleInput.fill(title);
        await this.descriptionInput.fill(description);
        await this.contentInput.fill(content);
        await this.tagsInput.fill(tags);
        await this.submitButton.click();
    }

    async addComment(text) {
        await this.commentField.waitFor({ state: 'visible', timeout: 10000 });
        await this.commentField.fill(text);
        await this.postCommentButton.click();
    }


async favoriteArticle() {
    const favoriteBtn = this.page
        .locator('button.btn-outline-primary:has-text("Favorite")')
        .first();
    
    const favoritedBtn = this.page
        .locator('button.btn-primary:has-text("Favorited")')
        .first();

    if (await favoritedBtn.isVisible().catch(() => false)) 
        {
        console.log('✅ Статья уже в избранном');
        return;
        }

    await favoriteBtn.waitFor({ state: 'visible', timeout: 10000 });
    await favoriteBtn.click();
    await favoritedBtn.waitFor({ state: 'visible', timeout: 5000 });
    
    console.log('✅ Статья добавлена в избранное');
}
    getCommentLocator(text) {
        return this.page.locator('.card').filter({ hasText: text }).first();
    }

    async deleteComment(commentText) {
        this.page.on('dialog', async dialog => {
            if (dialog.message().toLowerCase().includes('delete')) {
                await dialog.accept();
            }
        });

        const commentCard = this.getCommentLocator(commentText);
        const deleteButton = commentCard.locator('button.btn-outline-secondary').first();
        
        if (await deleteButton.isVisible()) {
            await deleteButton.click();
            await commentCard.waitFor({ state: 'hidden',})
        }
    }
}
