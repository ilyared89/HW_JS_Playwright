// src/pages/comments.page.js
import { BasePage } from './base.page.js';
import { expect } from '@playwright/test';

export class CommentsPage extends BasePage {
  constructor(page) {
    super(page);

    // 🔹 Все локаторы в конструкторе
    this.commentField = page.locator('textarea[placeholder="Write a comment..."]');
    this.postCommentButton = page.locator('button:has-text("Post Comment")');
    this.commentsContainer = page.locator('.card');
    this.deleteButton = page.locator('button:has-text("Delete")');
  }

  // 🔹 Добавление комментария
  async addComment(text) {
    await this.commentField.fill(text);
    await this.postCommentButton.click();
    await this.getCommentLocator(text).waitFor({ state: 'visible' });
  }

  // 🔹 Локатор для конкретного комментария по тексту
  getCommentLocator(text) {
    return this.commentsContainer.filter({ hasText: text }).first();
  }

  // 🔹 Обработчик диалога удаления (вызывать перед кликом по Delete)
  async setupDeleteDialog() {
    this.page.on('dialog', async (dialog) => {
      if (dialog.message().toLowerCase().includes('delete')) {
        await dialog.accept();
      }
    });
  }

  // 🔹 Удаление комментария

  async deleteComment(text) {
    // 🔹 1. Настраиваем обработчик диалога ПЕРЕД кликом
    this.page.on('dialog', async (dialog) => {
      if (dialog.message().toLowerCase().includes('delete')) {
        await dialog.accept();
      }
    });

    // 🔹 2. Находим комментарий
    const comment = this.getCommentLocator(text);

    // 🔹 3. Ждём, что комментарий полностью отрендерился
    await comment.waitFor({ state: 'visible', timeout: 10000 });

    // 🔹 4. Ищем кнопку Delete — пробуем несколько вариантов селектора
    // Вариант А: по тексту (основной)
    let deleteBtn = comment.locator('button:has-text("Delete")').first();

    // Вариант Б: если не найдено — пробуем по классу (для realworld.qa.guru)
    if (!(await deleteBtn.isVisible().catch(() => false))) {
      deleteBtn = comment.locator('button.btn-outline-secondary.btn-sm').first();
    }

    // Вариант В: если всё ещё не найдено — ищем любой button с "delete" в тексте (регистронезависимо)
    if (!(await deleteBtn.isVisible().catch(() => false))) {
      deleteBtn = comment
        .locator('button')
        .filter({ hasText: /delete/i })
        .first();
    }

    // 🔹 5. Ждём видимость кнопки с отладкой
    try {
      await deleteBtn.waitFor({ state: 'visible', timeout: 10000 });
    } catch (e) {
      // 🔥 Отладка: делаем скриншот и логи, если кнопка не появилась
      console.log('❌ Кнопка Delete не найдена для комментария:', text);
      console.log('🔹 URL:', this.page.url());
      await this.page.screenshot({ path: 'debug-no-delete-btn.png', fullPage: true });
      console.log('📸 Скриншот: debug-no-delete-btn.png');
      throw e;
    }

    // 🔹 6. Кликаем и ждём исчезновения комментария
    await deleteBtn.click();

    // 🔹 7. Ждём, что комментарий удалён (исчез из DOM)
    await comment.waitFor({ state: 'detached', timeout: 10000 });
  }
}
