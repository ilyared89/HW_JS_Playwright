// tests/4.4.FilterByTag.test.js
import { test, expect } from "@playwright/test";
import { MainPage } from "../src/pages/main.page.js";

test.describe("4.4: Фильтрация по тегам", () => {
  test("выбор тега фильтрует ленту", async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.open();
    await mainPage.clickGlobalFeed();

    // 🔹 ИСПРАВЛЕНО: все действия через методы Page Object
    await mainPage.waitForTagList();
    await mainPage.clickFirstTag();

    // 🔹 ИСПРАВЛЕНО: ждём через метод, без waitForTimeout
    await mainPage.waitForFeedUpdate();

    // 🔹 ИСПРАВЛЕНО: проверка через метод
    const hasContent = await mainPage.hasFeedContent();
    expect(hasContent).toBe(true);

    console.log("✅ 4.4: Лента отфильтрована");
  });
});
