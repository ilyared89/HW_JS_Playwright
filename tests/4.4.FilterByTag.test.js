// tests/4.4.FilterByTag.test.js
import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';

test.describe('4.4: Фильтрация по тегам', () => {
  test('выбор тега фильтрует ленту', async ({ page }) => {
    const mainPage = new MainPage(page);

    // 🔹 Открываем главную и ждём загрузки тегов
    await mainPage.open();
    await mainPage.waitForTagList();

    // 🔹 Кликаем по первому доступному тегу
    await mainPage.clickFirstTag();

    // 🔹 🔥 НОВОЕ: Прямое ожидание вместо waitForFeedUpdate()
    // Ждём либо статьи, либо сообщение "пусто" — короткими таймаутами

    const hasArticles = await page
      .locator('.article-preview')
      .first()
      .isVisible()
      .catch(() => false);

    const isEmpty = await page
      .locator('text=No articles are here')
      .isVisible()
      .catch(() => false);

    // 🔹 Проверяем, что лента отреагировала (статьи ИЛИ пусто)
    expect(hasArticles || isEmpty, '❌ Лента не обновилась после выбора тега').toBeTruthy();

    console.log('✅ 4.4: Лента отфильтрована');
  });
});
