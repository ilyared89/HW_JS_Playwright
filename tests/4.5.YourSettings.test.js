// tests/4.5.YourSettings.test.js
import { test, expect } from "@playwright/test";
import { SettingsPage } from "../src/pages/settings.page.js";
import { faker } from "@faker-js/faker";

test("4.5.Изменение личных настроек", async ({ page }) => {
  const newSettings = {
    username: faker.person.fullName({ lastName: "Bin" }),
    bio: "молодой QA",
    email: faker.internet.email(),
    password: "Test123!",
    image: "https://google.com/logo.png",
  };

  console.log("Новые настройки:", newSettings);

  const settingsPage = new SettingsPage(page);
  await settingsPage.openSettings();
  await settingsPage.updateSettings(newSettings);

  // ✅ Проверка через метод пейджа
  await expect(settingsPage.usernameInput).toHaveValue(newSettings.username);
  await expect(settingsPage.emailInput).toHaveValue(newSettings.email);
  console.log("✅4.5 Настройки успешно обновлены");
});
