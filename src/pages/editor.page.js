// src/pages/editor.page.js
import { BasePage } from './base.page.js';
import { expect } from '@playwright/test';

export class EditorPage extends BasePage {
    constructor(page) {
        super(page);
        
        // 🔹 ВСЕ локаторы в конструкторе
        this.titleInput = page.locator('input[name="title"]');
        this.descriptionInput = page.locator('input[name="description"]');
        this.contentInput = page.locator('textarea[name="body"]');
        this.tagsInput = page.locator('input[placeholder="Enter tags"]');
        this.publishButton = page.locator('button:has-text("Publish Article")').first();
        this.saveButton = page.locator('button:has-text("Update Article")').first();
        this.articleTitle = page.locator('h1');
    }

    async createArticle(title, description, content, tags = '') {
        // 🔹 Надёжный ввод: fill()
        await this.titleInput.fill(title);
        await this.descriptionInput.fill(description);
        await this.contentInput.fill(content);
        
        // 🔹 Теги: только если переданы
        if (tags?.trim()) {
            await this.tagsInput.fill(tags);
            await this.page.keyboard.press('Enter');
        }
        
        // 🔹 Публикация: ждём видимость и кликаем
        await this.publishButton.waitFor({ state: 'visible' });
        await expect(this.publishButton).toBeEnabled();
        await this.publishButton.scrollIntoViewIfNeeded();
        await this.publishButton.click();
        
        // 🔹 🔥 Надёжное ожидание для hash-роутинга (SPA)
        // Ждём появление заголовка статьи вместо ненадёжного waitForURL
        await this.articleTitle.waitFor({ state: 'visible', timeout: 15000 });
        
        // 🔹 Дополнительно: ждём контент статьи (используем this.page!)
        await this.page.locator('.article-content, .article-page p').first().waitFor({ state: 'visible', timeout: 10000 });
    }

    async updateContent(content) {
        await this.contentInput.fill(content);
    }
    
    async save() {
        await this.saveButton.waitFor({ state: 'visible' });
        await expect(this.saveButton).toBeEnabled();
        await this.saveButton.scrollIntoViewIfNeeded();
        await this.saveButton.click();
        
        // 🔹 То же самое для редактирования
        await this.articleTitle.waitFor({ state: 'visible', timeout: 15000 });
    }
}