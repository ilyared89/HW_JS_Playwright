// src/pages/editor.page.js
import { BasePage } from './base.page.js';

export class EditorPage extends BasePage {
    constructor(page) {
        super(page);
        
        // 🔹 Поля формы — точные селекторы по placeholder
        this.titleInput = page.locator('input[placeholder="Article Title"]');
        this.descriptionInput = page.locator('input[placeholder="What\'s this article about?"]');
        this.contentInput = page.locator('textarea[placeholder="Write your article (in markdown)"]');
        this.tagsInput = page.locator('input[placeholder="Enter tags"]');
        
        // 🔹 Кнопка: ищем по тексту, но с запасным вариантом
        this.publishButton = page.locator('button:has-text("Publish Article")');
        
        // 🔹 Для проверок
        this.articleTitle = page.locator('h1');
        this.articleContent = page.locator('.article-content').first();
    }

    // 🔹 СОЗДАНИЕ статьи — с обработкой ошибок
    async createArticle(title, description, content, tags) {
        // Заполняем поля
        await this.titleInput.fill(title);
        await this.descriptionInput.fill(description);
        await this.contentInput.fill(content);
        if (tags) await this.tagsInput.fill(tags);
        
        // Кликаем по кнопке
        await this.publishButton.click();
        
        // 🔹 Ждём редирект — но с обработкой таймаута
        try {
            await this.page.waitForURL(/.*#\/article\//, { timeout: 15000 });
        } catch (e) {
            // Если редиректа нет — возможно, ошибка валидации
            const errors = await this.page.locator('.error-messages li').allTextContents();
            if (errors.length > 0) {
                throw new Error(`Форма не валидна: ${errors.join(', ')}`);
            }
            throw e;
        }
    }

    // 🔹 РЕДАКТИРОВАНИЕ: обновить контент
    async updateContent(newText) {
        await this.contentInput.waitFor({ state: 'visible' });
        await this.contentInput.fill(newText);
    }

    // 🔹 РЕДАКТИРОВАНИЕ: обновить заголовок
    async updateTitle(newTitle) {
        await this.titleInput.fill(newTitle);
    }

    // 🔹 СОХРАНЕНИЕ изменений
    async save() {
        // Кнопка может называться "Update Article" при редактировании
        const button = this.page.locator('button:has-text("Update Article"), button:has-text("Publish Article")').first();
        await button.click();
        
        // Ждём редирект
        await this.page.waitForURL(/.*#\/article\//, { timeout: 15000 });
    }

    // 🔹 Комбинированный метод
    async updateAndSave({ content, title }) {
        if (content) await this.updateContent(content);
        if (title) await this.updateTitle(title);
        await this.save();
    }

    // 🔹 Геттеры для проверок
    async getArticleTitle() {
        return this.articleTitle.textContent();
    }
}