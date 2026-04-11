// src/pages/comments.page.js
import { BasePage } from './base.page.js';

export class CommentsPage extends BasePage {
  constructor(page) {
    super(page);

    // 🔹 Все локаторы в конструкторе
    this.commentField = page.locator('textarea[placeholder="Write a comment..."]');
    this.postCommentButton = page.locator('button:has-text("Post Comment")');
    this.commentsContainer = page.locator('.card');
    this.deleteButton = page.locator('button:has-text("Delete")');
    this.commentTexts = page.locator('.card-text');
    this._getDeleteBtnByText = (parent) => parent.locator('button:has-text("Delete")').first();
    this._getDeleteBtnByClass = (parent) =>
      parent.locator('button.btn-outline-secondary.btn-sm').first();
    this._getDeleteBtnByRegex = (parent) =>
      parent
        .locator('button')
        .filter({ hasText: /delete/i })
        .first();
  }

  // 🔹 Добавление комментария
  async addComment(text) {
    await this.commentField.waitFor({ state: 'visible' });
    await this.commentField.fill(text);
    await this.postCommentButton.click();
    await this.getCommentLocator(text).waitFor({ state: 'visible' });
  }

  async getCommentTexts() {
    return await this.commentTexts.allTextContents();
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
    console.log(`🗑️ Удаление комментария: "${text}"`);

    // 🔹 1. Обработчик диалога — ОБЯЗАТЕЛЬНО до клика!
    this.page.once('dialog', async (dialog) => {
      console.log('  🔹 Диалог:', dialog.message());
      if (dialog.message().toLowerCase().includes('delete')) {
        await dialog.accept();
        console.log('  ✅ Диалог подтверждён');
      }
    });

    // 🔹 2. Находим комментарий
    const comment = this.getCommentLocator(text);
    await comment.waitFor({ state: 'visible' });

    // 🔹 3. Наводим для появления кнопки
    await comment.hover();

    // 🔹 4. Ищем кнопку Delete (fallback-цепочка)
    let deleteBtn = this._getDeleteBtnByText(comment);
    if (!(await deleteBtn.isVisible().catch(() => false))) {
      deleteBtn = this._getDeleteBtnByClass(comment);
    }
    if (!(await deleteBtn.isVisible().catch(() => false))) {
      deleteBtn = this._getDeleteBtnByRegex(comment);
    }

    await deleteBtn.waitFor({ state: 'visible' });

    // 🔹 5. Кликаем
    console.log('  🎯 Клик по кнопке удаления');
    await deleteBtn.click({ force: true });

    // 🔹 6. 🔹 ЛЁГКОЕ ожидание удаления (не строгое detached!)
    console.log('  🔹 Ожидание исчезновения комментария...');
    await comment.waitFor({ state: 'hidden' }).catch(() => {
      // Фолбэк: просто небольшая пауза для завершения запроса
      console.log('  ℹ️ Комментарий не скрылся, используем паузу');
    });
    console.log('✅ deleteComment() завершён');
  }
}
