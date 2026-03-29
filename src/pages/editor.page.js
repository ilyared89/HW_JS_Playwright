// src/pages/editor.page.js
import { BasePage } from './base.page.js';
import { expect } from '@playwright/test';

export class EditorPage extends BasePage {
  constructor(page) {
    super(page);

    // 🔹 Все локаторы в конструкторе
    this.titleInput = page.locator('input[name="title"]');
    this.descriptionInput = page.locator('input[name="description"]');
    this.contentInput = page.locator('textarea[name="body"]');
    this.tagsInput = page.locator('input[placeholder="Enter tags"]');
    this.publishButton = page.locator('button:has-text("Publish Article")').first();
    this.saveButton = page.locator('button:has-text("Update Article")').first();
  }

  async createArticle(title, description, content, tags = '') {
    // 🔹 1. Заполняем поля
    await this.titleInput.waitFor({ state: 'visible' });
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.contentInput.fill(content);

    // 🔹 2. Теги: только если переданы
    if (tags?.trim()) {
      await this.tagsInput.fill(tags);
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(300);
    }

    // 🔹 3. Ждём, что кнопка видима и включена
    await this.publishButton.waitFor({ state: 'visible' });
    await expect(this.publishButton).toBeEnabled();
    await this.publishButton.scrollIntoViewIfNeeded();

    // 🔹 4. Кликаем по кнопке публикации
    await this.publishButton.click();

    // 🔹 5. Ждём редирект через изменение хэша (для hash-роутинга)
    await this.page.waitForFunction(() => location.hash.includes('/article/'));

    // 🔹 6. Финальное ожидание: заголовок статьи
    await this.page.locator('h1').first().waitFor({ state: 'visible' });
    await this.page.waitForTimeout(500);

    console.log('✅ Статья создана, URL:', this.page.url());
  }

  async updateContent(content) {
    // 🔹 Ждём видимости поля перед заполнением
    await this.contentInput.waitFor({ state: 'visible' });
    await this.contentInput.fill(content);
  }

  async save() {
    await this.saveButton.waitFor({ state: 'visible' });
    await expect(this.saveButton).toBeEnabled();
    await this.saveButton.scrollIntoViewIfNeeded();
    await this.saveButton.click();

    await this.page.waitForFunction(() => location.hash.includes('/article/'));
    await this.page.locator('h1').first().waitFor({ state: 'visible' });
  }
}
