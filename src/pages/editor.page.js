// src/pages/editor.page.js
import { BasePage } from './base.page.js';
import { expect } from '@playwright/test';

// ✅ КРИТИЧНО: именованный export class (не export default!)
export class EditorPage extends BasePage {
    constructor(page) {
        super(page);
        
        // 🔹 Все локаторы в конструкторе (#3, #4)
        this.titleInput = page.locator('input[name="title"]');
        this.descriptionInput = page.locator('input[name="description"]');
        this.contentInput = page.locator('textarea[name="body"]');
        //this.tagsInput = page.locator('input[name="tags"]');
        this.publishButton = page.locator('button:has-text("Publish Article")').first();
        this.saveButton = page.locator('button:has-text("Update Article")').first();
        this.articleTitle = page.locator('h1');
    }

    // 🔹 Создаёт статью — теги опциональны (#6 — клик только здесь)
    async createArticle(title, description, content, tags = '') {
        // 🔹 Нативный ввод для React (#2 — без timeout)
        await this.titleInput.click();
        await this.titleInput.pressSequentially(title);
        
        await this.descriptionInput.click();
        await this.descriptionInput.pressSequentially(description);
        
        await this.contentInput.click();
        await this.contentInput.pressSequentially(content);
        
        // 🔹 Теги: только если переданы
        if (tags && tags.trim()) {
            await this.tagsInput.click();
            await this.tagsInput.pressSequentially(tags);
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(50);
        }
        
        // 🔹 Отправка: Enter + клик по кнопке (#6)
        await this.contentInput.press('Enter');
        await expect(this.publishButton).toBeVisible();
        await this.publishButton.scrollIntoViewIfNeeded();
        await this.publishButton.click();
        
        // 🔹 Ждём сеть и редирект
        await this.page.waitForLoadState('networkidle');
        await expect(this.page).toHaveURL(/article/);
        await expect(this.articleTitle).toBeVisible();
    }

    async updateContent(content) {
        await this.contentInput.fill(content);
    }
    
    async save() {
        await expect(this.saveButton).toBeVisible();
        await this.saveButton.scrollIntoViewIfNeeded();
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        await expect(this.page).toHaveURL(/article/);
    }
}  