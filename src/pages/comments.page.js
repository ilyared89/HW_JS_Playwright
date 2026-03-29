// src/pages/comments.page.js
import { BasePage } from "./base.page.js";
import { expect } from "@playwright/test";

export class CommentsPage extends BasePage {
  constructor(page) {
    super(page);

    // Все локаторы в конструкторе
    this.commentField = page.locator(
      'textarea[placeholder="Write a comment..."]',
    );
    this.postCommentButton = page.locator('button:has-text("Post Comment")');
    this.commentsContainer = page.locator(".card");

    // ✅ Обработчик диалога в конструкторе — читаемый вариант
    page.on("dialog", async (dialog) => {
      const isDelete = dialog.message().toLowerCase().includes("delete");
      await (isDelete ? dialog.accept() : dialog.dismiss());
    });
  }

  async addComment(text) {
    await this.commentField.fill(text);
    await this.postCommentButton.click();
    await expect(this.commentField).toHaveValue("");
  }

  getCommentLocator(text) {
    return this.commentsContainer.filter({ hasText: text }).first();
  }

  // ✅ Упрощённое удаление — без сложных ожиданий сети
  async deleteComment(text) {
    const comment = this.getCommentLocator(text);

    // Ждём видимости
    await expect(comment).toBeVisible();

    // Кнопка удаления внутри комментария
    const deleteBtn = comment.locator("button.btn-outline-secondary").first();
    await expect(deleteBtn).toBeVisible();

    // Клик
    await deleteBtn.click();

    // Ждём исчезновения (диалог обрабатывается автоматически!)
    await expect(comment).not.toBeVisible();
  }
}
