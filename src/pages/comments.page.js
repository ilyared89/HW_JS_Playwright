// src/pages/comments.page.js
import { BasePage } from './base.page.js';
import { expect } from '@playwright/test';  // ✅ Добавили импорт

export class CommentsPage extends BasePage {
    constructor(page) {
        super(page);
        // Точные селекторы по вашим классам
        this.commentField = page.locator('textarea.form-control[placeholder="Write a comment..."]');
        this.postCommentButton = page.locator('button.btn.btn-sm.btn-primary:has-text("Post Comment")');
        this.commentsContainer = page.locator('.card');
    }

    async addComment(text) {
        await this.commentField.waitFor({ state: 'visible' });
        await this.commentField.clear();
        await this.commentField.fill(text);
        await this.postCommentButton.click();
        await expect(this.commentField).toHaveValue('');  // Теперь работает
    }

    // 🔹 ВАЖНО: без async, возвращает чистый Locator
    getCommentLocator(text) {
        return this.commentsContainer.filter({ hasText: text }).first();
    }
}