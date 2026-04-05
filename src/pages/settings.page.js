// src/pages/settings.page.js
import { BasePage } from './base.page.js';

export class SettingsPage extends BasePage {
  constructor(page) {
    super(page);

    this.profileImageInput = page.locator('input[name="image"]');
    this.usernameInput = page.locator('form input[name="username"]').first();
    this.bioInput = page.locator('textarea[name="bio"]');
    this.emailInput = page.locator('form input[name="email"]').first();
    this.passwordInput = page.locator('input[name="password"]');
    this.updateSettingsButton = page.locator('button:has-text("Update Settings")').first();
    //this.settingsHeader = page.locator('h3').first();
  }

  // 🔹 Открытие страницы настроек
  async openSettings() {
    // ✅ Переход с ожиданием загрузки
    await this.page.goto('https://realworld.qa.guru/#/settings', {
      waitUntil: 'networkidle',
    });
    // ✅ 1. Теперь ждём поле username (уже точно на правильной странице)
    await this.usernameInput.waitFor({ state: 'visible' });
    // ✅ 2. Проверяем URL (защита от редиректа на /login)
    await this.page.waitForURL(/#\/settings/, {});
  }

  // 🔹 Обновление настроек
  async updateSettings(settings) {
    if (settings.username) await this.usernameInput.fill(settings.username);
    if (settings.bio) await this.bioInput.fill(settings.bio);
    if (settings.email) await this.emailInput.fill(settings.email);
    if (settings.password) await this.passwordInput.fill(settings.password);
    if (settings.image) await this.profileImageInput.fill(settings.image.trim());

    await this.updateSettingsButton.scrollIntoViewIfNeeded();
    await this.updateSettingsButton.click();

    // Ждём подтверждения обновления
    await this.page.waitForTimeout(1000);
  }
}
