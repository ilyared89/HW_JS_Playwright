// src/pages/comments.page.js
import { BasePage } from './base.page.js';
import { expect } from '@playwright/test';

export class CommentsPage extends BasePage {
    constructor(page) {
        super(page);
        this.commentField = page.locator('textarea.form-control[placeholder="Write a comment..."]');
        this.postCommentButton = page.locator('button.btn.btn-sm.btn-primary:has-text("Post Comment")');
        this.commentsContainer = page.locator('.card');
    }

    async addComment(text) {
        await this.commentField.waitFor({ state: 'visible' });
        await this.commentField.clear();
        await this.commentField.fill(text);
        await this.postCommentButton.click();
        await expect(this.commentField).toHaveValue('');
    }

    getCommentLocator(text) {
        return this.commentsContainer.filter({ hasText: text }).first();
    }

    // ✅ Новый метод удаления комментария
    async deleteComment(text) {
        const commentCard = this.commentsContainer.filter({ hasText: text }).first();
        
        // Кликаем по последней кнопке в карточке (иконка удаления)
        await commentCard.locator('button').last().click();
    }
}