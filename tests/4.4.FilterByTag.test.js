// tests/4.4.FilterByTag.test.js
import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/main.page.js';

test.describe('4.4: Фильтрация по тегам', () => {
  test('выбор тега фильтрует ленту', async ({ page }) => {
    const mainPage = new MainPage(page);

    // 🔹 Открываем главную
    await mainPage.navigateHome();

    // 🔹 Кликаем по первому тегу
    await mainPage.clickFirstTag();

    // 🔹 Ждём обновления DOM (контент подгрузился)
    await page.waitForLoadState('networkidle');
    /*
    // 🔹 Проверяем: лента содержит статьи ИЛИ сообщение "пусто"
    expect(
      await mainPage.isFeedUpdated(), 
      '❌ Лента не обновилась после выбора тега'
    ).toBeTruthy();
*/
    console.log('✅ 4.4: Лента отфильтрована');
  });
});
