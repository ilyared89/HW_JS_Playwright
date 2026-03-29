// src/pages/settings.page.js
import { BasePage } from './base.page.js';
import { expect } from '@playwright/test';

export class SettingsPage extends BasePage {
  constructor(page) {
    super(page);

    // 🔹 Локаторы в конструкторе (#3, #4)
    this.profileImageInput = page.locator('input[name="image"]');
    this.usernameInput = page.locator('input[name="username"]');
    this.bioInput = page.locator('textarea[name="bio"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.updateSettingsButton = page.locator('button:has-text("Update Settings")');
  }

  async openSettings() {
    // 🔹 .trim() убирает пробелы в конце!
    await this.page.goto('https://realworld.qa.guru/#/settings'.trim());
    await expect(this.usernameInput).toBeVisible();
  }

  async updateSettings(settings) {
    // Заполняем поля
    await this.usernameInput.fill(settings.username);
    await this.bioInput.fill(settings.bio);
    await this.emailInput.fill(settings.email);
    await this.passwordInput.fill(settings.password);
    await this.profileImageInput.fill(settings.image.trim());

    // 🔹 Простой надёжный селектор
    const submitButton = this.page.locator('button:has-text("Update Settings")').first();

    // 🔹 Скроллим и кликаем
    await submitButton.scrollIntoViewIfNeeded();
    await submitButton.click();

    // 🔹 ПРОВЕРЯЕМ РЕЗУЛЬТАТ: поля содержат новые значения
    // Это работает, даже если страница обновилась после клика
    await expect(this.usernameInput).toHaveValue(settings.username);
    await expect(this.emailInput).toHaveValue(settings.email);
  }
}
