// tests/4.5.YourSettings.test.js
import { test, expect } from '@playwright/test';
import { SettingsPage } from '../src/pages/settings.page.js';

test.describe('4.5.Изменение личных настроек', () => {
  test('Изменение личных настроек', async ({ page }) => {
    const settingsPage = new SettingsPage(page);

    // 🔹 Открываем настройки (метод сам ждёт загрузку)
    await settingsPage.openSettings();

    // 🔹 Данные для обновления
    const newSettings = {
      username: 'TestUser-' + Date.now(),
      bio: 'молодой QA',
      email: 'test@example.com',
      password: 'Test123!',
      image: 'https://google.com/logo.png',
    };

    console.log('Новые настройки:', newSettings);

    // 🔹 Обновляем
    await settingsPage.updateSettings(newSettings);

    // 🔹 Проверяем: страница не упала, можно продолжить
    await expect(settingsPage.usernameInput).toHaveValue(newSettings.username);

    console.log('✅4.5 Настройки успешно обновлены');
  });
});
