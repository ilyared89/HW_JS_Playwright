// tests/4.2.3.EditArticle.test.js
import { test, expect } from "@playwright/test";
import { MainPage } from "../src/pages/main.page.js";
import { EditorPage } from "../src/pages/editor.page.js";
import { ArticlePage } from "../src/pages/article.page.js";
import { loadArticleData } from "./shared/article-data.js";

test.describe("4.2.3: Редактирование статьи", () => {
  test("изменение содержимого статьи", async ({ page }) => {
    const article = loadArticleData();
    await expect(
      article?.title,
      "❌ Статья не найдена. Запустите тест 4.1!",
    ).toBeTruthy();

    const mainPage = new MainPage(page);
    const editorPage = new EditorPage(page);
    const articlePage = new ArticlePage(page);

    await mainPage.open();
    await mainPage.clickGlobalFeed();
    await mainPage.waitForArticles();
    await mainPage.clickArticleByTitle(article.title);

    await expect(page).toHaveURL(/.*#\/article\//);

    // 🔹 ИСПРАВЛЕНО: используем локатор из Page Object
    await expect(mainPage.articleTitle).toContainText(article.title);

    await articlePage.clickEditArticle();
    await expect(page).toHaveURL(/.*#\/editor\//);

    const updatedContent = "Updated: " + Date.now();
    await editorPage.updateContent(updatedContent);
    await editorPage.save();

    await expect(page).toHaveURL(/.*#\/article\//);
    console.log("✅ 4.2.3: Статья отредактирована");
  });
});
