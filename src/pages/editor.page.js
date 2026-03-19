// src/pages/editor.page.js
import { BasePage } from './base.page.js';

export class EditorPage extends BasePage {
    constructor(page) {
        super(page);
        
        // ЛОКАТОРЫ в конструкторе (задача 3, 4)
        this.titleInput = page.locator('input[placeholder="Article Title"]');
        this.descriptionInput = page.locator('input[placeholder="What\'s this article about?"]');
        this.contentInput = page.locator('textarea[placeholder="Write your article (in markdown)"]');
        this.tagsInput = page.locator('input[placeholder="Enter tags"]');
        this.submitButton = page.locator('button[type="submit"]');
        
        this.articleTitle = page.locator('h1');
        this.articleContent = page.locator('p').first();
    }

    // ДЕЙСТВИЯ в методах (задача 6)
    async createArticle(title, description, content, tags) {
        await this.titleInput.fill(title);
        await this.descriptionInput.fill(description);
        await this.contentInput.fill(content);
        await this.tagsInput.fill(tags);
        await this.submitButton.click();
    }

    async getArticleTitle() {
        return this.articleTitle.textContent();
    }
     // Методы для редактирования
    async updateArticleContent(newContent) {
        await this.contentInput.waitFor({ state: 'visible' });
        await this.contentInput.fill(newContent);
    }

    async updateArticleTitle(newTitle) {
        await this.titleInput.fill(newTitle);
    }

    async updateArticleDescription(newDescription) {
        await this.descriptionInput.fill(newDescription);
    }

    async saveArticle() {
        await this.submitButton.click();
    }

    async updateAndSave({ title, description, content }) {
        if (title) await this.updateArticleTitle(title);
        if (description) await this.updateArticleDescription(description);
        if (content) await this.updateArticleContent(content);
        await this.saveArticle();
    }
      async updateContent(newText) {
        await this.contentInput.waitFor({ state: 'visible' });
        await this.contentInput.fill(newText);
    }

    async updateTitle(newTitle) {
        await this.titleInput.fill(newTitle);
    }

    async save() {
        await this.submitButton.click();
    }

    async updateAndSave({ content, title }) {
        if (content) await this.updateContent(content);
        if (title) await this.updateTitle(title);
        await this.save();
    }
}