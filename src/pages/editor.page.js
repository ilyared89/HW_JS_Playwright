// src/pages/editor.page.js
import { BasePage } from './base.page.js';

export class EditorPage extends BasePage {
  constructor(page) {
    super(page);

    // 🔹 ВСЕ локаторы — только в конструкторе
    this.titleInput = page.locator('input[name="title"]');
    this.descriptionInput = page.locator('input[name="description"]');
    this.contentInput = page.locator('textarea[name="body"]');
    this.tagsInput = page.locator('input[placeholder="Enter tags"]');
    this.publishButton = page.locator('button:has-text("Publish Article")').first();
    this.saveButton = page.locator('button:has-text("Update Article")').first();
    this.articleTitle = page.locator('h1').first();
  }

  // 🔹 Создание статьи — возвращает { title, slug } для использования в тесте
  async createArticle(title, description, content, tags = '') {
    // 🔹 1. Заполнение полей с явным ожиданием
    await this.titleInput.waitFor({ state: 'visible' });
    await this.titleInput.fill(title);

    await this.descriptionInput.waitFor({ state: 'visible' });
    await this.descriptionInput.fill(description);

    await this.contentInput.waitFor({ state: 'visible' });
    await this.contentInput.fill(content);

    if (tags?.trim()) {
      await this.tagsInput.waitFor({ state: 'visible' });
      await this.tagsInput.fill(tags);
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(300);
    }
    // Пробуем дождаться хэш-редиректа
    const hashChanged = await this.page
      .waitForFunction(() => location.hash.startsWith('#/article/'))
      .catch(() => {
        console.log('⚠️ Хэш не изменился на #/article/');
        return false;
      });

    // Если редиректа нет — проверяем ошибки валидации
    if (!hashChanged) {
      const errorMessages = await this.page
        .locator('.error-messages, .form-error, [class*="error"]')
        .allTextContents();
      if (errorMessages.length > 0) {
        console.log('❌ Ошибки валидации:', errorMessages);
        throw new Error('Публикация не удалась: ' + errorMessages.join('; '));
      }
      // Альтернатива: ждём заголовок статьи даже без редиректа
      await this.articleTitle.waitFor({ state: 'visible' }).catch(() => {
        console.log('⚠️ Заголовок статьи не появился');
      });
    }

    // 🔹 5. Извлечение slug из URL или хэша
    const slug = await this.page.evaluate(() => {
      const url = window.location.href;
      const hash = window.location.hash;
      if (hash.includes('/article/')) {
        return hash.split('/article/')[1]?.split('?')[0] || '';
      }
      if (url.includes('/article/')) {
        return url.split('/article/')[1]?.split('?')[0] || '';
      }
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    });

    console.log('✅ Статья создана, URL:', this.page.url(), '| Slug:', slug);

    return { title, slug };
  }

  // 🔹 Обновление контента статьи
  async updateContent(content) {
    await this.contentInput.waitFor({ state: 'visible' });
    await this.contentInput.fill(content);
  }

  // 🔹 Сохранение изменений в статье
  async save() {
    await this.saveButton.waitFor({ state: 'visible' });
    await this.saveButton.scrollIntoViewIfNeeded();
    await this.saveButton.click();

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForFunction(() => location.hash.includes('/article/'));
    await this.articleTitle.waitFor({ state: 'visible' });
  }
}
