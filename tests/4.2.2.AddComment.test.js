// tests/4.2.2.AddComment.test.js
import { test, expect } from "@playwright/test";
import { MainPage } from "../src/pages/main.page.js";
import { CommentsPage } from "../src/pages/comments.page.js";
import { loadArticleData } from "./shared/article-data.js";

test.describe("4.2.2: Добавление комментария", () => {
  test("добавление комментария к статье", async ({ page }) => {
    const article = loadArticleData();

    // Проверка без if
    await expect(
      article?.title,
      "Статья не найдена. Запустите сначала тест 4.1!",
    ).toBeTruthy();

    const mainPage = new MainPage(page);
    const commentsPage = new CommentsPage(page);

    await mainPage.open();

    // ✅ Ищем в Global Feed (там все статьи)
    await mainPage.clickGlobalFeed();

    // Ожидание загрузки
    await mainPage.waitForArticles();

    // Открытие статьи
    await mainPage.clickArticleByTitle(article.title);

    await expect(page).toHaveURL(/.*#\/article\//);

    // Добавление комментария
    const commentText = `Comment-4.3-${Date.now()}`;
    await commentsPage.addComment(commentText);

    const newComment = commentsPage.getCommentLocator(commentText);
    await expect(newComment).toBeVisible();

    console.log("✅ 4.2.2: Комментарий добавлен:", commentText);
  });
});
